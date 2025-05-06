import { memo } from "react";

import { Link } from "react-router";
import { ChevronRight, type LucideProps } from "lucide-react";

import {
    Sidebar,
    SidebarMenu,
    SidebarGroup,
    SidebarFooter,
    SidebarTrigger,
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
        <Sidebar collapsible="icon" className="border-r-0">
            <SidebarContent className="flex">
                <SidebarGroup className="bg-green-500">
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link to={item.url}>
                                        <item.icon fill="white" color="white" />

                                        <span className="text-white ml-2">
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="bg-white-500 flex-3 justify-center">
                    <SidebarTrigger className="bg-white text-green-500 w-4 h-4">
                        <ChevronRight size={12} />
                    </SidebarTrigger>
                </SidebarGroup>

                <SidebarFooter className="bg-green-500 p-4">
                    <div className="flex justify-center">
                        <button className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-green-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-help-circle"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </button>
                    </div>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
};

export default memo(AppSidebar);
