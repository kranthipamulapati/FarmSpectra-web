import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type GlobalState = {
    loading: boolean;
};

const initialState: GlobalState = {
    loading: false,
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export type { GlobalState };
export default globalSlice.reducer;
export const { setLoading } = globalSlice.actions;
