import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";

import { toast } from "react-toastify";
import { ColumnLayer } from "@deck.gl/layers";
import DeckGL, { DeckGLRef } from "@deck.gl/react";
import MapBox, { MapRef } from "react-map-gl/mapbox";
import { useDispatch, useSelector } from "react-redux";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";

import {
    type SoilData,
    type IndexImage,
    type WeatherData,
    getFarmWeather,
    getFarmSoilData,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteImagesByDate,
    getFarmSatelliteIndexImageData,
} from "@/services/farms";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { americanFarmsGeoCenter } from "@/constants";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { getColorFromMatrix } from "@/helpers/farms";
import { getBitmapLayer, getPolygonLayer } from "@/helpers/maps";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import FarmSelect from "@/components/custom/Farm/Select";
import FarmInfoCard from "@/components/custom/Farm/Card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SoilCard from "@/components/custom/Farm/SoilCard";
import CurrentWeather from "@/components/custom/Farm/Weather/Current";
import WeatherForecast from "@/components/custom/Farm/Weather/Forecast";

const controlsPosition = {
    position: google.maps.ControlPosition.BOTTOM_RIGHT,
};

const Farms = () => {
    const map = useMap();
    const mapboxRef = useRef<MapRef | null>(null);
    const deckRef = useRef<DeckGLRef | null>(null);
    const overlayRef = useRef<GoogleMapsOverlay | null>(null);

    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

    const [soilData, setSoilData] = useState<SoilData>();
    const [weatherData, setWeatherData] = useState<WeatherData>();

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);

    const [image, setImage] = useState<IndexImage>();
    const [images, setImages] = useState<Array<IndexImage>>([]);

    const [selectedDate, setSelectedDate] = useState<Date>();
    const [highlightedDates, setHighlightedDates] = useState<Array<Date>>([]);

    const [mapType, setMapType] = useState<"2D" | "3D">("2D");

    const [layers, setLayers] = useState<Array<any>>([]);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const handleViewStateChange = useCallback(
        ({ viewState }) => setViewState(viewState),
        []
    );

    const onIndexSelect = useCallback(
        (value: string) => {
            const item = indices.find((a) => a === value);

            if (item) {
                const matchedImage = images.find(
                    (img) =>
                        `${img.index_code} (${img.satellite_code})` === item
                );

                setIndex(item);
                setImage(matchedImage);
            }
        },
        [images, indices]
    );

    // Calendar highlight dates

    const modifiers = useMemo(
        () => ({
            highlight: highlightedDates,
        }),
        [highlightedDates]
    );

    // Calendar on select date

    const onSelectDates = useCallback(
        (_: Array<Date> | undefined, day: Date) => {
            setSelectedDate(day);
        },
        []
    );

    // Calendar disable other dates that do not have satellite visits

    const disabledMatcher = useCallback(
        (date: Date) =>
            !highlightedDates.some(
                (d) =>
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
            ),
        [highlightedDates]
    );

    // renders twice as when farm changes image also changes
    useEffect(() => {
        if (!map || !farm || !image || mapType === "3D") {
            return;
        }

        const { bbox } = farm;
        if (!bbox || bbox.length !== 4) return;

        const bounds = new google.maps.LatLngBounds(
            { lat: bbox[1], lng: bbox[0] },
            { lat: bbox[3], lng: bbox[2] }
        );

        map.fitBounds(bounds);
        const imageLayer = getBitmapLayer({
            id: "1",
            opacity: 1,
            link: image.image_url,
            bounds: [bbox[0], bbox[1], bbox[2], bbox[3]],
        });

        const polygonLayer = getPolygonLayer({
            id: "2",
            coordinates: farm.coordinates,
        });

        if (!overlayRef.current) {
            overlayRef.current = new GoogleMapsOverlay({});
            overlayRef.current.setMap(map);
        }

        overlayRef.current.setProps({
            layers: [imageLayer, polygonLayer],
        });

        return () => {
            overlayRef.current?.setProps({});
        };
    }, [map, farm, image, mapType]);

    // pan the map to farm location
    // add bitmap layer to show image
    useAsyncEffect(
        async (signal) => {
            if (!image || mapType === "2D") {
                setLayers([]);

                return;
            }

            const data = await getFarmSatelliteIndexImageData({
                image,
                signal,
            });

            const layer = new ColumnLayer({
                id: "ndvi-columns",
                data: data.data.columns,
                diskResolution: 12,
                radius: image.satellite_code === "s2" ? 5 : 1.5,
                extruded: true,
                pickable: true,
                elevationScale: 25,
                getPosition: (d) => d.position,
                getFillColor: (d) =>
                    getColorFromMatrix(d.value, data.data.color_matrix),
                getElevation: (d) => d.value * 10,
            });

            setLayers([layer]);
        },
        [image, mapType],
        (error) => {
            setLayers([]);

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    // get satellite images when a date is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || !selectedDate) {
                setIndex("");
                setImages([]);
                setIndices([]);
                setImage(undefined);

                return;
            }

            dispatch(setLoading(true));

            const Images = await getFarmSatelliteImagesByDate({
                signal,
                id: farm.id,
                date: selectedDate,
            });

            const Indices = Images.map(
                (item) => item.index_code + " (" + item.satellite_code + ")"
            );

            let selectedIndex = index;

            if (selectedIndex === "" || !Indices.includes(selectedIndex)) {
                selectedIndex =
                    Indices.find((idx) => /^NDVI\b/.test(idx)) || Indices[0];
            }

            const matchedImage = Images.find(
                (img) =>
                    `${img.index_code} (${img.satellite_code})` ===
                    selectedIndex
            );

            setImages(Images);
            setIndices(Indices);
            setImage(matchedImage);
            setIndex(selectedIndex);

            dispatch(setLoading(false));
        },
        [selectedDate],
        (error) => {
            setIndex("");
            setImages([]);
            setIndices([]);
            setImage(undefined);

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    // get soil, weather, visit dates when a farm is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id) {
                setSoilData(undefined);
                setWeatherData(undefined);
                setHighlightedDates([]);
                setSelectedDate(undefined);

                return;
            }

            dispatch(setLoading(true));

            const { lat, lng } = farm.coordinates[0];

            const [WeatherData, SoilData, VisitData] = await Promise.all([
                getFarmWeather({
                    lat,
                    lng,
                    signal,
                }),
                getFarmSoilData({
                    lat,
                    lng,
                    signal,
                }),
                getSatelliteVisitDatesByFarm({
                    signal,
                    id: farm.id,
                }),
            ]);

            const Dates = VisitData.map((item) => new Date(item.date));

            const { bbox } = farm;
            const center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

            setSoilData(SoilData);
            setHighlightedDates(Dates);
            setWeatherData(WeatherData);
            setViewState((prev) => ({
                ...prev,
                zoom: 16,
                pitch: 60,
                bearing: 0,
                latitude: center[1],
                longitude: center[0],
                transitionDuration: 1000,
            }));
            if (Dates.length) {
                setSelectedDate(Dates[Dates.length - 1]);
            }

            dispatch(setLoading(false));
        },
        [farm?.id],
        (error) => {
            setSoilData(undefined);
            setWeatherData(undefined);
            setHighlightedDates([]);
            setSelectedDate(undefined);

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    return (
        <div className="min-h-screen h-screen w-full grid grid-cols-4 grid-rows-3">
            <div
                className={`col-span-3 row-span-2 ${
                    mapType === "2D" ? "block" : "hidden"
                }`}
            >
                <Map
                    defaultZoom={13}
                    zoomControl={false}
                    cameraControl={false}
                    mapTypeControl={false}
                    fullscreenControl={true}
                    streetViewControl={false}
                    gestureHandling="greedy"
                    defaultCenter={americanFarmsGeoCenter}
                    fullscreenControlOptions={controlsPosition}
                    mapTypeId={google.maps.MapTypeId.SATELLITE}
                />
            </div>

            <div
                className={`col-span-3 row-span-2 relative ${
                    mapType === "3D" ? "block" : "hidden"
                }`}
            >
                <DeckGL
                    ref={deckRef}
                    layers={layers}
                    controller={true}
                    viewState={viewState}
                    onViewStateChange={handleViewStateChange}
                >
                    <MapBox
                        ref={mapboxRef}
                        mapStyle="mapbox://styles/mapbox/light-v11"
                        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    />
                </DeckGL>
            </div>

            <ScrollArea className="col-span-1 row-span-3">
                <div className="flex flex-row justify-center mt-5">
                    <FarmSelect />

                    <div className="pl-2">
                        <Select value={index} onValueChange={onIndexSelect}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select Index" />
                            </SelectTrigger>

                            <SelectContent>
                                {indices.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-row justify-center mt-5">
                    <Button
                        onClick={() => setMapType("2D")}
                        variant={mapType === "2D" ? "default" : "outline"}
                    >
                        2D
                    </Button>

                    <Button
                        className="ml-2"
                        onClick={() => setMapType("3D")}
                        variant={mapType === "3D" ? "default" : "outline"}
                    >
                        3D
                    </Button>
                </div>

                <div className="flex justify-center border m-5">
                    <Calendar
                        mode="single"
                        numberOfMonths={1}
                        modifiers={modifiers}
                        selected={selectedDate}
                        onSelect={onSelectDates}
                        disabled={disabledMatcher}
                        //month={highlightedDates[0]}
                        defaultMonth={highlightedDates[0]}
                        modifiersClassNames={modifiersClassNames}
                    />
                </div>

                <div className="flex justify-center m-5">
                    {farm && <FarmInfoCard farm={farm} />}
                </div>

                <div className="flex justify-center m-5">
                    {soilData && <SoilCard data={soilData} />}
                </div>
            </ScrollArea>

            <div className="col-span-3 row-span-2 m-5 flex flex-row">
                {weatherData && <CurrentWeather weatherData={weatherData} />}

                {weatherData && <WeatherForecast weatherData={weatherData} />}
            </div>
        </div>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

const INITIAL_VIEW_STATE = {
    zoom: 16,
    pitch: 60,
    bearing: 0,
    latitude: americanFarmsGeoCenter.lat,
    longitude: americanFarmsGeoCenter.lng,
};

export default memo(Farms);
