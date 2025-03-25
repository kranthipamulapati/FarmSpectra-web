import { memo } from "react";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SelectComponent = ({
    id,
    name,
    label,
    value,
    options,
    optionKey,
    optionValue,
    onValueChange,
}: {
    id?: string;
    name?: string;
    label?: string;
    value?: string;
    optionKey: string;
    optionValue: string;
    options: Array<{
        [key: string]: number | string;
    }>;
    onValueChange?: (value: string) => void;
}) => {
    return (
        <>
            <Label htmlFor={id}>{label}</Label>

            <Select name={name} value={value} onValueChange={onValueChange}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((item) => (
                        <SelectItem value={"" + item[optionValue]}>
                            {item[optionKey]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
};

export default memo(SelectComponent);
