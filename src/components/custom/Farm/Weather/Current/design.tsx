/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PHKPslpckhU
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export default function Weather() {
    return (
        <div className="max-w-xl rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-medium">Asheville</h2>
                <SunIcon className="text-yellow-300 text-4xl" />
            </div>
            <div className="flex justify-between items-end mb-4">
                <div className="text-6xl font-light">
                    <span>47°</span>
                </div>
                <div className="text-right">
                    <p className="text-sm">Winter storm warning</p>
                </div>
            </div>
            <div className="grid grid-cols-6 gap-8">
                <div className="text-center">
                    <p className="text-sm mb-1">4PM</p>
                    <SunIcon className="text-yellow-300 mb-1" />
                    <p className="text-sm font-semibold">46°</p>
                </div>
                <div className="text-center">
                    <p className="text-sm mb-1">5PM</p>
                    <SunIcon className="text-yellow-300 mb-1" />
                    <p className="text-sm font-semibold">44°</p>
                </div>
                <div className="text-center">
                    <p className="text-sm mb-1">6PM</p>
                    <CloudyIcon className="text-yellow-300 mb-1" />
                    <p className="text-sm font-semibold">41°</p>
                </div>
                <div className="text-center">
                    <p className="text-sm mb-1">6:14</p>
                    <SunsetIcon className="text-yellow-500 mb-1" />
                    <p className="text-sm font-semibold">41°</p>
                </div>
                <div className="text-center">
                    <p className="text-sm mb-1">7PM</p>
                    <CloudIcon className="text-gray-300 mb-1" />
                    <p className="text-sm font-semibold">37°</p>
                </div>
                <div className="text-center">
                    <p className="text-sm mb-1">8PM</p>
                    <CloudIcon className="text-gray-300 mb-1" />
                    <p className="text-sm font-semibold">35°</p>
                </div>
            </div>
        </div>
    );
}

function CloudIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
    );
}

function CloudyIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            <path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" />
        </svg>
    );
}

function SunIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
}

function SunsetIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 10V2" />
            <path d="m4.93 10.93 1.41 1.41" />
            <path d="M2 18h2" />
            <path d="M20 18h2" />
            <path d="m19.07 10.93-1.41 1.41" />
            <path d="M22 22H2" />
            <path d="m16 6-4 4-4-4" />
            <path d="M16 18a4 4 0 0 0-8 0" />
        </svg>
    );
}
