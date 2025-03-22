import PocketBase from "pocketbase";

import { apiBaseURL } from "@/constants";

const pocketbase = new PocketBase(apiBaseURL);
pocketbase.autoCancellation(false);

type Unit = {
    id: string;
    code: string;
    name: string;
    created: Date;
    created_by: string;
    active: 0 | 1;
};

type Crop = {
    id: string;
    code: string;
    name: string;
    created: Date;
    created_by: string;
    active: 0 | 1;
};

type Season = {
    id: string;
    code: string;
    name: string;
    created: Date;
    created_by: string;
    active: 0 | 1;
};

type TillageType = {
    id: string;
    code: string;
    description: string;
    created: Date;
    created_by: string;
    active: 0 | 1;
};

type IrrigationType = {
    id: string;
    code: string;
    description: string;
    created: Date;
    created_by: string;
    active: 0 | 1;
};

type GrowthStage = {
    id: string;
    code: string;
    description: string;
    created: Date;
    created_by: string;
    active: 0 | 1;
};

type User = {
    id: string;
    name: string;
    email: string;
    verified: 0 | 1;
    created: Date;
    updated: Date;
};

export { pocketbase };
export type {
    User,
    Unit,
    Crop,
    Season,
    GrowthStage,
    TillageType,
    IrrigationType,
};
