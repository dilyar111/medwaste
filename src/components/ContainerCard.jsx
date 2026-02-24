import React from "react";

export default function ContainerCard({ container }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h3 className="text-lg font-semibold">
        Container #{container.id}
      </h3>

      <p>Fill Level: {container.fillLevel}%</p>
      <p>Temperature: {container.temperature}°C</p>

      <span
        className={`px-2 py-1 rounded text-sm ${
          container.status === "OK"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {container.status}
      </span>
    </div>
  );
}