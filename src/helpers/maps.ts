import { BitmapLayer, PolygonLayer } from "@deck.gl/layers";

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
    bounds: [number, number, number, number];
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

const getBboxPolygonLayer = (bbox: [Coordinate, Coordinate]): PolygonLayer => {
    const bboxPolygon = new PolygonLayer({
        id: "bbox-layer",
        data: [
            {
                polygon: [
                    [bbox[0].lng, bbox[0].lat], // Bottom-left corner
                    [bbox[1].lng, bbox[0].lat], // Bottom-right corner
                    [bbox[1].lng, bbox[1].lat], // Top-right corner
                    [bbox[0].lng, bbox[1].lat], // Top-left corner
                    [bbox[0].lng, bbox[0].lat], // Closing the loop
                ],
            },
        ],
        stroked: true,
        filled: false,
        getLineWidth: 5,
        getLineColor: [255, 0, 0, 255], // Red
    });

    return bboxPolygon;
};

export { getBitmapLayer, getBboxForPolygon, getBboxPolygonLayer };
