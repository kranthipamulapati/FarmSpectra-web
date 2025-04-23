import { memo } from "react";

import {
    ChartLegend,
    ChartTooltip,
    ChartContainer,
    type ChartConfig,
    ChartLegendContent,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, XAxis, LineChart, CartesianGrid } from "recharts";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;

const WeatherForecast = () => {
    return (
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
            <LineChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip content={<ChartTooltipContent />} />

                <XAxis
                    tickMargin={10}
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />

                <Line dataKey="desktop" fill="var(--color-desktop)" />
                <Line dataKey="mobile" fill="var(--color-mobile)" />
            </LineChart>
        </ChartContainer>
    );
};

export default memo(WeatherForecast);
