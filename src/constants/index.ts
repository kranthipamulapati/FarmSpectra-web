import {
    Plus,
    Trees,
    Settings,
    LayoutDashboard,
    SlidersHorizontal,
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
        title: "AddFarm",
        url: "/home/addfarm",
        icon: Plus,
    },
    {
        title: "Settings",
        url: "/home/settings",
        icon: Settings,
    },
    {
        title: "2D Compare",
        url: "/home/comparemap",
        icon: SlidersHorizontal,
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
        title: "AddFarm",
        url: "/admin/home/addfarm",
        icon: Plus,
    },
    {
        title: "Settings",
        url: "/admin/home/settings",
        icon: Settings,
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
