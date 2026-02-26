import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-6">MedWaste</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/">Dashboard</Link>
        <Link to="/containers">Containers</Link>
        <Link to="/alerts">Alerts</Link>
        <Link to="/map">Map</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/driver-registration">Drivers</Link>
        <Link to="/routes-history">Route History</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}