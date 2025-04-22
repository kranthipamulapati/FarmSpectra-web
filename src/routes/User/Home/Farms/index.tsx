import { memo, useMemo, useState, useCallback } from "react";

import { toast } from "react-toastify";
import { Map } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";

import type { Index } from "@/services";

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
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import FarmSelect from "@/components/custom/Farm/Select";

import {
    type IndexImage,
    getSatelliteImages,
    getVisitDatesByFarm,
} from "@/services/farms";

const Farms = () => {
    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

    const [index, setIndex] = useState("");
    const [indices, setIndices] = useState<Array<string>>([]);

    const [image, setImage] = useState<IndexImage>();
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

    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || selectedDates.length === 0) {
                return;
            }

            dispatch(setLoading(true));

            const Images = await getSatelliteImages({
                id: farm.id,
                date: selectedDates[0],
                signal,
            });

            const Indices = Images.map((item) => item.index_code);

            setImages(Images);
            setIndices(Indices);

            setImage(Images[0]);
            setIndex(Indices[0] || "");

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

    useAsyncEffect(
        async (signal) => {
            if (!farm?.id) {
                setSelectedDates([]);
                setHighlightedDates([]);
                return;
            }

            dispatch(setLoading(true));

            const data = await getVisitDatesByFarm({ id: farm.id, signal });
            const Dates = data.map((item) => new Date(item.date));

            setHighlightedDates(Dates);
            setSelectedDates([Dates[Dates.length - 1]]);

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
        <Map
            defaultZoom={13}
            mapTypeId={mapType}
            zoomControl={false}
            mapTypeControl={false}
            gestureHandling="greedy"
            fullscreenControl={false}
            streetViewControl={false}
            defaultCenter={americanFarmsGeoCenter}
        >
            <div className="absolute top-4 right-20">
                <Card className="w-full max-w-[400px] rounded-sm p-4">
                    <div className="flex flex-row">
                        <FarmSelect />

                        <Select value={index} onValueChange={onIndexSelect}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Index" />
                            </SelectTrigger>

                            <SelectContent>
                                {indices.map((item) => (
                                    <SelectItem value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-center border">
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
                </Card>
            </div>
        </Map>
    );
};

const modifiersClassNames = {
    highlight:
        "bg-green-100 text-green-800 font-medium border border-green-300 rounded-full",
};

export default memo(Farms);
