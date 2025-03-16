import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
    import.meta.env.VITE_API_BASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

export { supabase };
export type { Unit, Crop, Season, GrowthStage, TillageType, IrrigationType };
