import type { FarmForm, FarmCalenderForm } from "@/services/farms";

const parseFarmFormData = (farmFormData: any) => {
    const data: {
        farmForm: FarmForm;
        FarmCalenderForm: FarmCalenderForm;
    } = {
        farmForm: {
            area: 0,
            name: "",
            unit_fk: "",
            user_fk: "",
        },
        FarmCalenderForm: {
            farm_fk: "",
            crop_fk: "",
            sowing_date: new Date(),
            harvesting_date: new Date(),
            growth_stage_fk: "",
            irrigation_method_fk: "",
            tillage_type_fk: "",
            season_fk: "",
            yield: 0,
            target_yield: 0,
            estimated_yield: 0,
        },
    };

    farmFormData.forEach((value: string, key: string) => {
        const [section, field] = key.split(/\[|\]/).filter(Boolean);

        let newValue: string | number | Date = "";

        // farm section

        if (section === "farm") {
            if (key === "farm[area]") {
                newValue = Number(value);
                newValue = isNaN(newValue) ? 0 : newValue;
            } else {
                newValue = value.trim() as string;
            }
        }

        // farm calender section

        if (section === "calender") {
            if (
                key === "calender[yield]" ||
                key === "calender[target_yield]" ||
                key === "calender[estimated_yield]"
            ) {
                newValue = Number(value);
                newValue = isNaN(newValue) ? 0 : newValue;
            } else {
                newValue = value.trim() as string;
            }
        }

        data[section][field] = newValue;
    });

    return data;
};

export { parseFarmFormData };
