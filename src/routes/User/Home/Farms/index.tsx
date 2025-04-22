import { memo, useState } from "react";

import { toast } from "react-toastify";
import { Map } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { americanFarmsGeoCenter } from "@/constants";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { Card } from "@/components/ui/card";

import { Calendar } from "@/components/ui/calendar";
import FarmSelect from "@/components/custom/Farm/Select";

import { getVisitDatesByMonth } from "@/services/farms";

const Farms = () => {
    const dispatch = useDispatch();
    const { farm, loading } = useSelector((state: RootState) => state.global);

    const [dates, setDates] = useState<Array<Date>>([]);
    const [month, setMonth] = useState<Date>(new Date());
    const [mapType] = useState(google.maps.MapTypeId.SATELLITE);

    useAsyncEffect(
        async (signal) => {
            if (!farm?.id || loading || !month) {
                return;
            }

            dispatch(setLoading(true));

            const dates = await getVisitDatesByMonth({
                id: farm.id,
                month,
                signal,
            });

            setDates(dates);

            dispatch(setLoading(false));
        },
        [farm?.id, month],
        (error) => {
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
                    </div>

                    <div className="flex justify-center border">
                        <Calendar
                            month={month}
                            mode="multiple"
                            selected={dates}
                            numberOfMonths={1}
                            onMonthChange={setMonth}
                        />
                    </div>
                </Card>
            </div>
        </Map>
    );
};

export default memo(Farms);
