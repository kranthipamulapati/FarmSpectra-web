import { memo } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

type SoilData = {
    time: string;
    soilTemperature0cm: number;
    soilTemperature6cm: number;
    soilTemperature18cm: number;
    soilTemperature54cm: number;
    soilMoisture0To1cm: number;
    soilMoisture1To3cm: number;
    soilMoisture3To9cm: number;
    soilMoisture9To27cm: number;
    soilMoisture27To81cm: number;
};

type Props = {
    data: SoilData;
};

const backgroundImage = {
    backgroundImage: "url('/images/soil-layers.jpg')",
};

const SoilCard = ({ data }: Props) => {
    return (
        <Card className="w-full max-w-full rounded-2xl shadow-md">
            <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">
                    Soil Conditions
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col md:flex-row justify-between">
                {/* Moisture values on the left */}
                <div className="w-full md:w-1/3 text-left space-y-2">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                        Moisture
                    </h3>

                    <p>
                        <span className="font-semibold">1 cm</span> :{" "}
                        <span className="text-sky-600 font-semibold">
                            {(data.soilMoisture0To1cm * 100).toFixed(0)}%
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">3 cm</span> :{" "}
                        <span className="text-sky-600 font-semibold">
                            {(data.soilMoisture1To3cm * 100).toFixed(0)}%
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">9 cm</span> :{" "}
                        <span className="text-sky-600 font-semibold">
                            {(data.soilMoisture3To9cm * 100).toFixed(0)}%
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">27 cm</span> :{" "}
                        <span className="text-sky-600 font-semibold">
                            {(data.soilMoisture9To27cm * 100).toFixed(0)}%
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">81 cm</span> :{" "}
                        <span className="text-sky-600 font-semibold">
                            {(data.soilMoisture27To81cm * 100).toFixed(0)}%
                        </span>
                    </p>
                </div>

                {/* Background image in the center */}
                <div className="flex justify-center w-full md:w-1/3">
                    <div
                        role="img"
                        style={backgroundImage}
                        className="h-[100%] w-[100%] bg-contain bg-no-repeat bg-center rounded-lg"
                    />
                </div>

                {/* Temperature values on the right */}
                <div className="w-full md:w-1/3 text-right space-y-2">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                        Temperature
                    </h3>

                    <p>
                        <span className="font-semibold">0 cm</span> :{" "}
                        <span className="text-orange-500 font-semibold">
                            {data.soilTemperature0cm.toFixed(0)} °C
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">6 cm</span> :{" "}
                        <span className="text-orange-500 font-semibold">
                            {data.soilTemperature6cm.toFixed(0)} °C
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">18 cm</span> :{" "}
                        <span className="text-orange-500 font-semibold">
                            {data.soilTemperature18cm.toFixed(0)} °C
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold">54 cm</span> :{" "}
                        <span className="text-orange-500 font-semibold">
                            {data.soilTemperature54cm.toFixed(0)} °C
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default memo(SoilCard);
