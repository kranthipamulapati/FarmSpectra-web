import {
    BitmapLayer,
    PolygonLayer,
    type BitmapBoundingBox,
} from "@deck.gl/layers";

import type { Coordinate } from "@/services";

const getBboxForPolygon = (
    polygon: Array<Coordinate>
): [Coordinate, Coordinate] => {
    let minLat = Infinity,
        minLng = Infinity;
    let maxLat = -Infinity,
        maxLng = -Infinity;

    polygon.forEach((point) => {
        const { lng, lat } = point;
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
    });

    return [
        { lat: minLat, lng: minLng },
        { lat: maxLat, lng: maxLng },
    ];
};

const getBitmapLayer = ({
    id,
    link,
    opacity,
    bounds,
}: {
    id: string;
    link: string;
    opacity: number;
    bounds: BitmapBoundingBox;
}): BitmapLayer => {
    const surveyMapLayer = new BitmapLayer({
        id,
        bounds,
        opacity,
        image: link,
        pickable: false,
    });

    return surveyMapLayer;
};

const getPolygonLayer = (coordinates: Array<Coordinate>): PolygonLayer => {
    const polygonCoords = coordinates.map((point) => [point.lng, point.lat]);

    const polygonLayer = new PolygonLayer({
        id: "user-polygon-layer",
        data: [
            {
                contour: polygonCoords,
                color: [0, 200, 100, 150],
            },
        ],
        filled: false,
        stroked: true,
        getLineWidth: 5,
        getLineColor: [0, 255, 0, 255],
        getPolygon: (d) => d.contour,
    });

    return polygonLayer;
};

export { getBitmapLayer, getPolygonLayer, getBboxForPolygon };
