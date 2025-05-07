import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { americanFarmsGeoCenter } from "@/constants";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import FarmSelect from "@/components/custom/Farm/Select";
import CurrentWeather from "@/components/custom/Farm/Weather/Current/New";

import {
    type IndexImage,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteImagesByDate,
} from "@/services/farms";

import { getBitmapLayer, getPolygonLayer } from "@/helpers/maps";

const controlsPosition = {
    position: google.maps.ControlPosition.BOTTOM_RIGHT,
};

const Farms = () => {
    const map = useMap();
    const overlayRef = useRef<GoogleMapsOverlay | null>(null);

    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);

    const [images, setImages] = useState<Array<IndexImage>>([]);

    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);
    const [highlightedDates, setHighlightedDates] = useState<Array<Date>>([]);

    const [mapType, setMapType] = useState(google.maps.MapTypeId.SATELLITE);

    const onIndexSelect = useCallback(
        (value: string) => {
            const item = indices.find((a) => a === value);
            setIndex(item || "");
        },
        [indices]
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
            setSelectedDates([day]);
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

    // pan the map to farm location
    // add bitmap layer to show image
    useEffect(() => {
        if (!map || !farm || !index) {
            return;
        }

        overlayRef.current?.setMap(null);

        const { bbox } = farm;

        map.panTo({
            lat: (bbox[1] + bbox[3]) / 2, // (south + north) / 2
            lng: (bbox[0] + bbox[2]) / 2, // (west + east) / 2
        });
        map.setZoom(16);

        const Image = images.find((item) => item.index_code === index);

        if (Image) {
            const imageLayer = getBitmapLayer({
                id: "1",
                opacity: 1,
                link: Image.image_url,
                bounds: [bbox[0], bbox[1], bbox[2], bbox[3]],
            });

            const polygonLayer = getPolygonLayer(farm.coordinates);

            overlayRef.current = new GoogleMapsOverlay({
                layers: [imageLayer, polygonLayer],
            });

            overlayRef.current.setMap(map);
        }

        return () => {
            overlayRef.current?.setMap(null);
        };
    }, [map, farm, index, images]);

    // get satellite images when a date is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || selectedDates.length === 0) {
                return;
            }

            dispatch(setLoading(true));

            const Images = await getFarmSatelliteImagesByDate({
                id: farm.id,
                date: selectedDates[0],
                signal,
            });

            const Indices = Images.map((item) => item.index_code);

            setImages(Images);
            setIndices(Indices);

            if (index === "" || Indices.indexOf(index) === -1) {
                setIndex(Indices[0] || "");
            }

            dispatch(setLoading(false));
        },
        [selectedDates],
        (error) => {
            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    // get visit dates when a farm is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id) {
                setSelectedDates([]);
                setHighlightedDates([]);
                return;
            }

            dispatch(setLoading(true));

            const data = await getSatelliteVisitDatesByFarm({
                signal,
                id: farm.id,
            });
            const Dates = data.map((item) => new Date(item.date));

            setHighlightedDates(Dates);
            if (Dates.length) {
                setSelectedDates([Dates[Dates.length - 1]]);
            }

            dispatch(setLoading(false));
        },
        [farm?.id],
        (error) => {
            setSelectedDates([]);
            setHighlightedDates([]);

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    return (
        <div className="min-h-screen w-full grid grid-cols-3 grid-rows-3">
            <div className="col-span-2 row-span-2">
                <Map
                    defaultZoom={13}
                    mapTypeId={mapType}
                    zoomControl={false}
                    cameraControl={false}
                    mapTypeControl={false}
                    fullscreenControl={true}
                    streetViewControl={true}
                    gestureHandling="greedy"
                    defaultCenter={americanFarmsGeoCenter}
                    fullscreenControlOptions={controlsPosition}
                ></Map>
            </div>

            <div className="col-span-1 row-span-3">
                <div className="flex flex-row justify-center mt-5">
                    <FarmSelect />

                    <div className="pl-2">
                        <Select value={index} onValueChange={onIndexSelect}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select Index" />
                            </SelectTrigger>

                            <SelectContent>
                                {indices.map((item) => (
                                    <SelectItem value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-center border m-5">
                    <Calendar
                        mode="multiple"
                        numberOfMonths={2}
                        modifiers={modifiers}
                        selected={selectedDates}
                        onSelect={onSelectDates}
                        disabled={disabledMatcher}
                        modifiersClassNames={modifiersClassNames}
                    />
                </div>
            </div>

            <div className="col-span-2 row-span-2 m-5 flex flex-row">
                <CurrentWeather />
            </div>
        </div>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

export default memo(Farms);
