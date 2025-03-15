import { memo } from "react";

import { Link } from "react-router";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

const UserLogin = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            required={true}
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
