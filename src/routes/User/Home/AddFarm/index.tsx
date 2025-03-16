import { memo } from "react";

import Map from "./Map";

import SidebarTrigger from "@/components/custom/SideBar/Trigger";

const AddFarm = () => {
    return (
        <>
            <header className="flex items-center h-12 px-4 border-b bg-gray-50">
                <SidebarTrigger />
            </header>

            <div className="flex-1 flex items-center justify-center">
                <Map />
            </div>
        </>
    );
};

export default memo(AddFarm);
