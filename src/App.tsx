import { memo, lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router";

import AuthCheck from "@/components/custom/AuthCheck";

import UserLogin from "@/routes/User/Login";
const UserHome = lazy(() => import("@/routes/User/Home"));
const UserFarms = lazy(() => import("@/routes/User/Home/Farms"));
const UserAddFarm = lazy(() => import("@/routes/User/Home/AddFarm"));
const UserDashboard = lazy(() => import("@/routes/User/Home/Dashboard"));

const AdminLogin = lazy(() => import("@/routes/Admin/Login"));
const AdminHome = lazy(() => import("@/routes/Admin/Home"));
const AdminDashboard = lazy(() => import("@/routes/Admin/Home/Dashboard"));

const OrganizationLogin = lazy(() => import("@/routes/Organization/Login"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* user auth routes */}
                    <Route path="/" element={<UserLogin />} index />
                    <Route path="/login" element={<UserLogin />} />

                    {/* user routes */}
                    <Route path="/" element={<AuthCheck role="user" />}>
                        <Route path="/home" element={<UserHome />}>
                            <Route
                                path="/home/dashboard"
                                element={<UserDashboard />}
                            />
                            <Route path="/home/farms" element={<UserFarms />} />
                            <Route
                                path="/home/addFarm"
                                element={<UserAddFarm />}
                            />
                        </Route>
                    </Route>

                    {/* admin auth routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* admin routes */}
                    <Route path="/admin" element={<AuthCheck role="admin" />}>
                        <Route path="/admin/home" element={<AdminHome />}>
                            <Route
                                path="/admin/home/dashboard"
                                element={<AdminDashboard />}
                            />
                        </Route>
                    </Route>

                    {/* organization user login */}
                    <Route path="/:orgCode" element={<OrganizationLogin />} />
                    <Route
                        path="/:orgCode/login"
                        element={<OrganizationLogin />}
                    />

                    {/* organization routes */}
                    <Route
                        path="/:orgCode"
                        element={<AuthCheck role="user" />}
                    ></Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default memo(App);
