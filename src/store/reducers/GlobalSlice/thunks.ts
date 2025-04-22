import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";

import type { Farm } from "@/services/farms";
import { type User, pocketbase } from "@/services";

import { setFarms, selectFarm, selectUser, type GlobalState } from ".";

const fetchUsers = createAsyncThunk(
    "global/fetchUsers",
    async (_, { signal, rejectWithValue }) => {
        try {
            const users = await pocketbase
                .collection("users")
                .getFullList<User>({ signal });

            return users;
        } catch (error) {
            let message =
                "Failed to fetch users. An unknown error occurred. Please try again.";
            if (error instanceof Error && error.name !== "AbortError") {
                message = error.message;
            }

            toast(message, { type: "error" });
            return rejectWithValue("Failed to fetch users");
        }
    }
);

/**
 * Thunk action to fetch farms for a selected user
 */
const fetchFarmsByUser = createAsyncThunk(
    "global/fetchFarmsByUser",
    async (userId: string, { signal, rejectWithValue }) => {
        try {
            const data = await pocketbase
                .collection("farms")
                .getFullList<Farm>({
                    signal,
                    filter: `user_fk = "${userId}"`,
                });

            return data;
        } catch (error) {
            let message =
                "Failed to fetch farms. An unknown error occurred. Please try again.";
            if (error instanceof Error && error.name !== "AbortError") {
                message = error.message;
            }

            toast(message, { type: "error" });
            return rejectWithValue(message);
        }
    }
);

/**
 * Thunk action that combines selecting a user and fetching their farms
 */
const selectUserAndFetchFarms = createAsyncThunk(
    "global/selectUserAndFetchFarms",
    async (user: User | undefined, { dispatch, getState }) => {
        const { global } = getState() as { global: GlobalState };

        if (global.user?.id === user?.id) {
            return;
        }

        dispatch(selectUser(user));

        if (user?.id) {
            return dispatch(fetchFarmsByUser(user.id));
        } else {
            dispatch(setFarms([]));
            dispatch(selectFarm(undefined));

            return;
        }
    }
);

const selectFarmAndFetchDetails = createAsyncThunk(
    "global/selectFarmAndFetchDetails",
    async (farm: Farm | undefined, { dispatch, getState }) => {
        const { global } = getState() as { global: GlobalState };

        if (global.farm?.id === farm?.id) {
            return;
        }

        dispatch(selectFarm(farm));

        // if (farm?.id) {
        // } else {
        // }
    }
);

export {
    fetchUsers,
    fetchFarmsByUser,
    selectUserAndFetchFarms,
    selectFarmAndFetchDetails,
};
