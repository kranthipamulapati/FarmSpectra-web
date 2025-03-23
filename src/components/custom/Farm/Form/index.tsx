import { memo, useState } from "react";

import { format } from "date-fns";
import { toast } from "react-toastify";
import { X, CalendarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type {
    Unit,
    Crop,
    Season,
    GrowthStage,
    TillageType,
    IrrigationMethod,
} from "@/services";
import {
    getUnits,
    getCrops,
    getSeasons,
    getGrowthStages,
    getTillageTypes,
    getIrrigationMethods,
} from "@/services/masters";

import { cn } from "@/lib/utils";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { handleFarmFormSubmit } from "@/services/farms";

import { type RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";

type Props = {
    clearPolygon: () => void;
    polygon: google.maps.Polygon | undefined;
};

const FarmForm = ({ polygon, clearPolygon }: Props) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.global);

    const [irrigationMethods, setIrrigationMethods] = useState<
        Array<IrrigationMethod>
    >([]);
    const [units, setUnits] = useState<Array<Unit>>([]);
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
                Units,
                Crops,
                Seasons,
                TillageTypes,
                GrowthStages,
                IrrigationMethods,
            ] = await Promise.all([
                getUnits(signal),
                getCrops(signal),
                getSeasons(signal),
                getTillageTypes(signal),
                getGrowthStages(signal),
                getIrrigationMethods(signal),
            ]);

            setUnits(Units);
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
                                    disabled={true}
                                    placeholder="auto filled"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="farm[unit_fk]">Unit</Label>

                                <Select required={true} name="farm[unit_fk]">
                                    <SelectTrigger
                                        className="w-full"
                                        id="farm[unit_fk]"
                                    >
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {units.map((item) => (
                                            <SelectItem value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Crop Details Section */}
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="calender[crop_fk]">Crop</Label>

                                <Select name="calender[crop_fk]">
                                    <SelectTrigger
                                        className="w-full"
                                        id="calender[crop_fk]"
                                    >
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {crops.map((item) => (
                                            <SelectItem value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                <Label htmlFor="calender[sowing_date]">
                                    Sowing Date
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="calender[sowing_date]"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !sowingDate &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />

                                            {sowingDate
                                                ? format(sowingDate, "PPP")
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={sowingDate}
                                            onSelect={setSowingDate}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <input
                                    type="hidden"
                                    name="calender[sowing_date]"
                                    value={
                                        sowingDate
                                            ? sowingDate
                                                  .toISOString()
                                                  .split("T")[0]
                                            : ""
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="calender[harvesting_date]">
                                    Harvesting Date
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="calender[harvesting_date]"
                                            name="calender[harvesting_date]"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !harvestingDate &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />

                                            {harvestingDate
                                                ? format(harvestingDate, "PPP")
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={harvestingDate}
                                            onSelect={setHarvestingDate}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <input
                                    type="hidden"
                                    name="calender[harvesting_date]"
                                    value={
                                        harvestingDate
                                            ? harvestingDate
                                                  .toISOString()
                                                  .split("T")[0]
                                            : ""
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="calender[growth_stage_fk]">
                                    Growth Stage
                                </Label>

                                <Select name="calender[growth_stage_fk]">
                                    <SelectTrigger
                                        className="w-full"
                                        id="calender[growth_stage_fk]"
                                    >
                                        <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {growthStages.map((item) => (
                                            <SelectItem value={item.id}>
                                                {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="calender[irrigation_method_fk]">
                                    Irrigation
                                </Label>

                                <Select name="calender[irrigation_method_fk]">
                                    <SelectTrigger
                                        className="w-full"
                                        id="calender[irrigation_method_fk]"
                                    >
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {irrigationMethods.map((item) => (
                                            <SelectItem value={item.id}>
                                                {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="calender[tillage_type_fk]">
                                    Tillage
                                </Label>

                                <Select name="calender[tillage_type_fk]">
                                    <SelectTrigger
                                        className="w-full"
                                        id="calender[tillage_type_fk]"
                                    >
                                        <SelectValue placeholder="Select tillage" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {tillageTypes.map((item) => (
                                            <SelectItem value={item.id}>
                                                {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="calender[season_fk]">
                                    Season
                                </Label>

                                <Select name="calender[season_fk]">
                                    <SelectTrigger
                                        className="w-full"
                                        id="calender[season_fk]"
                                    >
                                        <SelectValue placeholder="Select season" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {seasons.map((item) => (
                                            <SelectItem value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
