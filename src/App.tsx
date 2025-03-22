import { memo, lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router";

import UserLogin from "@/routes/User/Login";
import AuthCheck from "@/components/custom/AuthCheck";

const UserHome = lazy(() => import("@/routes/User/Home"));
const UserFarms = lazy(() => import("@/routes/User/Home/Farms"));
const AddFarm = lazy(() => import("@/routes/User/Home/AddFarm"));
const UserDashboard = lazy(() => import("@/routes/User/Home/Dashboard"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* index page defaults to user authentication page */}
                    <Route path="/" element={<UserLogin />} index />

                    <Route path="/login" element={<UserLogin />} />

                    <Route path="/" element={<AuthCheck role="user" />}>
                        <Route path="/home" element={<UserHome />}>
                            <Route
                                path="/home/dashboard"
                                element={<UserDashboard />}
                            />

                            <Route path="/home/farms" element={<UserFarms />} />
                            <Route path="/home/addFarm" element={<AddFarm />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default memo(App);
