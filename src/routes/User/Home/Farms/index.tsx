import { memo, useState } from "react";

import { Map } from "@vis.gl/react-google-maps";

import { americanFarmsGeoCenter } from "@/constants";

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
        ></Map>
    );
};

export default memo(Farms);
