import { memo } from "react";

import { userSideBarItems } from "@/constants";

import AppSidebar from "@/components/custom/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const UserHome = () => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar items={userSideBarItems} />
            <main>
                <SidebarTrigger />
            </main>
        </SidebarProvider>
    );
};

export default memo(UserHome);
