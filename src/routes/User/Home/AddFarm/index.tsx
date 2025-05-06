import { memo } from "react";

import Map from "./Map";

const AddFarm = () => {
    return (
        <>
            <div className="flex-1 flex items-center justify-center">
                <Map />
            </div>
        </>
    );
};

export default memo(AddFarm);
