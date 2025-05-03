import { memo, useEffect } from "react";

import { useDispatch } from "react-redux";
import { APIProvider as GoogleMapsAPIProvider } from "@vis.gl/react-google-maps";

import { Outlet } from "react-router";

import type { AppDispatch } from "@/store";

import { userSideBarItems } from "@/constants";

import AppSidebar from "@/components/custom/base/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { type User, pocketbase } from "@/services";
import { selectUserAndFetchFarms } from "@/store/reducers/GlobalSlice/thunks";

const UserHome = () => {
    const dispatch = useDispatch<AppDispatch>();

    const User = pocketbase.authStore.record as unknown as User;

    useEffect(() => {
        if (User?.id) {
            dispatch(selectUserAndFetchFarms(User));
        }
    }, [User]);

    return (
        <GoogleMapsAPIProvider
            region="IN"
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        >
            <SidebarProvider defaultOpen={false}>
                <AppSidebar items={userSideBarItems} />

                <main className="flex flex-col min-h-screen w-full">
                    <Outlet />
                </main>
            </SidebarProvider>
        </GoogleMapsAPIProvider>
    );
};

export default memo(UserHome);
