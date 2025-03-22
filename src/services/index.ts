import PocketBase from "pocketbase";

import { apiBaseURL } from "@/constants";

const pocketbase = new PocketBase(apiBaseURL);
pocketbase.autoCancellation(false);

type Unit = {
    id: string;
    code: string;
    name: string;
    dimension: "1" | "2" | "3";
    factor_to_base: number;
    is_base: boolean;
    active: boolean;
    created: Date;
    updated: Date;
};

type Crop = {
    id: string;
    code: string;
    name: string;
    created: Date;
    updated: Date;
    active: boolean;
};

type Season = {
    id: string;
    code: string;
    name: string;
    created: Date;
    updated: Date;
    active: boolean;
};

type TillageType = {
    id: string;
    code: string;
    description: string;
    created: Date;
    updated: Date;
    active: boolean;
};

type IrrigationMethod = {
    id: string;
    code: string;
    description: string;
    created: Date;
    updated: Date;
    active: boolean;
};

type GrowthStage = {
    id: string;
    code: string;
    description: string;
    created: Date;
    updated: Date;
    active: boolean;
};

type User = {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    created: Date;
    updated: Date;
};

type State = {
    id: string;
    code: string;
    name: string;
    created: Date;
    updated: Date;
    active: boolean;
};

type Country = {
    id: string;
    code: string;
    name: string;
    created: Date;
    updated: Date;
    active: boolean;
};

export { pocketbase };
export type {
    User,
    Unit,
    Crop,
    State,
    Season,
    Country,
    TillageType,
    GrowthStage,
    IrrigationMethod,
};
