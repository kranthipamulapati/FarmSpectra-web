import type { Coordinate } from "@/services";
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
            name: "",
            area_in_sqm: 0,
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
            target_yield_in_kgha: 0,
        },
    };

    formData.forEach((value: string, key: string) => {
        const [section, field] = key.split(/\[|\]/).filter(Boolean);

        let newValue: string | number | Date = "";

        // farm section

        if (section === "farm") {
            if (key === "farm[area_in_sqm]") {
                newValue = Number(value);
                newValue = isNaN(newValue) ? 0 : newValue;
            } else {
                newValue = value.trim() as string;
            }
        }

        // calender section

        if (section === "calender") {
            if (key === "calender[target_yield_in_kgha]") {
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

    const { name, area_in_sqm, coordinates } = data.farm;

    const isFarmFilled = !!(name && area_in_sqm && coordinates.length);

    if (isFarmFilled === false) {
        throw new Error("Please fill all required fields for farm.");
    }

    status.farm = isFarmFilled;

    // Calendar Check

    const {
        crop_fk,
        growth_stage_fk,
        irrigation_method_fk,
        target_yield_in_kgha,
    } = data.calender;

    const isRegistrationFilled = !!(
        crop_fk &&
        growth_stage_fk &&
        irrigation_method_fk &&
        target_yield_in_kgha
    );

    if (isRegistrationFilled === false) {
        throw new Error("Please fill all fields in the calendar section.");
    }

    status.calendar = isRegistrationFilled;

    return status;
};

function getColorFromMatrix(
    value: number,
    matrix: { min: number | null; max: number | null; hex: string }[]
): [number, number, number] {
    const entry = matrix.find(({ min, max }) => {
        if (min === null) return value < max!;
        if (max === null) return value >= min;
        return value >= min && value < max;
    });

    if (!entry) return [128, 128, 128]; // fallback grey

    // Convert hex to RGB
    const hex = entry.hex.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return [r, g, b];
}

export { checkFarmFormData, parseFarmFormData, getColorFromMatrix };
