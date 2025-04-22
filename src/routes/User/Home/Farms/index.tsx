import { memo, useState } from "react";

import { isSameDay } from "date-fns";
import { toast } from "react-toastify";
import { Map } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { americanFarmsGeoCenter } from "@/constants";

import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import Select from "@/components/custom/base/Select";
import FarmSelect from "@/components/custom/Farm/Select";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { type IndexImage, getIndexImagesData } from "@/services/farms";

const highlightedStyle = {
    highlighted: "bg-green-100 text-green-900",
};

const Farms = () => {
    const dispatch = useDispatch();

    const [mapType, setMapType] = useState(google.maps.MapTypeId.SATELLITE);

    const { farm, loading } = useSelector((state: RootState) => state.global);

    const [highlightedDates, setHighlightedDates] = useState<{
        highlighted: Array<Date>;
    }>({
        highlighted: [],
    });
    const [indexImage, setIndexImage] = useState<IndexImage>();
    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);
    const [indexImages, setIndexImages] = useState<Array<IndexImage>>([]);

    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || loading) {
                return;
            }

            dispatch(setLoading(true));

            const images = await getIndexImagesData({ id: farm.id, signal });
            const uniqueDateStrings = Array.from(
                new Set(images.map((item) => item.visit_date.split(" ")[0]))
            );

            setIndexImages(images);
            setHighlightedDates({
                highlighted: uniqueDateStrings.map(
                    (dateStr) => new Date(dateStr)
                ),
            });

            dispatch(setLoading(false));
        },
        [farm?.id],
        (error) => {
            setIndexImages([]);

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

                        <Select
                            optionKey="index_code"
                            optionValue="index_code"
                            options={indexImages}
                        />
                    </div>

                    <div className="flex justify-center border">
                        <Calendar
                            mode="multiple"
                            numberOfMonths={1}
                            selected={selectedDates}
                            modifiers={highlightedDates}
                            modifiersClassNames={highlightedStyle}
                            onSelect={(_, day) => setSelectedDates([day])}
                            disabled={(date) => {
                                return !highlightedDates.highlighted.some((d) =>
                                    isSameDay(d, date)
                                );
                            }}
                        />
                    </div>
                </Card>
            </div>
        </Map>
    );
};

export default memo(Farms);
