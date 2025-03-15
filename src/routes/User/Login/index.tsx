import { memo, useCallback, useState } from "react";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";

import store from "@/store";

import { supabase } from "@/services";

import { setLoading } from "@/store/reducers/GlobalSlice";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

const UserLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setEmail(e.target.value);
        }, []);

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setPassword(e.target.value);
        }, []);

    const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const { loading } = store.getState().global;

        if (loading) {
            return;
        }

        try {
            store.dispatch(setLoading(true));

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data) {
                navigate("/home");
            }
        } catch (err: unknown) {
            toast(err.message, {
                type: "error",
            });
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
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            required={true}
                                            minLength={3}
                                            maxLength={320}
                                            onChange={handleEmailChange}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>

                                            <Link
                                                to="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>

                                        <Input
                                            id="password"
                                            type="password"
                                            required={true}
                                            minLength={8}
                                            maxLength={64}
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Login with Google
                                    </Button>
                                </div>

                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a
                                        href="#"
                                        className="underline underline-offset-4"
                                    >
                                        Sign up
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default memo(UserLogin);
