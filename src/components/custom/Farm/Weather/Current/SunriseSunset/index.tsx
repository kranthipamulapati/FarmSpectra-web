import { Card } from "@/components/ui/card";

import { ArrowUp, ArrowDown } from "lucide-react";

export default function SunriseSunsetWidget() {
    return (
        <Card className="w-48 h-48 p-4 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground">Sunrise & Sunset</p>

            <div className="flex items-center gap-3">
                <div className="bg-yellow-300/80 text-white p-1.5 rounded-full">
                    <ArrowUp className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-md font-medium">6:35 AM</p>
                    <p className="text-xs text-muted-foreground">−1m 46s</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-yellow-300/80 text-white p-1.5 rounded-full">
                    <ArrowDown className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-md font-medium">5:42 PM</p>
                    <p className="text-xs text-muted-foreground">+2m 22s</p>
                </div>
            </div>
        </Card>
    );
}
