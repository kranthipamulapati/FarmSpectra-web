import { memo, useRef, useMemo, useState, useCallback } from "react";

import { format } from "date-fns";
import { toast } from "react-toastify";
import Map, { MapRef } from "react-map-gl/mapbox";
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

const Compare3d = () => {
    const mapRef = useRef<MapRef | null>(null);

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);
    const [images, setImages] = useState<Array<IndexImage>>([]);

    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

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
            if (!farm?.id || !mapRef.current) {
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

            <div className="row-span-8 w-full h-full">
                <Map
                    ref={mapRef}
                    initialViewState={INITIAL_VIEW_STATE}
                    mapStyle="mapbox://styles/mapbox/satellite-v9"
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                />
            </div>
        </div>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

export default memo(Compare3d);
