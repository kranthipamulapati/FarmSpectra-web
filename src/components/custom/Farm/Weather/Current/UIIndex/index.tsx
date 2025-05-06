import { Card } from "@/components/ui/card";

export default function UVIndexWidget() {
    const value = 5;
    const max = 12;
    const percentage = (value / max) * 100;

    return (
        <Card className="w-48 h-48 flex flex-col justify-center items-center p-4">
            <p className="text-sm text-muted-foreground">UV Index</p>
            <div className="relative w-32 h-20 mt-2">
                {/* Background arc */}
                <svg viewBox="0 0 100 50" className="absolute w-full h-full">
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                    />
                </svg>

                {/* Foreground arc (progress) */}
                <svg viewBox="0 0 100 50" className="absolute w-full h-full">
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="100"
                        strokeDashoffset={100 - percentage}
                    />
                </svg>

                {/* Value */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-3xl font-semibold">
                    {value}
                </div>

                {/* Arc Labels */}
                <div className="absolute w-full h-full top-0 left-0 text-xs text-muted-foreground font-medium">
                    <div className="absolute left-[10%] bottom-[0%]">6</div>
                    <div className="absolute left-[45%] top-0">9</div>
                    <div className="absolute right-[10%] bottom-[0%]">12</div>
                </div>
            </div>
        </Card>
    );
}
