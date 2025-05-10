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

// Wind recommendations
function getWindRecommendation(speed: number, gusts: number): string {
    if (speed > 10)
        return "Dangerous winds - Secure equipment, avoid spraying.";
    if (gusts > 15) return "Strong gusts expected - Protect sensitive crops.";
    if (speed > 5) return "Windy conditions - Avoid herbicide applications.";
    if (speed > 3) return "Moderate wind - Ideal for pollination activities.";
    return "Calm conditions - Good for spraying and delicate operations.";
}

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

function getDewPointRecommendation(dewPoint: number, temp: number): string {
    const spread = temp - dewPoint;
    if (spread < 2) return "Fog likely - Delay spraying operations";
    if (dewPoint > 20) return "High humidity - Increase fungicide applications";
    if (dewPoint < 5) return "Low humidity - Ideal for harvesting grains";
    return "Comfortable humidity levels for most crops";
}

export {
    getUVRecommendation,
    getTempRecommendation,
    getWindRecommendation,
    getPrecipRecommendation,
    getDewPointRecommendation,
};
