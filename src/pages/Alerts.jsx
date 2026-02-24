import React from "react";

import { useEffect, useState } from "react";
import { getAlerts } from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then((res) => setAlerts(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>
      <ul className="bg-white rounded shadow p-4">
        {alerts.map((a) => (
          <li key={a.id} className="border-b py-2">
            Container {a.containerId} — {a.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
