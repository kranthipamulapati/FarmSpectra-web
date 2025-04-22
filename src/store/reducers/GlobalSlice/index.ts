import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/services";
import type { Farm } from "@/services/farms";

import { fetchUsers, fetchFarmsByUser } from "./thunks";

type GlobalState = {
    users: Array<User>;
    user: User | undefined;

    farms: Array<Farm>;
    farm: Farm | undefined;

    loading: boolean;
    error: string | undefined;
};

const initialState: GlobalState = {
    users: [],
    user: undefined,

    farms: [],
    farm: undefined,

    loading: false,
    error: undefined,
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setUsers: (state, action: PayloadAction<Array<User>>) => {
            state.users = action.payload;
        },

        selectUser: (state, action: PayloadAction<User | undefined>) => {
            state.user = action.payload;
        },

        setFarms: (state, action: PayloadAction<Array<Farm>>) => {
            state.farms = action.payload;
        },

        selectFarm: (state, action: PayloadAction<Farm | undefined>) => {
            state.farm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch users
            .addCase(fetchUsers.pending, (state) => {
                // set loading true & error undefined
                state.loading = true;
                state.error = undefined;

                // Reset users data
                state.users = [];
                state.user = undefined;

                // Reset farms data
                state.farms = [];
                state.farm = undefined;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "An unknown error occurred. Please try again or contact admin.";
            })

            // fetch farms by user
            .addCase(fetchFarmsByUser.pending, (state) => {
                state.loading = true;
                state.error = undefined;

                // Reset farms
                state.farms = [];
                state.farm = undefined;
            })
            .addCase(fetchFarmsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.farms = action.payload;
            })
            .addCase(fetchFarmsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "An unknown error occurred. Please try again or contact admin.";
            });
    },
});

export type { GlobalState };
export default globalSlice.reducer;
export const { setLoading, selectFarm, selectUser, setFarms, setUsers } =
    globalSlice.actions;
