import { memo, useRef, useState, useEffect } from "react";

import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

import { americanFarmsGeoCenter } from "@/constants";
import Controls from "./Controls";

const MapComponent = () => {
    const map = useMap();
    const drawing = useMapsLibrary("drawing");

    const [polygon, setPolygon] = useState<google.maps.Polygon>();
    const [mapType, setMapType] = useState(google.maps.MapTypeId.SATELLITE);
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
        null
    );

    useEffect(() => {
        if (!map || !drawing) return;

        const newDrawingManager = new drawing.DrawingManager({
            map,
            drawingControl: false,
            polygonOptions: { editable: true, draggable: true },
        });

        newDrawingManager.addListener(
            "polygoncomplete",
            (Polygon: google.maps.Polygon) => {
                setPolygon(Polygon);
                newDrawingManager.setDrawingMode(null);
            }
        );

        drawingManagerRef.current = newDrawingManager;

        return () => newDrawingManager.setMap(null);
    }, [map, drawing]);

    const startDrawing = () => {
        drawingManagerRef.current?.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
        );
    };

    const clearPolygon = () => {
        polygon?.setMap(null);
        setPolygon(undefined);
    };

    const toggleMapType = () => {
        setMapType((prev) =>
            prev === google.maps.MapTypeId.SATELLITE
                ? google.maps.MapTypeId.ROADMAP
                : google.maps.MapTypeId.SATELLITE
        );

        if (map) {
            map.setMapTypeId(
                mapType === google.maps.MapTypeId.SATELLITE
                    ? google.maps.MapTypeId.ROADMAP
                    : google.maps.MapTypeId.SATELLITE
            );
        }
    };

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
            <Controls
                clearPolygon={clearPolygon}
                startDrawing={startDrawing}
                toggleMapType={toggleMapType}
            />
        </Map>
    );
};

export default memo(MapComponent);
