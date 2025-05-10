import { memo, useState } from "react";

import { Sun, Wind, Droplet } from "lucide-react";

import {
    getUVRecommendation,
    getWindRecommendation,
    getTempRecommendation,
    getPrecipRecommendation,
    getDewPointRecommendation,
} from "@/helpers/weather";

import type { WeatherData } from "@/services/farms";

const TABS = [
    { label: "Temp" },
    { label: "Precip" },
    { label: "Wind" },
    { label: "Humidity" },
    { label: "UV" },
];

const CurrentWeather = ({ weatherData }: { weatherData: WeatherData }) => {
    const [tab, setTab] = useState("Temp");

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
        <div className="w-[40%] max-w-[40%] p-3 shadow-sm rounded-2xl flex flex-col justify-between">
            <div className="flex flex-row gap-2 items-center">
                <p className="text-base font-medium">Current Weather</p>

                <p>
                    {new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                </p>
            </div>

            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <Sun className="text-yellow-400 w-10 h-10" />

                    <span className="text-3xl font-medium">
                        {weatherData.current.temp}°
                    </span>

                    <span className="text-sm text-muted-foreground">C</span>
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <Wind className="text-yellow-400 w-10 h-10" />

                    <span className="text-3xl font-medium">
                        {weatherData.current.wind_speed.toFixed(1)}
                    </span>

                    <span className="text-sm text-muted-foreground">m/s</span>
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <Droplet className="text-yellow-400 w-10 h-10" />

                    <span className="text-3xl font-medium">
                        {(weatherData.hourly[0].pop * 100).toFixed(0)}
                    </span>

                    <span className="text-sm text-muted-foreground">%</span>
                </div>

                <div className="flex flex-row gap-2 text-xs">
                    <div>
                        <p className="flex justify-between gap-2">
                            <span>Sunset:</span>

                            <span className="font-medium">
                                {new Date(
                                    weatherData.current.sunset * 1000
                                ).toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </span>
                        </p>

                        <p className="flex justify-between gap-2">
                            <span>Wind gusts:</span>

                            <span className="font-medium">
                                {`${
                                    weatherData.current.wind_gust?.toFixed(1) ||
                                    "-"
                                } m/s`}
                            </span>
                        </p>

                        <p className="flex justify-between gap-2">
                            <span>Wind dir:</span>

                            <span className="font-medium">
                                <WindArrow
                                    degrees={weatherData.current.wind_deg}
                                />
                            </span>
                        </p>
                    </div>

                    <div>
                        <p className="flex justify-between gap-2">
                            <span>Rain 24hr:</span>
                            <span className="font-medium">
                                {`${(weatherData.daily[0].rain || 0).toFixed(
                                    1
                                )} mm`}
                            </span>
                        </p>

                        <p className="flex justify-between gap-2">
                            <span>Humidity:</span>
                            <span className="font-medium">
                                {`${weatherData.current.humidity} %`}
                            </span>
                        </p>

                        <p className="flex justify-between gap-2">
                            <span>UV:</span>
                            <span className="font-medium">
                                {weatherData.current.uvi.toFixed(1)}
                            </span>
                        </p>

                        <p className="flex justify-between gap-2">
                            <span>Dew point:</span>
                            <span className="font-medium">
                                {`${weatherData.current.dew_point.toFixed(
                                    1
                                )}°C`}
                            </span>
                        </p>

                        <p className="flex justify-between gap-2">
                            <span>Clouds:</span>
                            <span className="font-medium">
                                {`${weatherData.current.clouds}%`}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex gap-4 border-b text-sm">
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

                {tab === "Temp" && (
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

                {tab === "Precip" && (
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
