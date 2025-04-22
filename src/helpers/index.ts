type Coordinate = {
    lat: number;
    lng: number;
};

import type { FarmForm, FarmCalenderForm } from "@/services/farms";

const parseFarmFormData = ({
    formData,
    coordinates,
}: {
    formData: any;
    coordinates: Array<Coordinate>;
}) => {
    const data: {
        farm: FarmForm;
        calender: FarmCalenderForm;
    } = {
        farm: {
            area: 0,
            name: "",
            coordinates: [],
        },
        calender: {
            crop_fk: "",
            sowing_date: new Date(),
            harvesting_date: new Date(),
            growth_stage_fk: "",
            irrigation_method_fk: "",
            tillage_type_fk: "",
            season_fk: "",
            target_yield: 0,
        },
    };

    formData.forEach((value: string, key: string) => {
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

        // calender section

        if (section === "calender") {
            if (key === "calender[target_yield]") {
                newValue = Number(value);
                newValue = isNaN(newValue) ? 0 : newValue;
            } else if (
                key === "calender[sowing_date]" ||
                key === "calender[harvesting_date]"
            ) {
                newValue = new Date(value) as Date;
            } else {
                newValue = value.trim() as string;
            }
        }

        data[section][field] = newValue;
    });

    data.farm.coordinates = coordinates;

    return data;
};

const checkFarmFormData = (data: {
    farm: FarmForm;
    calender: FarmCalenderForm;
}) => {
    const status = {
        farm: false,
        calendar: false,
    };

    // farm check

    const { name, area, coordinates } = data.farm;

    const isFarmFilled = !!(name && area && coordinates.length);

    if (isFarmFilled === false) {
        throw new Error("Please fill all required fields for farm.");
    }

    status.farm = isFarmFilled;

    // Calendar Check

    const { crop_fk, target_yield, growth_stage_fk, irrigation_method_fk } =
        data.calender;

    const isRegistrationFilled = !!(
        crop_fk &&
        growth_stage_fk &&
        irrigation_method_fk &&
        target_yield
    );

    if (isRegistrationFilled === false) {
        throw new Error("Please fill all fields in the calendar section.");
    }

    status.calendar = isRegistrationFilled;

    return status;
};

function getMonthBounds(date: Date) {
    const firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
    const lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 2, 0);

    return { firstDay, lastDay };
}

export type { Coordinate };
export { getMonthBounds, checkFarmFormData, parseFarmFormData };
