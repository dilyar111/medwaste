import React from "react";

import { useEffect, useState } from "react";
import { getContainers } from "../services/api";
import ContainerCard from "../components/ContainerCard";

export default function Dashboard() {
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    getContainers().then((res) => setContainers(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {containers.map((c) => (
          <ContainerCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}