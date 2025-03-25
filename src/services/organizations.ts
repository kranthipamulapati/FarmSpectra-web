import { toast } from "react-toastify";
import { type RecordModel, ClientResponseError } from "pocketbase";

import { pocketbase } from ".";

import store from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

type Organization = {
    id: string;
    code: string;
    name: string;
    email: string;
    phone_number: string;
    address_1: string;
    address_2: string;
    city: string;
    state_fk: string;
    postal_code: string;
    unit_fk: string;
    created: Date;
    updated: Date;
    active: boolean;
};

const addOrganization = async ({
    name,
    address_1,
    address_2,
    city,
    code,
    email,
    phone_number,
    postal_code,
    state_fk,
    unit_fk,
}: Omit<
    Organization,
    "id" | "active" | "created" | "updated"
>): Promise<RecordModel> => {
    const data = await pocketbase.collection("organizations").create({
        code,
        name,
        email,
        phone_number,
        address_1,
        address_2,
        city,
        postal_code,
        state_fk,
        unit_fk,
        active: true,
    });

    return data;
};

const handleOrganizationFormSubmit = async ({
    e,
}: {
    e: React.FormEvent<HTMLFormElement>;
}) => {
    const { loading } = store.getState().global;

    if (loading) {
        return;
    }

    store.dispatch(setLoading(true));

    try {
        const formData = new FormData(e.currentTarget);

        const data: { [key: string]: FormDataEntryValue } = {};

        formData.forEach((value: FormDataEntryValue, key: string) => {
            data[key] = value;
        });

        await addOrganization(data);

        toast("Organization added successfully.", { type: "success" });
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

export type { Organization };
export { addOrganization, handleOrganizationFormSubmit };
