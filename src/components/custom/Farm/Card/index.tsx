import { memo, useState } from "react";

import {
    Sun,
    Leaf,
    Goal,
    Ruler,
    Sprout,
    Droplet,
    Tractor,
    Calendar,
    BarChart3,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { setLoading } from "@/store/reducers/GlobalSlice";

import { pocketbase } from "@/services";
import type { Farm, FarmCalenderInfo } from "@/services/farms";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

const InfoRow = ({
    icon,
    label,
    value,
    color = "text-muted-foreground",
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: string;
}) => (
    <div className="flex items-center gap-2">
        <div className={`w-5 h-5 ${color}`}>{icon}</div>
        <span className="font-medium text-foreground">{label}:</span>
        <span className="ml-auto text-right">{value}</span>
    </div>
);

type Props = {
    farm: Farm;
};

function FarmInfoCard(props: Props) {
    const { farm } = props;

    const dispatch = useDispatch();

    const [calendar, setCalendar] = useState<FarmCalenderInfo>();

    // get visit dates when a farm is selected
    useAsyncEffect(
        async (signal) => {
            if (!farm?.id) {
                return;
            }

            dispatch(setLoading(true));

            const farmCalendars = await pocketbase
                .collection<FarmCalenderInfo>("farm_calendar_info")
                .getFullList({
                    signal,
                    filter: `farm_fk = '${farm.id}'`,
                });

            setCalendar(farmCalendars[0]);

            dispatch(setLoading(false));
        },
        [farm.id],
        (error) => {
            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    if (!calendar) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        No calendar found
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-l font-semibold text-center">
                    {farm.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 text-sm">
                <InfoRow
                    label="Area"
                    value={farm.area_in_sqm}
                    icon={<Ruler size={16} />}
                />

                <InfoRow
                    label="Sowing"
                    color="text-blue-600"
                    icon={<Calendar size={16} />}
                    value={new Date(calendar.sowing_date).toLocaleDateString(
                        undefined,
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }
                    )}
                />

                <InfoRow
                    label="Growth Stage"
                    color="text-emerald-600"
                    icon={<Sprout size={16} />}
                    value={calendar.growth_stage_description}
                />

                <InfoRow
                    label="Season"
                    color="text-orange-500"
                    icon={<Sun size={16} />}
                    value={calendar.season_name}
                />

                <InfoRow
                    color="text-lime-600"
                    label="Estimated Yield"
                    icon={<BarChart3 size={16} />}
                    value={calendar.estimated_yield_in_kgha}
                />

                <InfoRow
                    label="Crop"
                    color="text-green-600"
                    value={calendar.crop_name}
                    icon={<Leaf size={16} />}
                />

                <InfoRow
                    label="Harvesting"
                    color="text-yellow-600"
                    icon={<Calendar size={16} />}
                    value={new Date(
                        calendar.harvesting_date
                    ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                />

                <InfoRow
                    label="Irrigation"
                    color="text-cyan-600"
                    icon={<Droplet size={16} />}
                    value={calendar.irrigation_method_description}
                />

                <InfoRow
                    label="Tillage"
                    color="text-red-500"
                    icon={<Tractor size={16} />}
                    value={calendar.tillage_type_description}
                />

                <InfoRow
                    label="Target Yield"
                    color="text-indigo-600"
                    icon={<Goal size={16} />}
                    value={calendar.target_yield_in_kgha}
                />
            </CardContent>
        </Card>
    );
}

export default memo(FarmInfoCard);
