import { memo, useRef, useMemo, useState, useCallback } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { americanFarmsGeoCenter } from "@/constants";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import FarmSelect from "@/components/custom/Farm/Select";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import {
    getSatelliteVisitDatesByFarm,
    getSatelliteIndicesByDateRange,
} from "@/services/farms";

const CompareMap = () => {
    const map = useMap();

    const overlayRef = useRef<GoogleMapsOverlay | null>(null);

    const dispatch = useDispatch();
    const { farm } = useSelector((state: RootState) => state.global);

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);
    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);
    const [highlightedDates, setHighlightedDates] = useState<Array<Date>>([]);

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

    const onSelectDates = useCallback((dates: Array<Date> | undefined) => {
        if (!dates) {
            return;
        }

        const unique = Array.from(new Set(dates.map((d) => d.toDateString())))
            .map((d) => new Date(d))
            .slice(0, 2); // limit to two unique dates

        setSelectedDates(unique);
    }, []);

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
    useAsyncEffect(
        async (signal) => {
            if (!map || !farm || !index) {
                return;
            }

            dispatch(setLoading(true));

            overlayRef.current?.setMap(null);

            overlayRef.current = new GoogleMapsOverlay({
                layers: [],
            });

            overlayRef.current.setMap(map);

            dispatch(setLoading(false));

            return () => {
                overlayRef.current?.setMap(null);
            };
        },
        [map, farm, index]
    );

    // get satellite images when a date is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || selectedDates.length === 0) {
                return;
            }

            dispatch(setLoading(true));

            const indexRows = await getSatelliteIndicesByDateRange({
                signal,
                id: farm.id,
                end_date: selectedDates[1],
                start_date: selectedDates[0],
            });

            const Indices = Array.from(
                new Set(indexRows.map((item) => item.index_code))
            );

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
            if (!map || !farm?.id) {
                setSelectedDates([]);
                setHighlightedDates([]);
                return;
            }

            const { bbox } = farm;

            map.panTo({
                lat: (bbox[1] + bbox[3]) / 2, // (south + north) / 2
                lng: (bbox[0] + bbox[2]) / 2, // (west + east) / 2
            });
            map.setZoom(16);

            dispatch(setLoading(true));

            const data = await getSatelliteVisitDatesByFarm({
                signal,
                id: farm.id,
            });
            const Dates = data.map((item) => new Date(item.date));

            setHighlightedDates(Dates);
            if (Dates.length) {
                setSelectedDates([Dates[0], Dates[Dates.length - 1]]);
            }

            dispatch(setLoading(false));
        },
        [map, farm?.id],
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
        <div className="min-h-screen w-full grid grid-cols-2 grid-rows-10">
            <div className="col-span-2 row-span-1">
                <div className="flex flex-row justify-center mt-5">
                    <FarmSelect />

                    <div className="flex justify-center border ml-5 mr-5">
                        <Calendar
                            mode="multiple"
                            numberOfMonths={1}
                            modifiers={modifiers}
                            selected={selectedDates}
                            onSelect={onSelectDates}
                            disabled={disabledMatcher}
                            modifiersClassNames={modifiersClassNames}
                        />
                    </div>

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

            <div className="col-span-2 row-span-9">
                <Map
                    defaultZoom={13}
                    zoomControl={false}
                    cameraControl={false}
                    mapTypeControl={false}
                    fullscreenControl={true}
                    streetViewControl={true}
                    gestureHandling="greedy"
                    defaultCenter={americanFarmsGeoCenter}
                    fullscreenControlOptions={controlsPosition}
                    mapTypeId={google.maps.MapTypeId.SATELLITE}
                ></Map>
            </div>
        </div>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

const controlsPosition = {
    position: google.maps.ControlPosition.BOTTOM_RIGHT,
};

export default memo(CompareMap);
