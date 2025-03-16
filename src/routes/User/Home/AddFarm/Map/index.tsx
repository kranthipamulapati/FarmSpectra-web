import { memo, useRef, useState, useEffect } from "react";

import {
    Map,
    useMap,
    MapControl,
    useMapsLibrary,
    ControlPosition,
} from "@vis.gl/react-google-maps";
import { X, Search, Expand, Layers, SquareDashed } from "lucide-react";

import { americanFarmsGeoCenter } from "@/constants";

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
            polygonOptions: { editable: true, draggable: true },
            drawingControl: false,
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

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <Map
            defaultZoom={13}
            mapTypeId={mapType}
            gestureHandling="greedy"
            zoomControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
            streetViewControl={false}
            defaultCenter={americanFarmsGeoCenter}
        >
            {/* Custom Map Controls */}
            <MapControl position={ControlPosition.TOP_RIGHT}>
                <div className="bg-white p-2 rounded-md shadow-lg flex flex-col space-y-2 absolute right-4 top-4 z-[2]">
                    <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        onClick={startDrawing}
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        <SquareDashed className="w-5 h-5" />
                    </button>

                    <button
                        onClick={clearPolygon}
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <button
                        onClick={toggleMapType}
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        <Layers className="w-5 h-5" />
                    </button>

                    <button
                        onClick={toggleFullScreen}
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        <Expand className="w-5 h-5" />
                    </button>
                </div>
            </MapControl>
        </Map>
    );
};

export default memo(MapComponent);
