import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { WeatherData } from "@/services/farms";
import { memo } from "react";

function transformHumidityData(weatherData: WeatherData) {
    return weatherData.hourly.slice(0, 30).map((entry) => ({
        time: format(new Date(entry.dt * 1000), "d MMM, haaa"),
        humidity: entry.humidity,
    }));
}

function WeatherForecast({ weatherData }: { weatherData: WeatherData }) {
    const chartData = transformHumidityData(weatherData);

    return (
        <Card className="ml-4 p-4 shadow-md w-[50%]">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Day Forecast</h2>

                <div className="space-x-2">
                    <Badge
                        variant="default"
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        Humidity
                    </Badge>

                    <span className="text-muted-foreground text-sm">
                        Pressure
                    </span>

                    <span className="text-muted-foreground text-sm">
                        Temperature
                    </span>

                    <span className="text-muted-foreground text-sm">Rain</span>

                    <span className="text-muted-foreground text-sm">
                        Wind Speed
                    </span>
                </div>
            </div>

            <CardContent className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />

                        <YAxis domain={[0, 100]} />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default memo(WeatherForecast);
