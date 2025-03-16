import { memo, useState, useEffect } from "react";

import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

import { americanFarmsGeoCenter } from "@/constants";

const MapComponent = () => {
    const map = useMap();
    const drawing = useMapsLibrary("drawing");
    const geocoding = useMapsLibrary("geocoding");

    const [polygon, setPolygon] = useState<google.maps.Polygon>();

    useEffect(() => {
        if (!map || !drawing || !geocoding) {
            return;
        }

        const newDrawingManager = new drawing.DrawingManager({
            map,
            polygonOptions: {
                editable: true,
                draggable: true,
            },
            drawingControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER,
                drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            },
        });

        newDrawingManager.addListener(
            "polygoncomplete",
            (Polygon: google.maps.Polygon) => {
                setPolygon(Polygon);
            }
        );

        newDrawingManager.setDrawingMode(null);
        newDrawingManager.setOptions({
            drawingControl: true,
        });

        return () => {
            newDrawingManager.setMap(null);
        };
    }, [map, drawing, geocoding]);

    return (
        <Map
            defaultZoom={13}
            clickableIcons={false}
            gestureHandling="greedy"
            defaultCenter={americanFarmsGeoCenter}
            mapTypeId={google.maps.MapTypeId.SATELLITE}
        ></Map>
    );
};

export default memo(MapComponent);
