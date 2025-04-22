import { memo, useState } from "react";

import { Map } from "@vis.gl/react-google-maps";

import { americanFarmsGeoCenter } from "@/constants";

import { Card } from "@/components/ui/card";
import FarmSelect from "@/components/custom/Farm/Select";

const Farms = () => {
    const [mapType, setMapType] = useState(google.maps.MapTypeId.SATELLITE);

    return (
        <Map
            defaultZoom={13}
            mapTypeId={mapType}
            zoomControl={false}
            mapTypeControl={false}
            gestureHandling="greedy"
            fullscreenControl={false}
            streetViewControl={false}
            defaultCenter={americanFarmsGeoCenter}
        >
            <div className="absolute top-4 right-20">
                <Card className="w-full max-w-[400px] rounded-sm p-4">
                    <div className="flex flex-row">
                        <FarmSelect />
                    </div>
                </Card>
            </div>
        </Map>
    );
};

export default memo(Farms);
