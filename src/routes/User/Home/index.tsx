import { memo } from "react";

import { Outlet } from "react-router";

import { userSideBarItems } from "@/constants";

import AppSidebar from "@/components/custom/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

const UserHome = () => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar items={userSideBarItems} />

            <main className="flex flex-col min-h-screen w-full">
                <Outlet />
            </main>
        </SidebarProvider>
    );
};

export default memo(UserHome);
