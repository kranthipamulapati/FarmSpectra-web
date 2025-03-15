import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { APIProvider as GoogleMapsAPIProvider } from "@vis.gl/react-google-maps";

import App from "./App.tsx";

import store from "./store";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <GoogleMapsAPIProvider
                region="IN"
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            >
                <App />
                <ToastContainer />
            </GoogleMapsAPIProvider>
        </Provider>
    </StrictMode>
);
