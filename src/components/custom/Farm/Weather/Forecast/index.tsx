import { memo, useState } from "react";

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

import type { WeatherData } from "@/services/farms";

const metrics = [
    "Temp",
    "Precip",
    "Humidity",
    "Wind",
    "Pressure",
    "UV",
] as const;
const forecastRanges = ["60 min", "48 hours", "7 days"] as const;

type Props = {
    weatherData: WeatherData;
};

function WeatherForecast({ weatherData }: Props) {
    const [forecastRange, setForecastRange] =
        useState<(typeof forecastRanges)[number]>("48 hours");

    const [selectedMetric, setSelectedMetric] =
        useState<(typeof metrics)[number]>("Temp");

    const chartData = (() => {
        if (!weatherData) return [];

        if (forecastRange === "60 min") {
            // Only precipitation is available in minutely
            if (selectedMetric === "Precip") {
                return weatherData.minutely.slice(0, 60).map((entry) => ({
                    time: format(new Date(entry.dt * 1000), "h:mmaaa"),
                    value: entry.precipitation ?? 0,
                }));
            } else {
                return weatherData.minutely.slice(0, 60).map((entry) => ({
                    time: format(new Date(entry.dt * 1000), "h:mmaaa"),
                    value: null,
                }));
            }
        }

        if (forecastRange === "48 hours") {
            return weatherData.hourly.slice(0, 48).map((entry) => {
                const time = format(new Date(entry.dt * 1000), "haaa");
                const value = (() => {
                    switch (selectedMetric) {
                        case "Temp":
                            return entry.temp;
                        case "Humidity":
                            return entry.humidity;
                        case "Wind":
                            return entry.wind_speed;
                        case "Pressure":
                            return entry.pressure;
                        case "UV":
                            return entry.uvi;
                        case "Precip":
                            return entry.pop * 100; // pop = probability of precipitation (0–1)
                        default:
                            return null;
                    }
                })();
                return { time, value };
            });
        }

        if (forecastRange === "7 days") {
            return weatherData.daily.slice(0, 7).map((entry) => {
                const time = format(new Date(entry.dt * 1000), "EEE");
                const value = (() => {
                    switch (selectedMetric) {
                        case "Temp":
                            return entry.temp.day;
                        case "Humidity":
                            return entry.humidity;
                        case "Wind":
                            return entry.wind_speed;
                        case "Pressure":
                            return entry.pressure;
                        case "UV":
                            return entry.uvi;
                        case "Precip":
                            return entry.pop * 100;
                        default:
                            return null;
                    }
                })();
                return { time, value };
            });
        }

        return [];
    })();

    return (
        <div className="w-[50%] max-w-[50%] p-4 shadow-sm ml-4 rounded-2xl flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <p className="text-base font-medium">Weather Forecast</p>

                {/* Forecast Range Tabs */}
                <div className="flex items-center gap-2">
                    {forecastRanges.map((range) => (
                        <span
                            key={range}
                            onClick={() => setForecastRange(range)}
                            className="cursor-pointer"
                        >
                            {forecastRange === range ? (
                                <Badge
                                    variant="default"
                                    className="bg-orange-500 hover:bg-orange-600 capitalize"
                                >
                                    {range}
                                </Badge>
                            ) : (
                                <span className="text-muted-foreground text-sm capitalize">
                                    {range}
                                </span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Metric Tabs */}
                <div className="flex items-center gap-2">
                    {metrics.map((metric) => (
                        <span
                            key={metric}
                            onClick={() => setSelectedMetric(metric)}
                            className="cursor-pointer"
                        >
                            {selectedMetric === metric ? (
                                <Badge
                                    variant="default"
                                    className="bg-orange-500 hover:bg-orange-600 capitalize"
                                >
                                    {metric}
                                </Badge>
                            ) : (
                                <span className="text-muted-foreground text-sm capitalize">
                                    {metric}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[100%]">
                <ResponsiveContainer className="mt-5" width="100%" height="90%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default memo(WeatherForecast);
