import { memo, useState, useCallback } from "react";

import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import type { RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Select from "@/components/custom/base/Select";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";

import type { Unit, State, Country } from "@/services";
import { getUnits, getCountries, getStatesByCountry } from "@/services/masters";

let units: Array<Pick<Unit, "id" | "name">> = [];
let states: Array<Pick<State, "id" | "name">> = [];
let countries: Array<Pick<Country, "id" | "name">> = [];

const OrganizationForm = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.global);

    const [countryFk, setCountryFk] = useState<string>("");

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);

            const data: { [key: string]: FormDataEntryValue } = {};

            formData.forEach((value: FormDataEntryValue, key: string) => {
                data[key] = value;
            });
        },
        []
    );

    useAsyncEffect(
        async (signal) => {
            if (loading || !countryFk) {
                return;
            }

            dispatch(setLoading(true));

            states = await getStatesByCountry({
                signal,
                country_fk: countryFk,
            });

            dispatch(setLoading(false));
        },
        [countryFk],
        (error) => {
            dispatch(setLoading(false));

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    useAsyncEffect(
        async (signal) => {
            if (loading) {
                return;
            }

            dispatch(setLoading(true));

            [units, countries] = await Promise.all([
                getUnits(signal),
                getCountries(signal),
            ]);

            dispatch(setLoading(false));
        },
        [],
        (error) => {
            dispatch(setLoading(false));

            if (error instanceof Error && error.name !== "AbortError") {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred.", { type: "error" });
            }
        }
    );

    return (
        <Card className="w-full max-w-[600px] rounded-none py-4">
            <form onSubmit={handleSubmit}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Organization</CardTitle>

                    <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <Separator className="my-2" />

                <div className="grid gap-6 px-6 py-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>

                            <Input
                                minLength={3}
                                maxLength={4}
                                required={true}
                                id="code"
                                name="code"
                                placeholder="Enter code"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                minLength={3}
                                maxLength={50}
                                id="name"
                                name="name"
                                required={true}
                                placeholder="Enter name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                minLength={6}
                                maxLength={320}
                                required={true}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone number</Label>

                            <Input
                                minLength={8}
                                maxLength={20}
                                id="phone_number"
                                name="phone_number"
                                required={true}
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address_1">Address 1</Label>

                            <Input
                                minLength={10}
                                maxLength={100}
                                required={true}
                                id="address_1"
                                name="address_1"
                                placeholder="Enter address line 1"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address_2">Address 2</Label>

                            <Input
                                maxLength={100}
                                id="address_2"
                                name="address_2"
                                placeholder="Enter address line 2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>

                            <Input
                                id="city"
                                name="city"
                                maxLength={50}
                                required={true}
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">Postal Code</Label>

                            <Input
                                maxLength={100}
                                id="postal_code"
                                name="postal_code"
                                placeholder="Enter postal code"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Select
                                value={countryFk}
                                label="Country"
                                options={countries}
                                optionKey="name"
                                optionValue="id"
                                id="country_fk"
                                name="country_fk"
                                onValueChange={setCountryFk}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Select
                                label="State"
                                options={states}
                                optionKey="name"
                                optionValue="id"
                                id="country_fk"
                                name="country_fk"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Select
                                label="Unit"
                                options={units}
                                optionKey="name"
                                optionValue="id"
                                id="unit_fk"
                                name="unit_fk"
                            />
                        </div>

                        <div className="grid gap-2"></div>
                    </div>
                </div>

                <CardFooter className="flex justify-center py-4 gap-4">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>

                    <Button type="submit">Add</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default memo(OrganizationForm);
