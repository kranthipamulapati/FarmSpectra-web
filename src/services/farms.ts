import { toast } from "react-toastify";
import { fetchWeatherApi } from "openmeteo";
import { ClientResponseError, type RecordModel } from "pocketbase";

import { pocketbase, type Coordinate } from ".";

import store from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { apiBaseURL, openWeatherMapApiKey } from "@/constants";

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

type FarmCalenderInfo = {
    id: string;
    crop_name: string;
    sowing_date: Date;
    harvesting_date: Date;
    growth_stage_description: string;
    irrigation_method_description: string;
    tillage_type_description: string;
    season_name: string;
    target_yield_in_kgha: number;
    estimated_yield_in_kgha: number;
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

type WeatherDescription = {
    id: number;
    main: string;
    description: string;
    icon: string;
};

type Temperature = {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
};

type FeelsLike = {
    day: number;
    night: number;
    eve: number;
    morn: number;
};

type CurrentWeather = {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherDescription[];
};

type MinutelyForecast = {
    dt: number;
    precipitation: number;
};

type HourlyForecast = {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherDescription[];
    pop: number;
};

type DailyForecast = {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: Temperature;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherDescription[];
    clouds: number;
    pop: number;
    rain?: number;
    uvi: number;
};

type WeatherAlert = {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
};

type WeatherData = {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: CurrentWeather;
    minutely: MinutelyForecast[];
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    alerts?: WeatherAlert[];
};

type SoilData = {
    time: string;
    soilTemperature0cm: number;
    soilTemperature6cm: number;
    soilTemperature18cm: number;
    soilTemperature54cm: number;
    soilMoisture0To1cm: number;
    soilMoisture1To3cm: number;
    soilMoisture3To9cm: number;
    soilMoisture9To27cm: number;
    soilMoisture27To81cm: number;
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
            filter: `farm_fk = '${id}' && visit_date >= '${startDate}' && visit_date <= '${endDate}'`,
        });

    return dates;
};

const getFarmSatelliteIndexImageData = async ({
    image,
}: {
    image: IndexImage;
    signal: AbortSignal;
}) => {
    const response = await fetch(
        apiBaseURL + "api/farms/satellite/image/data",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + pocketbase.authStore.token,
            },
            body: JSON.stringify({
                ...image,
            }),
        }
    );

    const result = await response.json();

    return result;
};

const getFarmWeather = async ({
    lat,
    lng,
    signal,
}: {
    lat: number;
    lng: number;
    signal: AbortSignal;
}): Promise<WeatherData> => {
    const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude={minutely}&units=metric&appid=${openWeatherMapApiKey}`,
        { signal }
    );

    const data = await response.json();

    return data;
};

function getLatestSoilSnapshot(weatherData: any): SoilData {
    const hourly = weatherData.hourly;
    const lastIndex = hourly.time.length - 1;
    const idx = lastIndex.toString(); // Use string keys

    return {
        time: hourly.time[lastIndex],
        soilTemperature0cm: hourly.soilTemperature0cm[idx],
        soilTemperature6cm: hourly.soilTemperature6cm[idx],
        soilTemperature18cm: hourly.soilTemperature18cm[idx],
        soilTemperature54cm: hourly.soilTemperature54cm[idx],
        soilMoisture0To1cm: hourly.soilMoisture0To1cm[idx],
        soilMoisture1To3cm: hourly.soilMoisture1To3cm[idx],
        soilMoisture3To9cm: hourly.soilMoisture3To9cm[idx],
        soilMoisture9To27cm: hourly.soilMoisture9To27cm[idx],
        soilMoisture27To81cm: hourly.soilMoisture27To81cm[idx],
    };
}

const getFarmSoilData = async ({
    lat,
    lng,
    signal,
}: {
    lat: number;
    lng: number;
    signal: AbortSignal;
}): Promise<SoilData> => {
    const today = new Date().toISOString().split("T")[0]; // "2025-05-17"

    const params = {
        latitude: [lat],
        longitude: [lng],
        start_date: today,
        end_date: today,
        hourly: [
            "soil_temperature_0cm",
            "soil_temperature_6cm",
            "soil_temperature_18cm",
            "soil_temperature_54cm",
            "soil_moisture_0_to_1cm",
            "soil_moisture_1_to_3cm",
            "soil_moisture_3_to_9cm",
            "soil_moisture_9_to_27cm",
            "soil_moisture_27_to_81cm",
        ],
        timezone: "UTC",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(
        url,
        params,
        undefined,
        undefined,
        undefined,
        { signal }
    );

    const response = responses[0];
    const hourly = response.hourly()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const weatherData = {
        hourly: {
            time: [
                ...Array(
                    (Number(hourly.timeEnd()) - Number(hourly.time())) /
                        hourly.interval()
                ),
            ].map(
                (_, i) =>
                    new Date(
                        (Number(hourly.time()) +
                            i * hourly.interval() +
                            utcOffsetSeconds) *
                            1000
                    )
            ),
            soilTemperature0cm: hourly.variables(0)!.valuesArray()!,
            soilTemperature6cm: hourly.variables(1)!.valuesArray()!,
            soilTemperature18cm: hourly.variables(2)!.valuesArray()!,
            soilTemperature54cm: hourly.variables(3)!.valuesArray()!,
            soilMoisture0To1cm: hourly.variables(4)!.valuesArray()!,
            soilMoisture1To3cm: hourly.variables(5)!.valuesArray()!,
            soilMoisture3To9cm: hourly.variables(6)!.valuesArray()!,
            soilMoisture9To27cm: hourly.variables(7)!.valuesArray()!,
            soilMoisture27To81cm: hourly.variables(8)!.valuesArray()!,
        },
    };

    const latest = getLatestSoilSnapshot(weatherData);

    return latest;
};

export type {
    Farm,
    FarmForm,
    SoilData,
    IndexImage,
    WeatherData,
    FarmCalender,
    FarmCalenderForm,
    FarmCalenderInfo,
};
export {
    getFarmWeather,
    getFarmSoilData,
    handleFarmFormSubmit,
    getSatelliteVisitDatesByFarm,
    getFarmSatelliteImagesByDate,
    getFarmSatelliteIndexImageData,
    getFarmSatelliteIndicesByDateRange,
};
