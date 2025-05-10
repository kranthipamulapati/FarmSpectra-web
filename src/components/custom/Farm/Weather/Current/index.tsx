import { memo, useState } from "react";

import {
    Sun,
    Zap,
    Wind,
    Gauge,
    Compass,
    Droplets,
    CloudRain,
    SunMedium,
    ArrowUpRight,
    ThermometerSun,
} from "lucide-react";
import clsx from "clsx";

import { Card } from "@/components/ui/card";

import type { WeatherData } from "@/services/farms";

const TABS = ["Temp"];

function CurrentWeather({ weatherData }: { weatherData: WeatherData }) {
    const [tab, setTab] = useState("Temp");

    return (
        <Card className="w-[50%] max-w-[50%] p-3 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-base font-medium">Current Weather</h2>

                    <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <div className="text-xs text-right space-y-1 text-muted-foreground">
                    <p>Humidity: {weatherData.current.humidity}%</p>
                    <p>Rain: {weatherData.current.weather[0].description} mm</p>
                    <p>Wind: {weatherData.current.wind_speed} km/h</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Sun className="text-yellow-400 w-5 h-5" />

                <span className="text-3xl font-bold">
                    {weatherData.current.temp}°
                </span>

                <span className="text-sm text-muted-foreground">C</span>
            </div>

            <div className="flex gap-4 border-b text-sm">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={clsx(
                            "pb-1",
                            t === tab
                                ? "text-black border-b-2 border-yellow-400"
                                : "text-muted-foreground"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === "Temp" && (
                <div className="text-sm space-y-1">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <ThermometerSun className="w-4 h-4" />
                            Temp:{" "}
                            <span className="text-black font-medium">
                                {weatherData.current.temp}°C
                            </span>
                        </span>

                        <span className="flex items-center gap-1">
                            <Gauge className="w-4 h-4" />
                            Pressure:{" "}
                            <span className="text-black font-medium">
                                {weatherData.current.pressure} hPa
                            </span>
                        </span>

                        <span className="flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4" />
                            Dew Point:{" "}
                            <span className="text-black font-medium">
                                {weatherData.current.dew_point}°C
                            </span>
                        </span>

                        <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            VPD:{" "}
                            <span className="text-black font-medium">
                                {weatherData.current.vpd} kPa
                            </span>
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                        Ideal temperature and VPD help optimize plant
                        transpiration and photosynthesis.
                    </p>
                </div>
            )}

            {tab === "Precipitation" && (
                <div className="text-sm space-y-1">
                    <p>
                        <CloudRain className="inline w-4 h-4 mr-1" />
                        Rainfall: {weatherData.current.precipitation} mm
                    </p>
                    <p>
                        <Droplets className="inline w-4 h-4 mr-1" />
                        Humidity: {weatherData.current.humidity}%
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                        Moisture levels affect irrigation needs and disease
                        risk.
                    </p>
                </div>
            )}

            {tab === "Wind" && (
                <div className="text-sm space-y-1">
                    <p>
                        <Wind className="inline w-4 h-4 mr-1" />
                        Speed: {weatherData.current.wind_speed} km/h
                    </p>
                    <p>
                        <Compass className="inline w-4 h-4 mr-1" />
                        Direction: {weatherData.current.wind_gust}
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                        Wind impacts pollination, pesticide application, and
                        evapotranspiration rates.
                    </p>
                </div>
            )}

            {tab === "UV" && (
                <div className="text-sm space-y-1">
                    <p>
                        <SunMedium className="inline w-4 h-4 mr-1" />
                        UV Index: {weatherData.current.uvi}
                    </p>
                    <p>
                        <Sun className="inline w-4 h-4 mr-1" />
                        Solar Radiation: {
                            weatherData.current.solarRadiation
                        }{" "}
                        W/m²
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                        High UV and radiation boost photosynthesis but require
                        shade protection for sensitive crops.
                    </p>
                </div>
            )}

            {tab === "AQI" && (
                <div className="space-y-1 text-sm">
                    <div className="text-3xl font-bold text-black">
                        {weatherData.current.aqi}
                    </div>

                    <p className="text-xs font-medium text-yellow-600">Poor</p>

                    <p className="text-xs text-muted-foreground">
                        Air pollution affects plant respiration and may stress
                        crops. Sensitive crops may show reduced growth.
                    </p>

                    <div className="relative h-2 mt-2 bg-green-300 rounded-full">
                        <div
                            className="absolute top-0 h-2 bg-yellow-400 rounded-full"
                            style={{ width: `${(data.aqi / 400) * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                        <span>0</span>
                        <span>100</span>
                        <span>200</span>
                        <span>300</span>
                        <span>400+</span>
                    </div>
                </div>
            )}
        </Card>
    );
}

export default memo(CurrentWeather);
