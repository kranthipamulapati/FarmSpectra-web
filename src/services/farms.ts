import { toast } from "react-toastify";
import { ClientResponseError } from "pocketbase";

import store from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { checkFarmFormData, parseFarmFormData } from "@/helpers";

type Farm = {
    id: string;
    name: string;
    area: number;
    unit_fk: string;
    user_fk: string;
    created: Date;
    update: Date;
    active: boolean;
};

type FarmCalender = {
    id: string;
    farm_fk: string;
    crop_fk: string;
    sowing_date: Date;
    harvesting_date: Date;
    growth_stage_fk: string;
    irrigation_method_fk: string;
    tillage_type_fk: string;
    season_fk: string;
    yield: number;
    target_yield: number;
    estimated_yield: number;
    created: Date;
    update: Date;
    active: boolean;
};

type FarmForm = Pick<Farm, "name" | "area" | "unit_fk" | "user_fk">;

type FarmCalenderForm = Pick<
    FarmCalender,
    | "farm_fk"
    | "crop_fk"
    | "sowing_date"
    | "harvesting_date"
    | "growth_stage_fk"
    | "irrigation_method_fk"
    | "tillage_type_fk"
    | "season_fk"
    | "yield"
    | "target_yield"
    | "estimated_yield"
>;

const handleFarmFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
) => {
    e.preventDefault();

    const { loading } = store.getState().global;

    if (loading) {
        return;
    }

    store.dispatch(setLoading(true));

    try {
        const formData = new FormData(e.currentTarget);

        const data = parseFarmFormData({
            formData,
        });

        const status = checkFarmFormData(data);

        if (status.farm && status.calendar) {
            // add farm, calendar
        }

        toast("Farm details added successfully.", { type: "success" });
    } catch (error: unknown) {
        if (error instanceof ClientResponseError) {
            const { data, message } = error.response;

            const errorMessages = Object.entries(data || {})
                .map(
                    ([field, err]: [string, any]) => `${field}: ${err.message}`
                )
                .join("\n");

            toast(`${message}\n${errorMessages}`, { type: "error" });
        } else if (error instanceof Error) {
            toast(error.message, { type: "error" });
        } else {
            toast("An unknown error occurred", { type: "error" });
        }
    } finally {
        store.dispatch(setLoading(false));
    }
};

export { handleFarmFormSubmit };
export type { Farm, FarmCalender, FarmForm, FarmCalenderForm };
