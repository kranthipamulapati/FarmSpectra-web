import { memo, useState } from "react";

import clsx from "clsx";
import { Sun, AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { WeatherData } from "@/services/farms";

const TABS = ["Temp", "Precip", "Wind", "Humidity", "UV"];

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

                    {weatherData.alerts && weatherData.alerts.length > 0 ? (
                        <div className="mb-2 p-2 bg-red-100 rounded text-red-800 text-sm">
                            <AlertTriangle className="inline mr-1 w-4 h-4" />
                            Active Alert: {weatherData?.alerts[0].event}
                        </div>
                    ) : null}
                </div>

                <div className="text-xs text-right space-y-1 text-muted-foreground">
                    <p className="flex justify-between gap-4">
                        <span>Feels Like:</span>
                        <span className="font-medium">
                            {Math.round(weatherData.current.feels_like)}°C
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>High:</span>
                        <span className="font-medium">
                            {Math.round(weatherData.daily[0].temp.max)}°C
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Low:</span>
                        <span className="font-medium">
                            {Math.round(weatherData.daily[0].temp.min)}°C
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Sunrise:</span>
                        <span className="font-medium">
                            {new Date(
                                weatherData.current.sunrise * 1000
                            ).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
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

                    <p className="flex justify-between gap-4">
                        <span>Wind speed:</span>
                        <span className="font-medium">
                            {`${weatherData.current.wind_speed.toFixed(1)} m/s`}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Wind gusts:</span>
                        <span className="font-medium">
                            {`${
                                weatherData.current.wind_gust?.toFixed(1) || "-"
                            } m/s`}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Wind direction:</span>
                        <span className="font-medium">
                            <WindArrow degrees={weatherData.current.wind_deg} />
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Rain 1hr:</span>
                        <span className="font-medium">
                            {`${(weatherData.hourly[0].pop * 100).toFixed(0)}%`}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Rain 24hr:</span>
                        <span className="font-medium">
                            {`${(weatherData.daily[0].rain || 0).toFixed(
                                1
                            )} mm`}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Humidity:</span>
                        <span className="font-medium">
                            {`${weatherData.current.humidity} %`}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Current UV:</span>
                        <span className="font-medium">
                            {weatherData.current.uvi.toFixed(1)}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>MAX UV:</span>
                        <span className="font-medium">
                            {weatherData.daily[0].uvi.toFixed(1)}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Dew point:</span>
                        <span className="font-medium">
                            {`${weatherData.current.dew_point.toFixed(1)}°C`}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span>Cloud cover:</span>
                        <span className="font-medium">
                            {`${weatherData.current.clouds}%`}
                        </span>
                    </p>
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
                    <p className="text-xs text-muted-foreground mt-2">
                        {getTempRecommendation(weatherData.current.temp)}
                    </p>
                </div>
            )}

            {tab === "Wind" && (
                <div className="text-sm space-y-2">
                    <p className="text-xs text-muted-foreground pt-2">
                        {getWindRecommendation(
                            weatherData.current.wind_speed,
                            weatherData.current.wind_gust
                        )}
                    </p>
                </div>
            )}

            {tab === "Precip" && (
                <div className="text-sm space-y-2">
                    <p className="text-xs text-muted-foreground pt-2">
                        {getPrecipRecommendation(
                            weatherData.daily[0].rain || 0,
                            weatherData.current.humidity
                        )}
                    </p>
                </div>
            )}

            {tab === "UV" && (
                <div className="text-sm space-y-2">
                    <p className="text-xs text-muted-foreground pt-2">
                        {getUVRecommendation(weatherData.current.uvi)}
                    </p>
                </div>
            )}

            {tab === "Humidity" && (
                <div className="text-sm space-y-2">
                    <p className="text-xs text-muted-foreground pt-2">
                        {getDewPointRecommendation(
                            weatherData.current.dew_point,
                            weatherData.current.temp
                        )}
                    </p>
                </div>
            )}
        </Card>
    );
}

export default memo(CurrentWeather);

// 2. Add wind direction arrow component:
const WindArrow = ({ degrees }: { degrees: number }) => (
    <div
        className="inline-block transition-transform"
        style={{ transform: `rotate(${degrees}deg)` }}
    >
        ↑
    </div>
);

// Wind recommendations
function getWindRecommendation(speed: number, gusts: number): string {
    if (speed > 10)
        return "Dangerous winds - Secure equipment, avoid spraying.";
    if (gusts > 15) return "Strong gusts expected - Protect sensitive crops.";
    if (speed > 5) return "Windy conditions - Avoid herbicide applications.";
    if (speed > 3) return "Moderate wind - Ideal for pollination activities.";
    return "Calm conditions - Good for spraying and delicate operations.";
}

function getTempRecommendation(temp: number): string {
    if (temp < 0)
        return "Frost risk — Protect sensitive crops and delay planting.";
    if (temp < 5) return "Cold stress zone — Monitor for frost damage.";
    if (temp < 10)
        return "Cool crops can germinate, but warm-season crops may stall.";
    if (temp < 15) return "Good for leafy greens; not ideal for warm crops.";
    if (temp < 20)
        return "Ideal for early growth stages and cool-season crops.";
    if (temp < 25)
        return "Excellent temperature for most crops — strong growth.";
    if (temp < 30)
        return "Still productive, but start watching for heat stress signs.";
    if (temp < 35) return "Heat stress possible — ensure adequate irrigation.";
    if (temp < 40) return "High heat stress — use shade, increase water.";
    return "Severe heat stress — delay operations and protect crops.";
}

// Add this recommendation function at the bottom
function getPrecipRecommendation(rain: number, humidity: number): string {
    if (rain > 5)
        return "Heavy rainfall - Delay field work and check drainage systems.";
    if (rain > 2)
        return "Moderate rain - Avoid machinery use to prevent soil compaction.";
    if (rain > 0.5)
        return "Light rain - Good for natural irrigation, monitor soil moisture.";
    if (humidity > 85)
        return "High humidity - Increase fungicide applications and crop spacing.";
    if (humidity < 30)
        return "Low humidity - Schedule irrigation and consider mulching.";
    if (humidity < 50)
        return "Dry conditions - Check soil moisture levels before irrigating.";
    return "Normal precipitation conditions - Maintain regular irrigation schedule.";
}

function getUVRecommendation(uvi: number): string {
    if (uvi >= 11)
        return "Extreme UV - Avoid fieldwork, crops need shade protection";
    if (uvi >= 8)
        return "Very High - Limit sun exposure, harvest in early morning";
    if (uvi >= 6)
        return "High - Use sun protection, sensitive crops may need cover";
    if (uvi >= 3) return "Moderate - Ideal for photosynthesis and plant growth";
    return "Low - Safe for extended outdoor work";
}

// Recommendation function
function getDewPointRecommendation(dewPoint: number, temp: number): string {
    const spread = temp - dewPoint;
    if (spread < 2) return "Fog likely - Delay spraying operations";
    if (dewPoint > 20) return "High humidity - Increase fungicide applications";
    if (dewPoint < 5) return "Low humidity - Ideal for harvesting grains";
    return "Comfortable humidity levels for most crops";
}

// Pressure recommendation logic
function getPressureTrend(current: number, hourly: HourlyForecast[]): string {
    const trend = hourly[0].pressure - current;
    if (trend > 2) return "Rapidly rising - Expect clearing skies";
    if (trend < -2) return "Falling quickly - Storm likely within 6 hours";
    return "Stable pressure - No significant weather changes expected";
}
