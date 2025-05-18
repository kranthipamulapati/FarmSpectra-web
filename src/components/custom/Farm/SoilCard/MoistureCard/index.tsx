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

const SoilMoistureCard = ({ data }: Props) => {
    return (
        <Card className="w-full max-w-xl mx-auto rounded-2xl shadow-md p-4">
            <CardHeader>
                <CardTitle>Soil Moisture</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-row  gap-4">
                <img
                    src="/images/soil-layers.jpg"
                    className="h-[300px] w-[250px]"
                />

                <div className="text-sm space-y-2">
                    <p>
                        <span className="text-red-700 font-semibold">1 cm</span>{" "}
                        : {data.soilMoisture0To1cm}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">3 cm</span>{" "}
                        : {data.soilMoisture1To3cm}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">9 cm</span>{" "}
                        : {data.soilMoisture3To9cm}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            27 cm
                        </span>{" "}
                        : {data.soilMoisture9To27cm}%
                    </p>

                    <p>
                        <span className="text-red-700 font-semibold">
                            81 cm
                        </span>{" "}
                        : {data.soilMoisture27To81cm}%
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default memo(SoilMoistureCard);
