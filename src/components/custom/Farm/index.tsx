import { memo, useState } from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogFooter,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
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

const FarmFormModal = () => {
    const [open, setOpen] = useState(false);
    const [sowingDate, setSowingDate] = useState<Date>();
    const [harvestingDate, setHarvestingDate] = useState<Date>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here

        setOpen(false);
    };

    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>New Farm</DialogTitle>
                    </DialogHeader>

                    <Separator className="my-4" />

                    <div className="grid gap-6 py-4">
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
                                        <SelectTrigger id="unit">
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="hectare">
                                                Hectare
                                            </SelectItem>

                                            <SelectItem value="acre">
                                                Acre
                                            </SelectItem>

                                            <SelectItem value="sqm">
                                                Square Meter
                                            </SelectItem>

                                            <SelectItem value="sqft">
                                                Square Feet
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Crop Details Section */}
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="crop">Crop</Label>

                                    <Select>
                                        <SelectTrigger id="crop">
                                            <SelectValue placeholder="Select crop" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="wheat">
                                                Wheat
                                            </SelectItem>

                                            <SelectItem value="rice">
                                                Rice
                                            </SelectItem>

                                            <SelectItem value="corn">
                                                Corn
                                            </SelectItem>

                                            <SelectItem value="soybean">
                                                Soybean
                                            </SelectItem>

                                            <SelectItem value="cotton">
                                                Cotton
                                            </SelectItem>

                                            <SelectItem value="sugarcane">
                                                Sugarcane
                                            </SelectItem>
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
                                    <Label htmlFor="sowing-date">
                                        Sowing Date
                                    </Label>

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
                                                    ? format(
                                                          harvestingDate,
                                                          "PPP"
                                                      )
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
                                    <Label htmlFor="growth-stage">
                                        Growth Stage
                                    </Label>

                                    <Select>
                                        <SelectTrigger id="growth-stage">
                                            <SelectValue placeholder="Select stage" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="germination">
                                                Germination
                                            </SelectItem>

                                            <SelectItem value="seedling">
                                                Seedling
                                            </SelectItem>

                                            <SelectItem value="vegetative">
                                                Vegetative
                                            </SelectItem>

                                            <SelectItem value="flowering">
                                                Flowering
                                            </SelectItem>

                                            <SelectItem value="fruiting">
                                                Fruiting
                                            </SelectItem>

                                            <SelectItem value="maturity">
                                                Maturity
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="irrigation">
                                        Irrigation
                                    </Label>

                                    <Select>
                                        <SelectTrigger id="irrigation">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="drip">
                                                Drip
                                            </SelectItem>

                                            <SelectItem value="sprinkler">
                                                Sprinkler
                                            </SelectItem>

                                            <SelectItem value="flood">
                                                Flood
                                            </SelectItem>

                                            <SelectItem value="center-pivot">
                                                Center Pivot
                                            </SelectItem>

                                            <SelectItem value="rainfed">
                                                Rainfed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tillage">Tillage</Label>

                                    <Select>
                                        <SelectTrigger id="tillage">
                                            <SelectValue placeholder="Select tillage" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="conventional">
                                                Conventional
                                            </SelectItem>

                                            <SelectItem value="reduced">
                                                Reduced
                                            </SelectItem>

                                            <SelectItem value="minimum">
                                                Minimum
                                            </SelectItem>

                                            <SelectItem value="no-till">
                                                No-Till
                                            </SelectItem>

                                            <SelectItem value="strip-till">
                                                Strip-Till
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="season">Season</Label>

                                    <Select>
                                        <SelectTrigger id="season">
                                            <SelectValue placeholder="Select season" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="spring">
                                                Spring
                                            </SelectItem>

                                            <SelectItem value="summer">
                                                Summer
                                            </SelectItem>

                                            <SelectItem value="fall">
                                                Fall
                                            </SelectItem>

                                            <SelectItem value="winter">
                                                Winter
                                            </SelectItem>

                                            <SelectItem value="kharif">
                                                Kharif
                                            </SelectItem>

                                            <SelectItem value="rabi">
                                                Rabi
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">Save Farm</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(FarmFormModal);
