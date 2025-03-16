import { Trees, Settings, LayoutDashboard } from "lucide-react";

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
        title: "AddFarm",
        url: "/home/addfarm",
        icon: Trees,
    },
    {
        title: "Settings",
        url: "/home/settings",
        icon: Settings,
    },
];

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export {
    apiBaseURL,
    userSideBarItems,
    hyderabadGeoCenter,
    americanFarmsGeoCenter,
};
