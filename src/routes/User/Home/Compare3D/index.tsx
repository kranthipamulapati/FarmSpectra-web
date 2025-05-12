import { memo } from "react";
import Map from "react-map-gl/mapbox";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";

import "mapbox-gl/dist/mapbox-gl.css";

const INITIAL_VIEW_STATE = {
    longitude: -102.3521,
    latitude: 33.0358,
    zoom: 16, // zoomed in close for farm scale
    pitch: 60,
    bearing: 0,
};

// Generate small cluster of points around the farm location
const data = Array.from({ length: 100 }, () => ({
    position: [
        -102.3521 + (Math.random() - 0.5) * 0.002, // ~200m variation
        33.0358 + (Math.random() - 0.5) * 0.002,
    ],
    weight: Math.floor(Math.random() * 20) + 5, // smaller weights
}));

function App() {
    const hexLayer = new HexagonLayer({
        id: "farm-hex-layer",
        data,
        getPosition: (d) => d.position,
        getWeight: (d) => d.weight,
        radius: 20, // 🟢 Small hex size (20 meters)
        elevationScale: 5, // 🟢 Smaller column height
        extruded: true,
        pickable: true,
        opacity: 0.8,
        coverage: 0.95,
        elevationRange: [0, 100],
    });

    return (
        <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={[hexLayer]}
        >
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />
        </DeckGL>
    );
}

export default memo(App);
