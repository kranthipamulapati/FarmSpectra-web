import { memo } from "react";

import { Outlet } from "react-router";

import { userSideBarItems } from "@/constants";

import AppSidebar from "@/components/custom/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const UserHome = () => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar items={userSideBarItems} />

            <main className="flex flex-col min-h-screen w-full">
                <header className="flex items-center h-12 px-4 border-b bg-gray-50">
                    <SidebarTrigger />
                </header>

                <div className="flex-1 flex items-center justify-center">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
};

export default memo(UserHome);
