import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import MapPage from "./pages/MapPage";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import DriverRegistration from "./pages/DriverRegistration";
import RouteHistory from "./pages/RouteHistory";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/containers" element={<Containers />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/driver-registration" element={<DriverRegistration />} />
            <Route path="/routes-history" element={<RouteHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}