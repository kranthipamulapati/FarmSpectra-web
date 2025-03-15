import { memo, useState, useEffect } from "react";

import { Outlet, Navigate } from "react-router";

import { supabase } from "@/services";

type Props = {
    role: "user" | "admin";
};

const AuthCheck = ({ role }: Props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {}, []);

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace={true} />;
    }

    return <Outlet />;
};

export default memo(AuthCheck);
