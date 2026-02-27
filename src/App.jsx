import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/Privateroute";

import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import MapPage from "./pages/MapPage";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import DriverRegistration from "./pages/DriverRegistration";
import RouteHistory from "./pages/RouteHistory";
import Profile from "./pages/Profile";

function App() {
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


function AppLog() {
  const isLoggedIn = sessionStorage.getItem("mw_logged_in") === "true";

  return (
    <BrowserRouter>
      <Routes>

        {/* Root: send logged-in users to dashboard, others to login.html */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login.html" replace />   // HTML page outside React
          }
        />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Add more protected routes the same way */}
        {/* <Route path="/bins" element={<PrivateRoute><Bins /></PrivateRoute>} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default AppLog;