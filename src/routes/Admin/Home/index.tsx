import { memo } from "react";

import { Outlet } from "react-router";

import { adminSideBarItems } from "@/constants";

import AppSidebar from "@/components/custom/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminHome = () => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar items={adminSideBarItems} />

            <main className="flex flex-col min-h-screen w-full">
                <Outlet />
            </main>
        </SidebarProvider>
    );
};

export default memo(AdminHome);
