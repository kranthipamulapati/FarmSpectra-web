import { memo, useState } from "react";

import {
    Sun,
    Wind,
    Cloud,
    Repeat,
    Droplet,
    ArrowUp,
    Umbrella,
    ArrowDown,
    Thermometer,
} from "lucide-react";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";

import {
    getUVRecommendation,
    getWindRecommendation,
    getTempRecommendation,
    getPrecipRecommendation,
    getDewPointRecommendation,
} from "@/helpers/weather";

import type { WeatherData } from "@/services/farms";

const TABS = [
    { label: "Temperature" },
    { label: "Precipitation" },
    { label: "Wind" },
    { label: "Humidity" },
    { label: "UV" },
];

const CurrentWeather = ({ weatherData }: { weatherData: WeatherData }) => {
    const [tab, setTab] = useState("Temperature");

    const diurnalRange = Math.round(
        weatherData.daily[0].temp.max - weatherData.daily[0].temp.min
    );

    const baseTemp = 10; // Adjust for crop type

    const gdd = Math.max(
        (weatherData.daily[0].temp.max + weatherData.daily[0].temp.min) / 2 -
            baseTemp,
        0
    );

    return (
        <div className="w-[45%] max-w-[45%] p-3 shadow-sm rounded-2xl flex flex-col justify-between">
            <div className="flex flex-row gap-2 items-center">
                <p className="text-base font-medium">Current Weather</p>

                <p>
                    {new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                </p>
            </div>

            <div className="flex flex-row items-center">
                {/* Current Temperature - Left Side */}
                <div className="flex flex-row gap-2 items-center mr-6">
                    <Sun className="text-yellow-400 w-15 h-15" />

                    <span className="text-4xl font-medium">
                        {weatherData.current.temp}°
                    </span>

                    <span className="text-sm text-muted-foreground">C</span>
                </div>

                {/* 4x2 Grid - Right Side */}
                <TooltipProvider>
                    <div className="grid grid-cols-4 grid-rows-2 gap-x-3 gap-y-2 flex-grow">
                        {/* Row 1 */}

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <Wind className="text-blue-400 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {weatherData.current.wind_speed.toFixed(
                                            1
                                        )}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        m/s
                                    </span>
                                </div>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>Wind speed</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <Droplet className="text-blue-400 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {(
                                            weatherData.hourly[0].pop * 100
                                        ).toFixed(0)}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        %
                                    </span>
                                </div>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>Rain</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <ArrowUp className="text-red-500 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {Math.round(
                                            weatherData.daily[0].temp.max
                                        )}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        °C
                                    </span>
                                </div>

                                <TooltipContent>
                                    <p>Max Temp</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <ArrowDown className="text-blue-500 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {Math.round(
                                            weatherData.daily[0].temp.min
                                        )}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        °C
                                    </span>
                                </div>

                                <TooltipContent>
                                    <p>Min Temp</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>

                        {/* Row 2 */}

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <Repeat className="text-purple-400 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {diurnalRange}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        °C
                                    </span>
                                </div>

                                <TooltipContent>
                                    <p>Diurnal Range</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <Cloud className="text-purple-400 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {weatherData.current.uvi.toFixed(1)}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        UV
                                    </span>
                                </div>

                                <TooltipContent>
                                    <p>UV</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <Thermometer className="text-orange-500 w-6 h-6" />

                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {gdd.toFixed(1)}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        GDD
                                    </span>
                                </div>

                                <TooltipContent>
                                    <p>Growing degree days</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex flex-row gap-1 items-center">
                                <Umbrella className="text-grey-500 w-6 h-6" />

                                <div className="flex flex-col text-xs text-muted-foreground">
                                    <span className="text-lg font-medium">
                                        {weatherData.current.clouds}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        %
                                    </span>
                                </div>

                                <TooltipContent>
                                    <p>Cloud cover</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>

            <div>
                <div className="flex gap-4 border-b text-sm mt-4">
                    {TABS.map(({ label }) => (
                        <button
                            key={label}
                            onClick={() => setTab(label)}
                            className={
                                tab === label
                                    ? "pb-1 flex items-center gap-1 text-black border-b-2 border-yellow-400"
                                    : "pb-1 flex items-center gap-1 text-muted-foreground"
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "Temperature" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="High"
                                value={`${Math.round(
                                    weatherData.daily[0].temp.max
                                )}°C`}
                            />

                            <DataRow
                                label="Low"
                                value={`${Math.round(
                                    weatherData.daily[0].temp.min
                                )}°C`}
                            />

                            <DataRow
                                label="Diurnal Range"
                                value={`${diurnalRange}°C`}
                            />

                            <DataRow label="GDD" value={gdd.toFixed(1)} />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getTempRecommendation(weatherData.current.temp)}
                        </p>
                    </div>
                )}

                {tab === "Wind" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="Wind speed"
                                value={`${weatherData.current.wind_speed.toFixed(
                                    1
                                )} m/s`}
                            />

                            <DataRow
                                label="Wind gusts"
                                value={`${
                                    weatherData.current.wind_gust?.toFixed(1) ||
                                    "-"
                                } m/s`}
                            />

                            <DataRow
                                label="Wind direction"
                                value={
                                    <WindArrow
                                        degrees={weatherData.current.wind_deg}
                                    />
                                }
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getWindRecommendation(
                                weatherData.current.wind_speed,
                                weatherData.current.wind_gust
                            )}
                        </p>
                    </div>
                )}

                {tab === "Precipitation" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="Rain 1hr"
                                value={`${(
                                    weatherData.hourly[0].pop * 100
                                ).toFixed(0)}%`}
                            />

                            <DataRow
                                label="Rain 24hr"
                                value={`${(
                                    weatherData.daily[0].rain || 0
                                ).toFixed(1)} mm`}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getPrecipRecommendation(
                                weatherData.daily[0].rain || 0,
                                weatherData.current.humidity
                            )}
                        </p>
                    </div>
                )}

                {tab === "UV" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="Current UV"
                                value={weatherData.current.uvi.toFixed(1)}
                            />

                            <DataRow
                                label="MAX UV"
                                value={weatherData.daily[0].uvi.toFixed(1)}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getUVRecommendation(weatherData.current.uvi)}
                        </p>
                    </div>
                )}

                {tab === "Humidity" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="Humidity"
                                value={`${weatherData.current.humidity} %`}
                            />

                            <DataRow
                                label="Dew point"
                                value={`${weatherData.current.dew_point.toFixed(
                                    1
                                )}°C`}
                            />

                            <DataRow
                                label="Cloud cover"
                                value={`${weatherData.current.clouds}%`}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getDewPointRecommendation(
                                weatherData.current.dew_point,
                                weatherData.current.temp
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DataRow = ({
    label,
    value,
}: {
    label: string;
    value: string | React.ReactNode;
}) => (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>{label}:</span>
        <span className="font-medium text-black mr-4">{value}</span>
    </div>
);

const WindArrow = ({ degrees }: { degrees: number }) => (
    <div
        className="inline-block transition-transform"
        style={{ transform: `rotate(${degrees}deg)` }}
    >
        ↑
    </div>
);

export default memo(CurrentWeather);
