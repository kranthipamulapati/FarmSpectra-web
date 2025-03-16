import { memo, useRef, useState, useEffect } from "react";

import {
    Map,
    useMap,
    MapControl,
    useMapsLibrary,
    ControlPosition,
} from "@vis.gl/react-google-maps";

import { Eraser, PencilRuler } from "lucide-react";

import { americanFarmsGeoCenter } from "@/constants";

const mapIconOptions = {
    position: ControlPosition.TOP_CENTER,
};

const MapComponent = () => {
    const map = useMap();
    const drawing = useMapsLibrary("drawing");

    const [polygon, setPolygon] = useState<google.maps.Polygon>();
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
        null
    );

    useEffect(() => {
        if (!map || !drawing) {
            return;
        }

        const newDrawingManager = new drawing.DrawingManager({
            map,
            polygonOptions: {
                editable: true,
                draggable: true,
            },
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

        return () => {
            newDrawingManager.setMap(null);
        };
    }, [map, drawing]);

    const startDrawing = () => {
        if (drawingManagerRef.current) {
            drawingManagerRef.current.setDrawingMode(
                google.maps.drawing.OverlayType.POLYGON
            );
        }
    };

    // Custom function to remove the drawn polygon
    const clearPolygon = () => {
        if (polygon) {
            polygon.setMap(null);
            setPolygon(undefined);
        }
    };

    return (
        <Map
            defaultZoom={13}
            gestureHandling="greedy"
            defaultCenter={americanFarmsGeoCenter}
            mapTypeControlOptions={mapIconOptions}
            fullscreenControlOptions={mapIconOptions}
            streetViewControlOptions={mapIconOptions}
            mapTypeId={google.maps.MapTypeId.SATELLITE}
        >
            <MapControl position={ControlPosition.TOP_RIGHT}>
                <div className="bg-white p-2 rounded-md shadow-lg flex flex-col">
                    <button
                        onClick={startDrawing}
                        className="p-2 text-white rounded-md"
                    >
                        <PencilRuler className="w-5 h-5" color="grey" />
                    </button>

                    <button onClick={clearPolygon} className="p-2 rounded-md">
                        <Eraser className="w-5 h-5" color="grey" />
                    </button>
                </div>
            </MapControl>
        </Map>
    );
};

export default memo(MapComponent);
