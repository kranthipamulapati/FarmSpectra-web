import { memo, useRef, useState, useEffect, useCallback } from "react";

import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

import type { Coordinate } from "@/services";

import { americanFarmsGeoCenter } from "@/constants";

import Controls from "./Controls";
import FarmForm from "@/components/custom/Farm/Form";

const MapComponent = () => {
    const map = useMap();
    const drawing = useMapsLibrary("drawing");

    const [showFarmForm, setShowFarmForm] = useState(false);
    const [polygon, setPolygon] = useState<google.maps.Polygon>();
    const [coordinates, setCoordinates] = useState<Array<Coordinate>>([]);
    const [mapType, setMapType] = useState(google.maps.MapTypeId.SATELLITE);
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
        null
    );

    // start drawing a polygon

    const startDrawing = useCallback(() => {
        drawingManagerRef.current?.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
        );
    }, []);

    // clear a polygon

    const clearPolygon = useCallback(() => {
        polygon?.setMap(null);
        setPolygon(undefined);
        setShowFarmForm(false);
    }, [polygon]);

    // toggle map between road & satellite

    const toggleMapType = useCallback(() => {
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
    }, [map, mapType]);

    // add polygon complete listener

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
                const path = Polygon.getPath();
                const Coordinates: Array<Coordinate> = [];

                for (let i = 0; i < path.getLength(); i++) {
                    const point = path.getAt(i);
                    Coordinates.push({ lat: point.lat(), lng: point.lng() });
                }

                Coordinates.push(Coordinates[0]);

                setPolygon(Polygon);
                setShowFarmForm(true);
                setCoordinates(Coordinates);
                newDrawingManager.setDrawingMode(null);
            }
        );

        drawingManagerRef.current = newDrawingManager;

        return () => newDrawingManager.setMap(null);
    }, [map, drawing]);

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
            {showFarmForm && (
                <div className="absolute top-4 right-20">
                    <FarmForm
                        coordinates={coordinates}
                        clearPolygon={clearPolygon}
                    />
                </div>
            )}

            <Controls
                clearPolygon={clearPolygon}
                startDrawing={startDrawing}
                toggleMapType={toggleMapType}
            />
        </Map>
    );
};

export default memo(MapComponent);
