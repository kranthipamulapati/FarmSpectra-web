import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
    import.meta.env.VITE_API_BASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export { supabase };
