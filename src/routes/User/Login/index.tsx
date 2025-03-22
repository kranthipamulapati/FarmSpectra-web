import { memo, useCallback, type MouseEvent } from "react";

import { Link } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { pocketbase } from "@/services";

import { Button } from "@/components/ui/button";

import store, { type RootState } from "@/store";
import { setLoading } from "@/store/reducers/GlobalSlice";

const UserLogin = () => {
    const navigate = useNavigate();
    const { loading } = useSelector((state: RootState) => state.global);

    const handleSocialSignIn = useCallback(
        async (e: MouseEvent<HTMLButtonElement>) => {
            const provider = (e.target as HTMLButtonElement).value;

            const { loading } = store.getState().global;

            if (loading) {
                return;
            }

            store.dispatch(setLoading(true));

            try {
                const auth = await pocketbase
                    .collection("users")
                    .authWithOAuth2({
                        provider,
                        createData: {
                            provider,
                            active: true,
                        },
                    });

                if (auth) {
                    navigate("/home/plots");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast(error.message, { type: "error" });
                } else {
                    toast("An unexpected error occurred", { type: "error" });
                }
            } finally {
                store.dispatch(setLoading(false));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [] // navigate not needed
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            {/* Main Content */}
            <div className="w-full max-w-[400px] space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        FarmSpectra
                    </h1>
                </div>

                <div className="space-y-3">
                    <Button
                        value="google"
                        variant="outline"
                        disabled={loading}
                        onClick={handleSocialSignIn}
                        className="w-full h-12 text-base font-normal"
                    >
                        <img
                            width={20}
                            height={20}
                            alt="Google"
                            className="mr-3"
                            src="/placeholder.svg"
                        />
                        {loading ? "Logging in..." : "Sign In With Google"}
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full p-4 flex justify-center items-center gap-4 text-sm text-gray-600">
                <Link to="#" className="hover:underline">
                    Privacy & Terms
                </Link>
                <Link to="#" className="hover:underline">
                    Contact Us
                </Link>
            </div>
        </div>
    );
};

export default memo(UserLogin);
