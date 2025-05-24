import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";

import { format } from "date-fns";
import { toast } from "react-toastify";
import { ColumnLayer } from "@deck.gl/layers";
import Map, { MapRef } from "react-map-gl/mapbox";
import DeckGL, { DeckGLRef } from "@deck.gl/react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as CalendarIcon } from "lucide-react";
import { OrbitProgress } from "react-loading-indicators";

import { cn } from "@/lib/utils";

import {
    type IndexImage,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteIndexImageData,
    getFarmSatelliteIndicesByDateRange,
} from "@/services/farms";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { getColorFromMatrix } from "@/helpers/farms";

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

const TimeSeries = () => {
    const mapRef = useRef<MapRef | null>(null);
    const deckRef = useRef<DeckGLRef | null>(null);

    const [index, setIndex] = useState("");
    const [playing, setPlaying] = useState(false);
    const [timeIndex, setTimeIndex] = useState(0);
    const [indices, setIndices] = useState<Array<string>>([]);
    const [images, setImages] = useState<Array<IndexImage>>([]);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);
    const [highlightedDates, setHighlightedDates] = useState<Array<Date>>([]);
    const [scatterData, setScatterData] = useState<
        Array<{ value: number; position: [number, number] }>
    >([]);

    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

    const onIndexSelect = useCallback(
        (value: string) => {
            const item = indices.find((a) => a === value);

            if (item) {
                setIndex(item);
            }
        },
        [indices]
    );

    const handleViewStateChange = useCallback(
        ({ viewState }) => setViewState(viewState),
        []
    );

    const handleDateRangeSelect = useCallback(
        (range: { from?: Date; to?: Date } | undefined) => {
            if (!range?.from || !range?.to) return;

            const normalizeDate = (d: Date) =>
                new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

            const fromTime = normalizeDate(range.from);
            const toTime = normalizeDate(range.to);

            const inRange = highlightedDates
                .filter((d) => {
                    const t = normalizeDate(d);
                    return t >= fromTime && t <= toTime;
                })
                .sort((a, b) => normalizeDate(a) - normalizeDate(b));

            setSelectedDates(inRange);
        },
        [highlightedDates]
    );

    const modifiers = useMemo(
        () => ({
            highlight: highlightedDates,
        }),
        [highlightedDates]
    );

    const selected = useMemo(
        () => ({
            from: selectedDates[0],
            to: selectedDates[selectedDates.length - 1],
        }),
        [selectedDates]
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

    const columnLayer = useMemo(() => {
        if (!scatterData || scatterData.length === 0) return null;

        const current = scatterData[timeIndex];

        return new ColumnLayer({
            id: "ndvi-column",
            data: current.data.columns,
            diskResolution: 12,
            radius: index.includes("s2") ? 5 : 1.5,
            extruded: true,
            pickable: true,
            elevationScale: 25,
            getPosition: (d) => d.position,
            getFillColor: (d) =>
                getColorFromMatrix(d.value, current.data.color_matrix),
            getElevation: (d) => d.value * 10,
            transitions: {
                getElevation: 500,
                getFillColor: 500,
            },
        });
    }, [index, timeIndex, scatterData]);

    useEffect(() => {
        if (!playing) return;

        const interval = setInterval(() => {
            setTimeIndex((i) => {
                if (i + 1 >= scatterData.length) {
                    clearInterval(interval);

                    setPlaying(false);

                    return i; // or return 0 to loop
                }

                return i + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [playing, scatterData.length]);

    useAsyncEffect(
        async (signal) => {
            if (!index) {
                setScatterData([]);

                return;
            }

            dispatch(setLoading(true));

            const matchedImages = images.filter(
                (item) =>
                    item.index_code + " (" + item.satellite_code + ")" === index
            );

            const results = await Promise.all(
                matchedImages.map((image) =>
                    getFarmSatelliteIndexImageData({ image, signal })
                )
            );

            setScatterData(results);

            dispatch(setLoading(false));
        },
        [index],
        (error) => {
            setScatterData([]);

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    // get satellite indices when a date is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || selectedDates.length < 2) {
                setIndex("");
                setImages([]);
                setIndices([]);

                return;
            }

            dispatch(setLoading(true));

            const Images = await getFarmSatelliteIndicesByDateRange({
                signal,
                id: farm.id,
                end_date: selectedDates[selectedDates.length - 1],
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

            let selectedIndex = index;

            if (selectedIndex === "" || !Indices.includes(selectedIndex)) {
                selectedIndex =
                    Indices.find((idx) => /^NDVI\b/.test(idx)) || Indices[0];
            }

            setImages(Images);
            setIndices(Indices);
            setIndex(selectedIndex);

            dispatch(setLoading(false));
        },
        [selectedDates],
        (error) => {
            setIndex("");
            setImages([]);
            setIndices([]);

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

            const { bbox } = farm;
            const center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

            setViewState((prev) => ({
                ...prev,
                zoom: 15,
                pitch: 60,
                bearing: 0,
                latitude: center[1],
                longitude: center[0],
                transitionDuration: 1000,
            }));

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
            } else {
                setSelectedDates([]);
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
        <div className="min-h-screen w-full grid grid-rows-10">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <OrbitProgress
                        color="#32cd32"
                        size="medium"
                        text=""
                        textColor=""
                    />
                </div>
            )}

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

                            {selectedDates.length >= 2
                                ? `${format(
                                      selectedDates[0],
                                      "PPP"
                                  )} → ${format(
                                      selectedDates[selectedDates.length - 1],
                                      "PPP"
                                  )}`
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
                            mode="range"
                            selected={selected}
                            modifiers={modifiers}
                            disabled={disabledMatcher}
                            onSelect={handleDateRangeSelect}
                            defaultMonth={highlightedDates[0]}
                            modifiersClassNames={modifiersClassNames}
                        />
                    </PopoverContent>
                </Popover>

                <div className="pl-2">
                    <Select
                        value={index}
                        onValueChange={onIndexSelect}
                        disabled={indices.length === 0}
                    >
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

                {scatterData.length > 0 && (
                    <div className="px-4 py-2">
                        <input
                            min={0}
                            type="range"
                            className="w-full"
                            value={timeIndex}
                            max={scatterData.length - 1}
                            onChange={(e) =>
                                setTimeIndex(Number(e.target.value))
                            }
                        />

                        <div className="text-center text-sm text-muted-foreground">
                            {format(selectedDates[timeIndex], "PPP")}
                        </div>

                        <Button
                            className="ml-4"
                            onClick={() => setPlaying(!playing)}
                        >
                            {playing ? "Pause" : "Play"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="row-span-8 relative">
                <DeckGL
                    ref={deckRef}
                    controller={true}
                    viewState={viewState}
                    initialViewState={INITIAL_VIEW_STATE}
                    onViewStateChange={handleViewStateChange}
                    layers={[columnLayer].filter(Boolean)} // <== add the layer here
                >
                    <Map
                        ref={mapRef}
                        mapStyle="mapbox://styles/mapbox/light-v11"
                        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    />
                </DeckGL>
            </div>
        </div>
    );
};

const INITIAL_VIEW_STATE = {
    zoom: 16,
    pitch: 60,
    bearing: 0,
    latitude: americanFarmsGeoCenter.lat,
    longitude: americanFarmsGeoCenter.lng,
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

export default memo(TimeSeries);
