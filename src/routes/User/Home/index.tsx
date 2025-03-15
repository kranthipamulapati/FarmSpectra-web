import { memo } from "react";

import { AppSidebar } from "@/components/custom/SiderBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const UserHome = () => {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main>
                <SidebarTrigger />
            </main>
        </SidebarProvider>
    );
};

export default memo(UserHome);
