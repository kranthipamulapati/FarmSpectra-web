import { memo } from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const DateComponent = ({
    id,
    name,
    value,
    label,
    onSelect,
}: {
    id?: string;
    name?: string;
    value?: Date;
    label?: string;
    onSelect?: SelectSingleEventHandler;
}) => {
    return (
        <>
            <Label htmlFor={id}>{label}</Label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {value ? format(value, "PPP") : "Select date"}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onSelect}
                    />
                </PopoverContent>
            </Popover>

            <input
                name={name}
                type="hidden"
                value={value ? value.toISOString().split("T")[0] : ""}
            />
        </>
    );
};

export default memo(DateComponent);
