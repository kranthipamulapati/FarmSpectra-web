import { Home, Settings } from "lucide-react";

const hyderabadGeoCenter = {
    lat: 17.4065,
    lng: 78.4772,
};

const userSideBarItems = [
    {
        title: "Dashboard",
        url: "/home/dashboard",
        icon: Home,
    },
    {
        title: "Farms",
        url: "/home/farms",
        icon: Home,
    },
    {
        title: "Settings",
        url: "/home/settings",
        icon: Settings,
    },
];

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export { apiBaseURL, userSideBarItems, hyderabadGeoCenter };
