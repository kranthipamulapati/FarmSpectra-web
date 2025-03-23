import { memo, useState } from "react";

import { X } from "lucide-react";
import { toast } from "react-toastify";
import { getAreaOfPolygon } from "geolib";
import { useDispatch, useSelector } from "react-redux";

import type { Coordinate } from "@/helpers";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { type RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import type {
    Crop,
    Season,
    GrowthStage,
    TillageType,
    IrrigationMethod,
} from "@/services";
import {
    getCrops,
    getSeasons,
    getGrowthStages,
    getTillageTypes,
    getIrrigationMethods,
} from "@/services/masters";
import { handleFarmFormSubmit } from "@/services/farms";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Date from "@/components/custom/Base/Date";
import Select from "@/components/custom/Base/Select";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";

type Props = {
    clearPolygon: () => void;
    coordinates: Array<Coordinate>;
};

const FarmForm = ({ coordinates, clearPolygon }: Props) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.global);

    const [irrigationMethods, setIrrigationMethods] = useState<
        Array<IrrigationMethod>
    >([]);
    const [crops, setCrops] = useState<Array<Crop>>([]);
    const [seasons, setSeasons] = useState<Array<Season>>([]);
    const [growthStages, setGrowthStages] = useState<Array<GrowthStage>>([]);
    const [tillageTypes, setTillageTypes] = useState<Array<TillageType>>([]);
    const [sowingDate, setSowingDate] = useState<Date | undefined>(undefined);
    const [harvestingDate, setHarvestingDate] = useState<Date | undefined>(
        undefined
    );

    useAsyncEffect(
        async (signal) => {
            if (loading) {
                return;
            }

            dispatch(setLoading(true));

            const [
                Crops,
                Seasons,
                TillageTypes,
                GrowthStages,
                IrrigationMethods,
            ] = await Promise.all([
                getCrops(signal),
                getSeasons(signal),
                getTillageTypes(signal),
                getGrowthStages(signal),
                getIrrigationMethods(signal),
            ]);

            setCrops(Crops);
            setSeasons(Seasons);
            setGrowthStages(GrowthStages);
            setTillageTypes(TillageTypes);
            setIrrigationMethods(IrrigationMethods);

            dispatch(setLoading(false));
        },
        [],
        (error) => {
            dispatch(setLoading(false));

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    return (
        <Card className="w-full max-w-[600px] rounded-none py-4">
            <form onSubmit={handleFarmFormSubmit}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Farm</CardTitle>

                    <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={clearPolygon}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <Separator className="my-2" />

                <div className="grid gap-6 px-6 py-3">
                    {/* Farm Details Section */}
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="farm[name]">Name</Label>

                            <Input
                                minLength={1}
                                maxLength={50}
                                required={true}
                                id="farm[name]"
                                name="farm[name]"
                                placeholder="Enter farm name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="farm[area]">Area</Label>

                                <Input
                                    min="1"
                                    type="number"
                                    id="farm[area]"
                                    name="farm[area]"
                                    required={true}
                                    placeholder="Auto filled"
                                    value={Math.round(
                                        getAreaOfPolygon(coordinates) || 0
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Crop Details Section */}
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Select
                                    label="Crop"
                                    options={crops}
                                    optionKey="name"
                                    optionValue="id"
                                    id="calender[crop_fk]"
                                    name="calender[crop_fk]"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="calender[target_yield]">
                                    Target Yield
                                </Label>

                                <Input
                                    min="0"
                                    step="0.01"
                                    type="number"
                                    id="calender[target_yield]"
                                    name="calender[target_yield]"
                                    placeholder="Enter target yield"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Date
                                    label="Sowing Date"
                                    value={sowingDate}
                                    onSelect={setSowingDate}
                                    id="calender[sowing_date]"
                                    name="calender[sowing_date]"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Date
                                    label="Harvesting Date"
                                    value={harvestingDate}
                                    onSelect={setHarvestingDate}
                                    id="calender[harvesting_date]"
                                    name="calender[harvesting_date]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Select
                                    label="Growth Stage"
                                    options={growthStages}
                                    optionKey="description"
                                    optionValue="id"
                                    id="calender[growth_stage_fk]"
                                    name="calender[growth_stage_fk]"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Select
                                    label="Irrigation Method"
                                    options={irrigationMethods}
                                    optionKey="description"
                                    optionValue="id"
                                    id="calender[irrigation_method_fk]"
                                    name="calender[irrigation_method_fk]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Select
                                    label="Tillage Type"
                                    options={tillageTypes}
                                    optionKey="description"
                                    optionValue="id"
                                    id="calender[tillage_type_fk]"
                                    name="calender[tillage_type_fk]"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Select
                                    label="Season"
                                    options={seasons}
                                    optionKey="name"
                                    optionValue="id"
                                    id="calender[season_fk]"
                                    name="calender[season_fk]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <CardFooter className="flex justify-center py-4 gap-4">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>

                    <Button type="submit">Add</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default memo(FarmForm);
