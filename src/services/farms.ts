import { toast } from "react-toastify";
import { ClientResponseError, type RecordModel } from "pocketbase";

import { apiBaseURL } from "@/constants";

import { pocketbase, type Coordinate } from ".";

import store from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { getUTCDate } from "@/helpers";
import { parseFarmFormData, checkFarmFormData } from "@/helpers/farms";

type FarmVisitDate = {
    id: string;
    farm_fk: string;
    date: string;
};

type Farm = {
    id: string;
    name: string;
    area_in_sqm: number;
    unit_fk: string;
    user_fk: string;
    bbox: Array<number>;
    coordinates: Array<Coordinate>;
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
    yield_in_kgha: number;
    target_yield_in_kgha: number;
    estimated_yield_in_kgha: number;
    created: Date;
    update: Date;
    active: boolean;
};

type FarmForm = Pick<Farm, "name" | "area_in_sqm" | "coordinates">;

type FarmCalenderForm = Pick<
    FarmCalender,
    | "crop_fk"
    | "sowing_date"
    | "harvesting_date"
    | "growth_stage_fk"
    | "irrigation_method_fk"
    | "tillage_type_fk"
    | "season_fk"
    | "target_yield_in_kgha"
>;

type IndexImage = {
    id: string;
    index_code: string;
    satellite_code: string;
    farm_fk: string;
    visit_date: string;
    cloud_cover: number;
    image_url: string;
};

const addFarm = async ({
    name,
    area_in_sqm,
    coordinates,
}: FarmForm): Promise<RecordModel> => {
    const data = await pocketbase.collection("farms").create({
        name,
        area_in_sqm,
        coordinates,
        active: true,
        user_fk: pocketbase.authStore.record?.id,
    });

    return data;
};

const addFarmCalendar = async ({
    farm_fk,
    crop_fk,
    sowing_date,
    harvesting_date,
    season_fk,
    growth_stage_fk,
    tillage_type_fk,
    irrigation_method_fk,
    target_yield_in_kgha,
}: FarmCalenderForm & { farm_fk: string }): Promise<RecordModel> => {
    const data = await pocketbase.collection("farm_calendar").create({
        farm_fk,
        crop_fk,
        sowing_date,
        harvesting_date,
        season_fk,
        growth_stage_fk,
        tillage_type_fk,
        irrigation_method_fk,
        target_yield_in_kgha,
    });

    return data;
};

const handleFarmFormSubmit = async ({
    e,
    coordinates,
}: {
    coordinates: Array<Coordinate>;
    e: React.FormEvent<HTMLFormElement>;
}) => {
    e.preventDefault();

    const { loading } = store.getState().global;

    if (loading) {
        return;
    }

    store.dispatch(setLoading(true));

    try {
        const formData = new FormData(e.currentTarget);

        const data = parseFarmFormData({
            formData,
            coordinates,
        });

        const status = checkFarmFormData(data);

        if (status.farm && status.calendar) {
            const response = await addFarm(data.farm);

            if (response.id) {
                await addFarmCalendar({
                    ...data.calender,
                    farm_fk: response.id,
                });
            }
        }

        toast("Farm details added successfully.", { type: "success" });
    } catch (error: unknown) {
        if (error instanceof ClientResponseError) {
            const { data, message } = error.response;

            const errorMessages = Object.entries(data || {})
                .map(
                    ([field, err]: [string, any]) => `${field}: ${err.message}`
                )
                .join("\n");

            toast(`${message}\n${errorMessages}`, { type: "error" });
        } else if (error instanceof Error) {
            toast(error.message, { type: "error" });
        } else {
            toast("An unknown error occurred", { type: "error" });
        }
    } finally {
        store.dispatch(setLoading(false));
    }
};

const getSatelliteVisitDatesByFarm = async ({
    id,
    signal,
}: {
    id: string;
    signal: AbortSignal;
}) => {
    const dates = await pocketbase
        .collection("farm_satellite_visit_dates")
        .getFullList<FarmVisitDate>({
            signal,
            filter: `farm_fk = '${id}'`,
        });

    return dates;
};

const getFarmSatelliteImagesByDate = async ({
    id,
    date,
    signal,
}: {
    id: string;
    date: Date;
    signal: AbortSignal;
}) => {
    const utcDate = getUTCDate(date);

    const dates = await pocketbase
        .collection("farm_satellite_data_index_images_view")
        .getFullList<IndexImage>({
            signal,
            filter: `farm_fk = '${id}' && visit_date = '${utcDate}'`,
        });

    return dates;
};

const getFarmSatelliteIndicesByDateRange = async ({
    id,
    signal,
    end_date,
    start_date,
}: {
    id: string;
    end_date: Date;
    start_date: Date;
    signal: AbortSignal;
}) => {
    const endDate = getUTCDate(end_date);
    const startDate = getUTCDate(start_date);

    const dates = await pocketbase
        .collection("farm_satellite_data_index_images_view")
        .getFullList<IndexImage>({
            signal,
            fields: "index_code, satellite_code",
            filter: `farm_fk = '${id}' && visit_date >= '${startDate}' && visit_date <= '${endDate}'`,
        });

    return dates;
};

const getFarmSatelliteIndexDataByDate = async ({
    farm_fk,
    index_fk,
    visit_date,
    satellite_fk,
}: {
    visit_date: Date;
    farm_fk: string;
    index_fk: string;
    satellite_fk: string;
    signal: AbortSignal;
}) => {
    const response = await fetch(
        apiBaseURL + "api/farms/satellite/index/data",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + pocketbase.authStore.token,
            },
            body: JSON.stringify({
                farm_fk,
                index_fk,
                visit_date,
                satellite_fk,
            }),
        }
    );

    const result = await response.json();

    return result;
};

export type { Farm, FarmForm, IndexImage, FarmCalender, FarmCalenderForm };
export {
    handleFarmFormSubmit,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteImagesByDate,
    getFarmSatelliteIndexDataByDate,
    getFarmSatelliteIndicesByDateRange,
};
