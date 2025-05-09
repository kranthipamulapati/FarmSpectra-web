import { memo } from "react";

import { Link } from "react-router";
import { ChevronRight, ChevronLeft, type LucideProps } from "lucide-react";

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
        <Sidebar collapsible="icon" className="border-r-0">
            <SidebarContent>
                <SidebarGroup className="bg-green-500">
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem
                                key={item.title}
                                className="mt-1 mb-1"
                            >
                                <SidebarMenuButton asChild>
                                    <Link to={item.url}>
                                        <item.icon fill="white" color="white" />

                                        <span className="text-white ml-2 font-800 text-lg">
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="bg-white-500 flex-3 justify-center items-center">
                    {open ? (
                        <ChevronLeft
                            onClick={toggleSidebar}
                            className="text-green-500 w-5 h-5"
                        />
                    ) : (
                        <ChevronRight
                            onClick={toggleSidebar}
                            className="text-green-500 w-5 h-5"
                        />
                    )}
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
