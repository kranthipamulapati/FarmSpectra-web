import { memo } from "react";

import Map from "./Map";
import Header from "@/components/custom/base/Header";

const AddFarm = () => {
    return (
        <>
            <Header />

            <div className="flex-1 flex items-center justify-center">
                <Map />
            </div>
        </>
    );
};

export default memo(AddFarm);
