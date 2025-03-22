import { memo } from "react";

import { Link } from "react-router";
import type { LucideProps } from "lucide-react";

import {
    Sidebar,
    SidebarMenu,
    SidebarGroup,
    SidebarHeader,
    SidebarContent,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

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
            {/* <SidebarHeader className="flex items-center justify-center bg-green-600">
                FS
            </SidebarHeader> */}

            <SidebarContent>
                <SidebarGroup className="bg-green-600">
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
            </SidebarContent>
        </Sidebar>
    );
};

export default memo(AppSidebar);
