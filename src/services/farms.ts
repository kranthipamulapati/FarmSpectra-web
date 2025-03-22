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

export type { Farm, FarmCalender, FarmForm, FarmCalenderForm };
