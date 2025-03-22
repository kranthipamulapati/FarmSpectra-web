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

import type { RootState } from "@/store";
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
};

const FarmForm = ({ clearPolygon }: Props) => {
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

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        //const data = parsePlotFormData(formData);
        // Form submission logic would go here
    };

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
            <form onSubmit={handleSubmit}>
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
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                required={true}
                                placeholder="Enter farm name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="area">Area</Label>

                                <Input
                                    id="area"
                                    type="number"
                                    min="0"
                                    placeholder="Enter area"
                                    required
                                    disabled
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit_fk">Unit</Label>

                                <Select>
                                    <SelectTrigger
                                        id="unit_fk"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {units.map((item) => (
                                            <SelectItem value={item.code}>
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
                                <Label htmlFor="crop_fk">Crop</Label>

                                <Select>
                                    <SelectTrigger
                                        id="crop_fk"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {crops.map((item) => (
                                            <SelectItem value={item.code}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="target_yield">
                                    Target Yield
                                </Label>

                                <Input
                                    id="target_yield"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter target yield"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sowing_date">Sowing Date</Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="sowing_date"
                                            variant="outline"
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
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="harvesting_date">
                                    Harvesting Date
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="harvesting_date"
                                            variant="outline"
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
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="growth_stage_fk">
                                    Growth Stage
                                </Label>

                                <Select>
                                    <SelectTrigger
                                        className="w-full"
                                        id="growth_stage_fk"
                                    >
                                        <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {growthStages.map((item) => (
                                            <SelectItem value={item.code}>
                                                {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="irrigation_method_fk">
                                    Irrigation
                                </Label>

                                <Select>
                                    <SelectTrigger
                                        className="w-full"
                                        id="irrigation_method_fk"
                                    >
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {irrigationMethods.map((item) => (
                                            <SelectItem value={item.code}>
                                                {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tillage_type_fk">Tillage</Label>

                                <Select>
                                    <SelectTrigger
                                        className="w-full"
                                        id="tillage_type_fk"
                                    >
                                        <SelectValue placeholder="Select tillage" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {tillageTypes.map((item) => (
                                            <SelectItem value={item.code}>
                                                {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="season_fk">Season</Label>

                                <Select>
                                    <SelectTrigger
                                        id="season_fk"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select season" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {seasons.map((item) => (
                                            <SelectItem value={item.code}>
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
