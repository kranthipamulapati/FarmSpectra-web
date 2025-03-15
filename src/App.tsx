import { memo, lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router";

import UserLogin from "@/routes/User/Login";

const UserHome = lazy(() => import("@/routes/User/Home"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* index page defaults to user authentication page */}
                    <Route path="/" element={<UserLogin />} index />

                    <Route path="/login" element={<UserLogin />} />

                    <Route path="/">
                        <Route path="/home" element={<UserHome />}></Route>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default memo(App);
