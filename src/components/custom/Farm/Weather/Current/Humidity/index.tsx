import { Card } from "@/components/ui/card";

export default function HumidityWidget() {
    const humidity = 12;
    const level = "Normal 👍🏼"; // This could be derived based on value

    // Dot position from bottom (in %)
    const dotPosition = `${100 - humidity}%`;

    return (
        <Card className="w-48 h-48 p-4 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground">Humidity</p>

            <div className="flex justify-between items-center">
                <div className="text-2xl font-semibold">{humidity}%</div>

                {/* Custom vertical slider */}

                <div className="relative w-2 h-10 bg-muted rounded-full">
                    <div
                        style={{ bottom: dotPosition }}
                        className="absolute left-0 right-0 mx-auto w-2 h-2 bg-blue-600 rounded-full"
                    />
                </div>
            </div>

            <p className="text-sm font-medium">{level}</p>
        </Card>
    );
}
