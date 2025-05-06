import { Card } from "@/components/ui/card";

import { Compass } from "lucide-react"; // Optional: replace with your preferred icon

export default function WindStatusWidget() {
    const windSpeed = 7.7;
    const windDirection = "WSW"; // West-Southwest

    return (
        <Card className="w-48 h-48 flex flex-col justify-between p-4">
            <p className="text-sm text-muted-foreground">Wind Status</p>

            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold">
                    {windSpeed.toFixed(2)}
                </span>

                <span className="text-sm text-muted-foreground">km/h</span>
            </div>

            <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">{windDirection}</span>
            </div>
        </Card>
    );
}
