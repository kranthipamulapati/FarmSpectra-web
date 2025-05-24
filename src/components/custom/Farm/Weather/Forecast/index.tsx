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
import { CalendarDays, LineChart as LineChartIcon } from "lucide-react";

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
const forecastRanges = ["60min", "48h", "7d"] as const;

type Props = {
    weatherData: WeatherData;
};

function WeatherForecast({ weatherData }: Props) {
    const [forecastType, setForecastType] = useState<"weekly" | "all">(
        "weekly"
    );

    const [forecastRange, setForecastRange] =
        useState<(typeof forecastRanges)[number]>("48h");

    const [selectedMetric, setSelectedMetric] =
        useState<(typeof metrics)[number]>("Temp");

    const getDayLabel = (timestamp: number) =>
        format(new Date(timestamp * 1000), "EEE");

    const getIconUrl = (icon: string) =>
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const chartData = (() => {
        if (!weatherData) return [];

        if (forecastRange === "60min") {
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

        if (forecastRange === "48h") {
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

        if (forecastRange === "7d") {
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
                <p className="text-base font-medium">Forecast</p>

                {forecastType === "all" && (
                    <>
                        {/* Forecast Range Tabs */}
                        <div className="flex items-center gap-2 ml-auto mr-2">
                            {forecastRanges.map((range) => (
                                <span
                                    key={range}
                                    className="cursor-pointer"
                                    onClick={() => setForecastRange(range)}
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
                        <div className="flex items-center gap-2 ml-auto mr-2">
                            {metrics.map((metric) => (
                                <span
                                    key={metric}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedMetric(metric)}
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
                    </>
                )}

                {/* Forecast Type Toggle */}
                <div className="flex items-center gap-2 ml-auto mr-2">
                    <button
                        onClick={() => setForecastType("weekly")}
                        className={`p-1 rounded-full ${
                            forecastType === "weekly"
                                ? "bg-orange-500 text-white"
                                : "text-muted-foreground hover:bg-gray-100"
                        }`}
                        title="Weekly View"
                    >
                        <CalendarDays size={18} />
                    </button>

                    <button
                        onClick={() => setForecastType("all")}
                        className={`p-1 rounded-full ${
                            forecastType === "all"
                                ? "bg-orange-500 text-white"
                                : "text-muted-foreground hover:bg-gray-100"
                        }`}
                        title="Detailed Chart View"
                    >
                        <LineChartIcon size={18} />
                    </button>
                </div>
            </div>

            {forecastType === "all" ? (
                <div className="h-[100%]">
                    <ResponsiveContainer
                        className="mt-5"
                        width="100%"
                        height="90%"
                    >
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
            ) : (
                <div className="flex flex-row justify-between mt-4">
                    {weatherData.daily.slice(1, 8).map((day, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-sm"
                        >
                            <p className="font-medium">{getDayLabel(day.dt)}</p>

                            <img
                                className="w-25 h-25"
                                alt={day.weather[0].description}
                                src={getIconUrl(day.weather[0].icon)}
                            />

                            <p className="text-xs">
                                {Math.round(day.temp.max)}°
                            </p>

                            <p className="text-xs text-gray-500">
                                {Math.round(day.temp.min)}°
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default memo(WeatherForecast);
