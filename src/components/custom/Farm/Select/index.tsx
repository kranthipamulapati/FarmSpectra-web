import { memo, useCallback } from "react";

import { useSelector } from "react-redux";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";

import store, { type RootState } from "@/store";
import { selectFarmAndFetchDetails } from "@/store/reducers/GlobalSlice/thunks";

const FarmSelect = () => {
    const { farm, farms, loading } = useSelector(
        (state: RootState) => state.global
    );

    const handleFarmSelect = useCallback((value: string) => {
        const { farms } = store.getState().global;
        const Farm = farms.find((item) => item.id === value);

        store.dispatch(selectFarmAndFetchDetails(Farm));
    }, []);

    return (
        <Select
            value={farm?.id}
            disabled={loading}
            onValueChange={handleFarmSelect}
        >
            <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Farm" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="undefined">Select Farm</SelectItem>

                {farms.map((Farm) => (
                    <SelectItem key={Farm.id} value={Farm.id}>
                        {Farm.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default memo(FarmSelect);
