import { memo } from "react";

import { Link } from "react-router";
import type { LucideProps } from "lucide-react";

import {
    Sidebar,
    SidebarMenu,
    SidebarGroup,    SidebarContent,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import SidebarTrigger from "../SideBar/Trigger";

type SideBarItem = {
    url: string;
    title: string;
    icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
};

type Props = {
    items: Array<SideBarItem>;
};

const AppSidebar = ({ items }: Props) => {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup className="bg-green-600 rounded-b-lg">
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link to={item.url}>
                                        <item.icon fill="white" color="white" />
                                        <span className="text-white">
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>                    
                </SidebarGroup>
                <SidebarTrigger />
            </SidebarContent>
        </Sidebar>
    );
};

export default memo(AppSidebar);
