import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";

import { format } from "date-fns";
import { toast } from "react-toastify";
import { ColumnLayer } from "@deck.gl/layers";
import Map, { MapRef } from "react-map-gl/mapbox";
import DeckGL, { DeckGLRef } from "@deck.gl/react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { americanFarmsGeoCenter } from "@/constants";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import FarmSelect from "@/components/custom/Farm/Select";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import {
    type IndexImage,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteIndicesByDateRange,
} from "@/services/farms";

const INITIAL_VIEW_STATE = {
    longitude: americanFarmsGeoCenter.lng,
    latitude: americanFarmsGeoCenter.lat,
    bearing: 0,
    pitch: 60,
    zoom: 16,
};

type MockPixel = {
    longitude: number;
    latitude: number;
    value: number;
};

/**
 * Generates fake NDVI values at 10m resolution across a given farm bounding box.
 */
function generateMockFarmPixelData(
    bbox: [number, number, number, number]
): MockPixel[] {
    const [minLng, minLat, maxLng, maxLat] = bbox;

    // Roughly convert 10 meters to degrees
    const DEG_PER_M_LAT = 1 / 111320;
    const DEG_PER_M_LNG =
        1 / (111320 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));

    const latStep = 10 * DEG_PER_M_LAT;
    const lngStep = 10 * DEG_PER_M_LNG;

    const pixelData: MockPixel[] = [];

    for (let lat = minLat; lat < maxLat; lat += latStep) {
        for (let lng = minLng; lng < maxLng; lng += lngStep) {
            // Generate random NDVI-like value between -0.2 and 0.9
            const value = Math.random() * (0.9 + 0.2) - 0.2;

            pixelData.push({ latitude: lat, longitude: lng, value });
        }
    }

    return pixelData;
}

const colorRamp = [
    { min: null, max: -1.1, hex: "#AC0028" },
    { min: -1.1, max: -0.2, hex: "#B3002B" },
    { min: -0.2, max: -0.1, hex: "#C1002F" },
    { min: -0.1, max: 0, hex: "#D20034" },
    { min: 0, max: 0.025, hex: "#E30039" },
    { min: 0.025, max: 0.05, hex: "#F3003D" },
    { min: 0.05, max: 0.075, hex: "#E74C39" },
    { min: 0.075, max: 0.1, hex: "#EC5B3E" },
    { min: 0.1, max: 0.125, hex: "#F26C43" },
    { min: 0.125, max: 0.15, hex: "#F57B49" },
    { min: 0.15, max: 0.175, hex: "#F98A4E" },
    { min: 0.175, max: 0.2, hex: "#FB9F53" },
    { min: 0.2, max: 0.25, hex: "#FCAE58" },
    { min: 0.25, max: 0.3, hex: "#FDB65E" },
    { min: 0.3, max: 0.35, hex: "#FDC463" },
    { min: 0.35, max: 0.4, hex: "#D2E58C" },
    { min: 0.4, max: 0.45, hex: "#E1F18F" },
    { min: 0.45, max: 0.5, hex: "#B9E484" },
    { min: 0.5, max: 0.55, hex: "#92D875" },
    { min: 0.55, max: 0.6, hex: "#7ABF6E" },
    { min: 0.6, max: 0.65, hex: "#67A86A" },
    { min: 0.65, max: 0.7, hex: "#529E61" },
    { min: 0.7, max: 0.75, hex: "#3A9957" },
    { min: 0.75, max: 0.8, hex: "#268D4E" },
    { min: 0.8, max: 0.85, hex: "#178C44" },
    { min: 0.85, max: 0.9, hex: "#158C42" },
    { min: 0.9, max: 0.95, hex: "#0F8C40" },
    { min: 0.95, max: null, hex: "#0F8C40" },
];

function getColorForValue(value: number): [number, number, number] {
    const colorHex =
        colorRamp.find(({ min, max }) => {
            if (min == null) return value <= max!;
            if (max == null) return value > min;
            return value > min && value <= max;
        })?.hex ?? "#000000";

    const bigint = parseInt(colorHex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

const Compare3d = () => {
    const mapRef = useRef<MapRef | null>(null);
    const deckRef = useRef<DeckGLRef | null>(null);

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);
    const [images, setImages] = useState<Array<IndexImage>>([]);
    const [mockPixels, setMockPixels] = useState<MockPixel[]>([]);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const dispatch = useDispatch();
    const { farm } = useSelector((state: RootState) => state.global);

    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);
    const [highlightedDates, setHighlightedDates] = useState<Array<Date>>([]);

    const modifiers = useMemo(
        () => ({
            highlight: highlightedDates,
        }),
        [highlightedDates]
    );

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

    const onIndexSelect = useCallback(
        (value: string) => {
            const item = indices.find((a) => a === value);
            setIndex(item || "");
        },
        [indices]
    );

    useEffect(() => {
        if (farm?.bbox) {
            const data = generateMockFarmPixelData(farm.bbox);
            setMockPixels(data);
        }
    }, [farm?.id]);

    // get satellite images when a date is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || selectedDates.length === 0) {
                return;
            }

            dispatch(setLoading(true));

            const Images = await getFarmSatelliteIndicesByDateRange({
                signal,
                id: farm.id,
                end_date: selectedDates[1],
                start_date: selectedDates[0],
            });

            const Indices = Array.from(
                new Set(
                    Images.map(
                        (item) =>
                            item.index_code + " (" + item.satellite_code + ")"
                    )
                )
            );

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
            if (!farm?.id || !mapRef.current || !deckRef.current) {
                setSelectedDates([]);
                setHighlightedDates([]);
                return;
            }

            const { bbox } = farm;

            const center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

            mapRef.current.flyTo({
                center,
                zoom: 16,
                pitch: 60,
                bearing: 0,
                duration: 1000,
            });

            setViewState({
                zoom: 16,
                pitch: 60,
                bearing: 0,
                latitude: farm.coordinates[0].lat,
                longitude: farm.coordinates[0].lng,
            });

            dispatch(setLoading(true));

            const data = await getSatelliteVisitDatesByFarm({
                signal,
                id: farm.id,
            });
            const Dates = data.map((item) => new Date(item.date));

            setHighlightedDates(Dates);

            if (Dates.length >= 2) {
                setSelectedDates([
                    Dates[Dates.length - 2],
                    Dates[Dates.length - 1],
                ]);
            }

            dispatch(setLoading(false));
        },
        [farm?.id, mapRef.current],
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
        <div className="min-h-screen w-full grid grid-rows-10">
            <div className="row-span-1 flex items-center justify-center">
                <FarmSelect />

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[280px] justify-start text-left font-normal ml-2",
                                selectedDates.length === 0 &&
                                    "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />

                            {selectedDates.length === 2
                                ? `${format(
                                      selectedDates[0],
                                      "PPP"
                                  )} → ${format(selectedDates[1], "PPP")}`
                                : selectedDates.length === 1
                                ? `${format(
                                      selectedDates[0],
                                      "PPP"
                                  )} → Pick end date`
                                : "Pick two dates"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="multiple"
                            modifiers={modifiers}
                            selected={selectedDates}
                            disabled={disabledMatcher}
                            modifiersClassNames={modifiersClassNames}
                            onSelect={(dates) => {
                                const sorted = [...(dates || [])].sort(
                                    (a, b) => a.getTime() - b.getTime()
                                );
                                setSelectedDates(sorted.slice(0, 2));
                            }}
                        />
                    </PopoverContent>
                </Popover>

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

            <div className="row-span-8 relative">
                <DeckGL
                    ref={deckRef}
                    controller={true}
                    //viewState={viewState}
                    initialViewState={INITIAL_VIEW_STATE}
                    layers={[
                        new ColumnLayer({
                            id: "mock-ndvi-layer",
                            data: mockPixels,
                            radius: 5,
                            pickable: false,
                            elevationScale: 5,
                            diskResolution: 10,
                            getElevation: (d) => d.value * 10,
                            getPosition: (d) => [d.longitude, d.latitude],
                            getFillColor: (d) => getColorForValue(d.value ?? 0),
                        }),
                    ]}
                >
                    <Map
                        ref={mapRef}
                        mapStyle="mapbox://styles/mapbox/satellite-v9"
                        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    />
                </DeckGL>
            </div>
        </div>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

export default memo(Compare3d);
