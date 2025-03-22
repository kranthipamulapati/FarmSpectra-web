import { memo, useState, useEffect } from "react";

import { Outlet, Navigate } from "react-router";

import { pocketbase } from "@/services";

type Props = {
    role: "user" | "admin";
};

const AuthCheck = ({ role }: Props) => {
    const [isAdmin, setIsAdmin] = useState(pocketbase.authStore.isSuperuser);
    const [isAuthenticated, setIsAuthenticated] = useState(
        pocketbase.authStore.isValid
    );

    useEffect(() => {
        pocketbase.authStore.onChange(() => {
            setIsAdmin(pocketbase.authStore.isSuperuser);
            setIsAuthenticated(pocketbase.authStore.isValid);
        }, true);
    }, []);

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace={true} />;
    }

    if (role === "admin" && isAdmin === false) {
        return <Navigate to="/login" replace={true} />;
    }

    if (role === "user" && isAdmin === true) {
        return <Navigate to="/admin/login" replace={true} />;
    }

    return <Outlet />;
};

export default memo(AuthCheck);
