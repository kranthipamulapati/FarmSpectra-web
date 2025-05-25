import {
    Play,
    Trees,
    CirclePlus,
    ArrowLeftRight,
    LayoutDashboard,
} from "lucide-react";

const hyderabadGeoCenter = {
    lat: 17.4065,
    lng: 78.4772,
};

const americanFarmsGeoCenter = {
    lat: 33.03580236337875,
    lng: -102.35213882988563,
};

const userSideBarItems = [
    {
        title: "Dashboard",
        url: "/home/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Farms",
        url: "/home/farms",
        icon: Trees,
    },
    {
        title: "Add Farm",
        url: "/home/addFarm",
        icon: CirclePlus,
    },
    {
        title: "2D Compare",
        url: "/home/compare2D",
        icon: ArrowLeftRight,
    },
    {
        title: "Time Series",
        url: "/home/timeSeries",
        icon: Play,
    },
];

const adminSideBarItems = [
    {
        title: "Dashboard",
        url: "/admin/home/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Farms",
        url: "/admin/home/farms",
        icon: Trees,
    },
    {
        title: "Add Farm",
        url: "/admin/home/addFarm",
        icon: CirclePlus,
    },
];

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
const openWeatherMapApiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export {
    apiBaseURL,
    userSideBarItems,
    adminSideBarItems,
    hyderabadGeoCenter,
    openWeatherMapApiKey,
    americanFarmsGeoCenter,
};
