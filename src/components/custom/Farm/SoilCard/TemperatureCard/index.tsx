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

const SoilTemperatureCard = ({ data }: Props) => {
    return (
        <Card className="w-full max-w-xl mx-auto rounded-2xl shadow-md p-4">
            <CardHeader>
                <CardTitle>Soil Temperature</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-row  gap-4">
                <img
                    src="/images/soil-layers.jpg"
                    className="h-[300px] w-[250px]"
                />

                <div className="text-sm space-y-2">
                    <p>
                        <span className="text-red-700 font-semibold">0 cm</span>{" "}
                        : {data.soilTemperature0cm.toFixed(2)} °C
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">6 cm</span>{" "}
                        : {data.soilTemperature6cm.toFixed(2)} °C
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            18 cm
                        </span>{" "}
                        : {data.soilTemperature18cm.toFixed(2)} °C
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            54 cm
                        </span>{" "}
                        : {data.soilTemperature54cm.toFixed(2)} °C
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default memo(SoilTemperatureCard);
