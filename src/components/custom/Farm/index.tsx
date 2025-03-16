import { memo, useState } from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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

import type {
    Unit,
    Crop,
    Season,
    GrowthStage,
    TillageType,
    IrrigationType,
} from "@/services";

const FarmForm = () => {
    const [irrigationTypes, setIrrigationTypes] = useState<
        Array<IrrigationType>
    >([]);
    const [units, setUnit] = useState<Array<Unit>>([]);
    const [crops, setCrop] = useState<Array<Crop>>([]);
    const [seasons, setSeasons] = useState<Array<Season>>([]);
    const [growthStages, setGrowthStages] = useState<Array<GrowthStage>>([]);
    const [tillageTypes, setTillageTypes] = useState<Array<TillageType>>([]);
    const [sowingDate, setSowingDate] = useState<Date | undefined>(undefined);
    const [harvestingDate, setHarvestingDate] = useState<Date | undefined>(
        undefined
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic would go here
    };

    return (
        <Card className="w-full max-w-[600px] rounded-none">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>New Farm</CardTitle>
                </CardHeader>

                <Separator className="my-4" />

                <div className="grid gap-6 p-6">
                    {/* Farm Details Section */}
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="farm-name">Name</Label>

                            <Input
                                id="farm-name"
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
                                    step="0.01"
                                    placeholder="Enter area"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select>
                                    <SelectTrigger id="unit_fk">
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
                                    <SelectTrigger id="crop_fk">
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
                                <Label htmlFor="target-yield">
                                    Target Yield
                                </Label>

                                <Input
                                    id="target-yield"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter target yield"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sowing-date">Sowing Date</Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="sowing-date"
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
                                <Label htmlFor="harvesting-date">
                                    Harvesting Date
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="harvesting-date"
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
                                    <SelectTrigger id="growth_stage_fk">
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
                                <Label htmlFor="irrigation_type_fk">
                                    Irrigation
                                </Label>

                                <Select>
                                    <SelectTrigger id="irrigation_type_fk">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {irrigationTypes.map((item) => (
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
                                    <SelectTrigger id="tillage_type_fk">
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
                                    <SelectTrigger id="season_fk">
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

                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>

                    <Button type="submit">Save</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default memo(FarmForm);
