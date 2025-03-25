import { memo } from "react";

import SidebarTrigger from "../SideBar/Trigger";

const Header = ({ children }: { children?: React.ReactNode }) => {
    return (
        <header className="flex items-center h-12 px-4 border-b bg-gray-50">
            <SidebarTrigger />

            {children}
        </header>
    );
};

export default memo(Header);
