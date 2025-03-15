import { memo } from "react";

import { AppSidebar } from "@/components/custom/SiderBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const UserHome = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
};

export default memo(UserHome);
