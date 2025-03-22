import { type Unit, type Crop, type IrrigationMethod, pocketbase } from ".";

const getUnits = async (signal?: AbortSignal) => {
    const data = await pocketbase.collection("master_units").getFullList<Unit>({
        signal,
        filter: "dimension = '1' && active = true",
    });

    return data;
};

const getCrops = async (signal?: AbortSignal) => {
    const data = await pocketbase.collection("master_crops").getFullList<Crop>({
        signal,
        filter: "active = true",
    });

    return data;
};

const getIrrigationMethods = async (signal?: AbortSignal) => {
    const data = await pocketbase
        .collection("master_irrigation_methods")
        .getFullList<IrrigationMethod>({
            signal,
            filter: "active = true",
        });

    return data;
};

export { getUnits, getCrops, getIrrigationMethods };
