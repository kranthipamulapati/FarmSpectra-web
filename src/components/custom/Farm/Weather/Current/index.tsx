import { memo, useState } from "react";

import {
    Zap,
    Sun,
    Wind,
    Cloud,
    Droplet,
    Sparkles,
    Umbrella,
    CloudRain,
    LucideIcon,
    ThermometerSnowflake,
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
    { label: "Overview" },
    { label: "Temperature" },
    { label: "Precipitation" },
    { label: "Humidity" },
    { label: "Wind" },
    { label: "UV" },
];

const CurrentWeather = ({ weatherData }: { weatherData: WeatherData }) => {
    const baseTemp = 10; // Adjust for crop type
    const nowUtc = new Date(); // this is UTC under the hood

    const [tab, setTab] = useState("Overview");

    const gdd = Math.max(
        (weatherData.daily[0].temp.max + weatherData.daily[0].temp.min) / 2 -
            baseTemp,
        0
    );

    const dateStr = nowUtc.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        weekday: "long",
        timeZone: weatherData.timezone,
    });

    // Format time in the target timezone
    const timeStr = nowUtc.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        timeZone: weatherData.timezone,
    });

    return (
        <div className="w-[50%] max-w-[50%] p-4 shadow-sm rounded-2xl flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between">
                <p className="text-base font-medium">Current Weather</p>

                <p>{timeStr + ", " + dateStr}</p>
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
                    <div className="grid grid-cols-4 grid-rows-2 gap-3 flex-grow">
                        <WeatherStat
                            icon={CloudRain}
                            value={(weatherData.daily[0].rain || 0).toFixed(0)}
                            unit="mm"
                            label="Total Rainfall"
                            colorClass="text-blue-400"
                        />

                        <WeatherStat
                            icon={Umbrella}
                            value={weatherData.daily[0].pop.toFixed(0)}
                            unit="%"
                            label="Rain Probability"
                            colorClass="text-blue-400"
                        />

                        <WeatherStat
                            icon={Droplet}
                            value={weatherData.current.humidity}
                            unit="%"
                            label="Humidity"
                            colorClass="text-teal-400"
                        />

                        <WeatherStat
                            icon={Cloud}
                            value={weatherData.current.clouds}
                            unit="%"
                            label="Cloud Cover"
                            colorClass="text-gray-500"
                        />

                        <WeatherStat
                            icon={Wind}
                            value={weatherData.current.wind_speed.toFixed(1)}
                            unit="m/s"
                            label="Wind Speed"
                            colorClass="text-green-400"
                        />

                        <WeatherStat
                            icon={Zap}
                            value={weatherData.current.wind_gust.toFixed(1)}
                            unit="m/s"
                            label="Wind Gust"
                            colorClass="text-green-400"
                        />

                        <WeatherStat
                            icon={ThermometerSnowflake}
                            value={weatherData.current.dew_point.toFixed(1)}
                            unit="°C"
                            label="Dew Point"
                            colorClass="text-teal-400"
                        />

                        <WeatherStat
                            icon={Sparkles}
                            value={weatherData.current.uvi.toFixed(1)}
                            unit="UV"
                            label="UV Index"
                            colorClass="text-yellow-400"
                        />
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

                {tab === "Overview" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="Sunrise"
                                value={new Date(
                                    weatherData.current.sunrise * 1000
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            />

                            <DataRow
                                label="Sunset"
                                value={new Date(
                                    weatherData.current.sunset * 1000
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            />

                            <DataRow
                                label="Pressure"
                                value={`${weatherData.current.pressure} hPa`}
                            />

                            <DataRow
                                label="Visibility"
                                value={`${(
                                    weatherData.current.visibility / 1000
                                ).toFixed(1)} km`}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {weatherData.alerts && weatherData.alerts.length > 0
                                ? `⚠️ Alert: ${weatherData.alerts[0].event}`
                                : weatherData.daily[0].summary ||
                                  "No weather info available."}
                        </p>
                    </div>
                )}

                {tab === "Temperature" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <DataRow
                                label="Feels like"
                                value={`${Math.round(
                                    weatherData.current.feels_like
                                )}°C`}
                            />

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

                            <DataRow label="GDD" value={gdd.toFixed(1)} />

                            <DataRow
                                label="Trend"
                                value={
                                    <span
                                        className={
                                            weatherData.daily[0].temp.day >
                                            weatherData.daily[1].temp.day
                                                ? "text-red-500"
                                                : "text-blue-500"
                                        }
                                    >
                                        {weatherData.daily[0].temp.day >
                                        weatherData.daily[1].temp.day
                                            ? "↑"
                                            : "↓"}
                                        {Math.abs(
                                            weatherData.daily[0].temp.day -
                                                weatherData.daily[1].temp.day
                                        ).toFixed(1)}
                                        °C
                                    </span>
                                }
                            />

                            <DataRow
                                label="Frost Risk"
                                value={
                                    weatherData.daily[0].temp.min < 2 ? (
                                        <span className="text-blue-500">
                                            High
                                        </span>
                                    ) : (
                                        <span className="text-green-500">
                                            Low
                                        </span>
                                    )
                                }
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getTempRecommendation(weatherData.current.temp)}
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
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getPrecipRecommendation(
                                weatherData.daily[0].rain || 0,
                                weatherData.current.humidity
                            )}
                        </p>
                    </div>
                )}

                {tab === "Humidity" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2"></div>

                        <p className="text-xs text-muted-foreground mt-2">
                            {getDewPointRecommendation(
                                weatherData.current.dew_point,
                                weatherData.current.temp
                            )}
                        </p>
                    </div>
                )}

                {tab === "Wind" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
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

                {tab === "UV" && (
                    <div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
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

type WeatherStatProps = {
    unit?: string;
    label: string;
    icon: LucideIcon;
    colorClass: string;
    value: string | number;
};

function WeatherStat({
    unit,
    label,
    value,
    icon: Icon,
    colorClass,
}: WeatherStatProps) {
    return (
        <Tooltip>
            <TooltipTrigger
                aria-label={label}
                className="flex gap-1 items-center"
            >
                <Icon className={`${colorClass} w-6 h-6`} aria-hidden="true" />

                <div className="flex flex-col">
                    <span className="text-lg font-medium">
                        {value}{" "}
                        {unit && (
                            <span className="text-xs text-muted-foreground">
                                {unit}
                            </span>
                        )}
                    </span>
                </div>
            </TooltipTrigger>

            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default memo(CurrentWeather);
