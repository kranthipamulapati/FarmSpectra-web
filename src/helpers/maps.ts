import {
    LineLayer,
    BitmapLayer,
    PolygonLayer,
    type BitmapBoundingBox,
} from "@deck.gl/layers";

import type { Coordinate } from "@/services";

export type Suggestion = {
    place_id: string;
    description: string;
};

const getAddress = async ({
    geocoding,
    Coordinates,
}: {
    geocoding: google.maps.GeocodingLibrary;
    Coordinates: Array<{
        lat: number;
        lng: number;
    }>;
}) => {
    const geocoder = new geocoding.Geocoder();
    const response = await geocoder.geocode({
        location: {
            lat: Coordinates[0].lat,
            lng: Coordinates[0].lng,
        },
    });

    let state_code = "";
    let country_code = "";
    let postal_code = "";
    let district_name = "";

    response.results.map((result) => {
        for (const component of result.address_components) {
            if (component.types.includes("postal_code")) {
                postal_code = component.short_name;
            }

            if (component.types.includes("administrative_area_level_3")) {
                district_name = component.long_name;
            }

            if (component.types.includes("administrative_area_level_1")) {
                state_code = component.short_name;
            }

            if (component.types.includes("country")) {
                country_code = component.short_name;
            }
        }
    });

    return {
        postal_code,
        district_name,
        state_code,
        country_code,
    };
};

const searchByAddress = async ({
    places,
    address,
}: {
    address: string;
    places: google.maps.PlacesLibrary;
}): Promise<Array<Suggestion>> => {
    const autocompleteService = new places.AutocompleteService();
    const response = await autocompleteService.getPlacePredictions({
        input: address,
    });

    return response.predictions.map((prediction) => {
        const { place_id, description } = prediction;
        return {
            place_id,
            description,
        };
    });
};

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

const getPolygonLayer = ({
    id,
    coordinates,
}: {
    id: string;
    coordinates: Array<Coordinate>;
}): PolygonLayer => {
    const polygonCoords = coordinates.map((point) => [point.lng, point.lat]);

    const polygonLayer = new PolygonLayer({
        id,
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

const getLineLayer = ({
    id,
    bounds,
}: {
    id: string;
    bounds: [number, number, number, number];
}): LineLayer => {
    const [west, south, , north] = bounds;

    const data = [
        {
            source: [west, north], // top-left
            target: [west, south], // bottom-left
        },
    ];

    const lineLayer = new LineLayer({
        id,
        data,
        getWidth: 1,
        pickable: false,
        getColor: [0, 0, 255],
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
    });

    return lineLayer;
};

export {
    getAddress,
    searchByAddress,
    getLineLayer,
    getBitmapLayer,
    getPolygonLayer,
    getBboxForPolygon,
};
