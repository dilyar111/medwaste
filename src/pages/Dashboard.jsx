// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import PredictionCard from "../components/PredictionCard";

function Dashboard() {
  const predictions = ["MED-001", "MED-002", "MED-003", "MED-004", "MED-005"];
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("mw_logged_in");
    sessionStorage.removeItem("mw_user");
    window.location.href = "/login.html";
  };

  useEffect(() => {
    const email = sessionStorage.getItem("mw_user");
    if (email) {
      setUser(email);
    }
  }, []);

  if (!user) return null; // blank while checking auth

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-gray-500">Medical waste management with AI analytics</p>
        </div>

        <div className="flex gap-3 items-center">

          {/* User badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow text-sm">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              {user.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-600">{user}</span>
          </div>

          <button className="bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition-colors text-sm">
            Refresh
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
            Notifications
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bins"       value="5"   subtitle="Active in system"   />
        <StatCard title="Average Fullness" value="51%" subtitle="This month"          />
        <StatCard title="Needs Attention"  value="0"   subtitle="Threshold exceeded"  />
        <StatCard title="AI Efficiency"    value="92%" subtitle="Prediction accuracy" />
      </div>

      {/* ANALYTICS BLOCK */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Analytics Metrics</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-gray-500 text-sm">Collections this month</p>
          </div>
          <div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-gray-500 text-sm">Efficiency</p>
          </div>
          <div>
            <p className="text-2xl font-bold">4h</p>
            <p className="text-gray-500 text-sm">Avg. response time</p>
          </div>
          <div>
            <p className="text-2xl font-bold">15%</p>
            <p className="text-gray-500 text-sm">Cost savings</p>
          </div>
        </div>
      </div>

      {/* AI PREDICTIONS */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">AI Maintenance Predictions</h2>
        <div className="grid grid-cols-3 gap-4">
          {predictions.map((id) => (
            <PredictionCard key={id} id={id} />
          ))}
        </div>
      </div>

      {/* SYSTEM METRICS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">System Metrics</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-gray-500 text-sm">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-gray-500 text-sm">Under maintenance</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-gray-500 text-sm">Offline</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-gray-500 text-sm">Decommissioned</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;