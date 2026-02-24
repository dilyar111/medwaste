import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/containers" element={<Containers />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}