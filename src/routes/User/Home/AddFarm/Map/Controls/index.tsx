import { memo } from "react";

import { MapControl, ControlPosition } from "@vis.gl/react-google-maps";
import { X, Search, Expand, Layers, SquareDashed } from "lucide-react";

type Props = {
    startDrawing: () => void;
    clearPolygon: () => void;
    toggleMapType: () => void;
};

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

const Controls = ({ clearPolygon, startDrawing, toggleMapType }: Props) => {
    return (
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
    );
};

export default memo(Controls);
