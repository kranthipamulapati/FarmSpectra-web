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
    options,
    optionKey,
    optionValue,
}: {
    id?: string;
    name?: string;
    label?: string;
    optionKey: string;
    optionValue: string;
    options: Array<{
        [key: string]: number | string;
    }>;
}) => {
    return (
        <>
            <Label htmlFor={id}>{label}</Label>

            <Select name={name}>
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
