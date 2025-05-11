import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";

import { format } from "date-fns";
import { toast } from "react-toastify";
import { Calendar as CalendarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";

import { cn } from "@/lib/utils";

import {
    type IndexImage,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteIndicesByDateRange,
} from "@/services/farms";

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

import { getBitmapLayer, getPolygonLayer } from "@/helpers/maps";

const controlsPosition = {
    position: google.maps.ControlPosition.BOTTOM_RIGHT,
};

const Compare2D = () => {
    const leftMap = useMap("left-map");
    const rightMap = useMap("right-map");
    const leftOverlayRef = useRef<GoogleMapsOverlay | null>(null);
    const rightOverlayRef = useRef<GoogleMapsOverlay | null>(null);

    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);
    const [images, setImages] = useState<Array<IndexImage>>([]);
    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);
    const [mapType, setMapType] = useState(google.maps.MapTypeId.SATELLITE);
    const [highlightedDates, setHighlightedDates] = useState<Array<Date>>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const [sliderX, setSliderX] = useState(0.5); // Ratio (0 to 1), default center

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
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newX = (e.clientX - rect.left) / rect.width;
            setSliderX(Math.min(1, Math.max(0, newX))); // Clamp between 0 and 1
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    useEffect(() => {
        if (!farm || !index || !leftMap || !rightMap) {
            return;
        }

        leftOverlayRef.current?.setMap(null);
        rightOverlayRef.current?.setMap(null);

        const { bbox } = farm;

        const Images = images.filter(
            (item) =>
                item.index_code + " (" + item.satellite_code + ")" === index
        );

        if (Images.length >= 2) {
            const imageLayer1 = getBitmapLayer({
                id: "1",
                opacity: 1,
                link: Images[0].image_url,
                bounds: [bbox[0], bbox[1], bbox[2], bbox[3]],
            });

            const imageLayer2 = getBitmapLayer({
                id: "2",
                opacity: 1,
                link: Images[1].image_url,
                bounds: [bbox[0], bbox[1], bbox[2], bbox[3]],
            });

            const polygonLayer1 = getPolygonLayer({
                id: "3",
                coordinates: farm.coordinates,
            });

            const polygonLayer2 = getPolygonLayer({
                id: "4",
                coordinates: farm.coordinates,
            });

            leftOverlayRef.current = new GoogleMapsOverlay({
                layers: [imageLayer1, polygonLayer1],
            });

            rightOverlayRef.current = new GoogleMapsOverlay({
                layers: [imageLayer2, polygonLayer2],
            });

            leftOverlayRef.current.setMap(leftMap);
            rightOverlayRef.current.setMap(rightMap);
        }

        return () => {
            leftOverlayRef.current?.setMap(null);
            rightOverlayRef.current?.setMap(null);
        };
    }, [farm, index, images, leftMap, rightMap]);

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
            if (!leftMap || !rightMap || !farm?.id) {
                setSelectedDates([]);
                setHighlightedDates([]);
                return;
            }

            const { bbox } = farm;

            leftMap.panTo({
                lat: (bbox[1] + bbox[3]) / 2,
                lng: (bbox[0] + bbox[2]) / 2,
            });
            rightMap.panTo({
                lat: (bbox[1] + bbox[3]) / 2,
                lng: (bbox[0] + bbox[2]) / 2,
            });

            leftMap.setZoom(16);
            rightMap.setZoom(16);

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
        [leftMap, rightMap, farm?.id],
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

            <div
                ref={containerRef}
                className="row-span-8 relative w-full h-full select-none"
            >
                {/* Left Map: Visible only on the left half */}

                <div
                    className="absolute w-full h-full"
                    style={{ clipPath: `inset(0 ${100 - sliderX * 100}% 0 0)` }}
                >
                    <Map
                        id="left-map"
                        defaultZoom={13}
                        mapTypeId={mapType}
                        zoomControl={false}
                        cameraControl={false}
                        mapTypeControl={false}
                        fullscreenControl={false}
                        streetViewControl={false}
                        gestureHandling="greedy"
                        defaultCenter={americanFarmsGeoCenter}
                        fullscreenControlOptions={controlsPosition}
                    />
                </div>

                {/* Separator Line */}
                <div
                    style={{ left: `${sliderX * 100}%` }}
                    onMouseDown={() => setDragging(true)}
                    className="absolute inset-y-0 w-[3px] bg-violet-500 z-20 cursor-col-resize"
                />

                {/* Right Map: Visible only on the right half */}
                <div
                    className="absolute w-full h-full"
                    style={{ clipPath: `inset(0 0 0 ${sliderX * 100}%)` }}
                >
                    <Map
                        id="right-map"
                        defaultZoom={13}
                        mapTypeId={mapType}
                        zoomControl={false}
                        cameraControl={false}
                        mapTypeControl={false}
                        fullscreenControl={false}
                        streetViewControl={false}
                        gestureHandling="greedy"
                        defaultCenter={americanFarmsGeoCenter}
                        fullscreenControlOptions={controlsPosition}
                    />
                </div>
            </div>

            <div className="row-span-1 border-2"></div>
        </div>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

export default memo(Compare2D);
