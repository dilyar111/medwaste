import React from "react";

import { useEffect, useState } from "react";
import { getContainers } from "../services/api";

export default function Containers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getContainers().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Containers</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th>ID</th>
            <th>Fill %</th>
            <th>Temp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-b text-center">
              <td>{c.id}</td>
              <td>{c.fillLevel}</td>
              <td>{c.temperature}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}        