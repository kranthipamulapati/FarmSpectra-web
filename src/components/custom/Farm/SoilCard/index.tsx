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

const SoilCard = ({ data }: Props) => {
    return (
        <Card className="w-full max-w-4xl mx-auto rounded-2xl shadow-md p-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg font-semibold">
                    Soil Conditions
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                {/* Moisture values on the left */}
                <div className="w-full md:w-1/3 text-left space-y-2">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                        Moisture
                    </h3>

                    <p>
                        <span className="text-red-700 font-semibold">1 cm</span>{" "}
                        : {(data.soilMoisture0To1cm * 100).toFixed(0)}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">3 cm</span>{" "}
                        : {(data.soilMoisture1To3cm * 100).toFixed(0)}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">9 cm</span>{" "}
                        : {(data.soilMoisture3To9cm * 100).toFixed(0)}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            27 cm
                        </span>{" "}
                        : {(data.soilMoisture9To27cm * 100).toFixed(0)}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            81 cm
                        </span>{" "}
                        : {(data.soilMoisture27To81cm * 100).toFixed(0)}%
                    </p>
                </div>

                {/* Image in the center */}
                <div className="flex justify-center w-full md:w-1/3">
                    <img
                        height={500}
                        src="/images/soil-layers.jpg"
                        className="w-[280px] object-contain rounded-lg"
                    />
                </div>

                {/* Temperature values on the right */}
                <div className="w-full md:w-1/3 text-right space-y-2">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                        Temperature
                    </h3>

                    <p>
                        <span className="text-red-700 font-semibold">0 cm</span>{" "}
                        : {data.soilTemperature0cm.toFixed(0)} °C
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">6 cm</span>{" "}
                        : {data.soilTemperature6cm.toFixed(0)} °C
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            18 cm
                        </span>{" "}
                        : {data.soilTemperature18cm.toFixed(0)} °C
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            54 cm
                        </span>{" "}
                        : {data.soilTemperature54cm.toFixed(0)} °C
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default memo(SoilCard);
