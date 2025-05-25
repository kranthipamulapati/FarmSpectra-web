import { memo } from "react";

import { Link } from "react-router";
import { Cog, ChevronRight, ChevronLeft, type LucideProps } from "lucide-react";

import {
    Sidebar,
    useSidebar,
    SidebarMenu,
    SidebarGroup,
    SidebarFooter,
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
    const { open, toggleSidebar } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup className="bg-green-500">
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem
                                key={item.title}
                                className="mt-2 mb-2"
                            >
                                <SidebarMenuButton asChild>
                                    <Link to={item.url}>
                                        <item.icon
                                            color="white"
                                            strokeWidth={2.5}
                                        />

                                        <span className="text-white ml-2 font-800 text-lg">
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="bg-white flex-3 justify-center items-center">
                    {open ? (
                        <ChevronLeft
                            onClick={toggleSidebar}
                            className="text-green-500 w-7 h-7"
                        />
                    ) : (
                        <ChevronRight
                            onClick={toggleSidebar}
                            className="text-green-500 w-7 h-7"
                        />
                    )}
                </SidebarGroup>

                <SidebarFooter className="bg-green-500 p-4">
                    <Cog className="text-white w-5 h-5" />
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
};

export default memo(AppSidebar);
