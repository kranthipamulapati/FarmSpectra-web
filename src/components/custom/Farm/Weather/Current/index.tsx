import UVIndexWidget from "./UIIndex";
import WindStatusWidget from "./Wind";
import HumidityWidget from "./Humidity";
import SunriseSunsetWidget from "./SunriseSunset";

export default function Weather() {
    return (
        <>
            <div>
                <UVIndexWidget />
            </div>

            <div>
                <WindStatusWidget />
            </div>

            <div>
                <HumidityWidget />
            </div>

            <div>
                <SunriseSunsetWidget />
            </div>
        </>
    );
}
