import { memo, useState, useCallback } from "react";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

import { pocketbase } from "@/services";

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import store, { type RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

const OrganizationalLogin = () => {
    const navigate = useNavigate();
    const { orgCode } = useParams();
    const { loading } = useSelector((state: RootState) => state.global);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
        },
        []
    );

    const handlePasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
        },
        []
    );

    const handleOrganizationalUserLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const { loading } = store.getState().global;

        if (loading) {
            return;
        }

        store.dispatch(setLoading(true));

        try {
            const auth = await pocketbase
                .collection("users_org")
                .authWithPassword(username + "@" + orgCode, password);

            if (auth) {
                navigate(`/${orgCode}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast(error.message, { type: "error" });
            } else {
                toast("An unknown error occurred", { type: "error" });
            }
        } finally {
            store.dispatch(setLoading(false));
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>

                            <CardDescription>
                                Enter your username below to login to your
                                account
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleOrganizationalUserLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>

                                        <Input
                                            id="username"
                                            required={true}
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                        </div>

                                        <Input
                                            id="password"
                                            type="password"
                                            required={true}
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default memo(OrganizationalLogin);
