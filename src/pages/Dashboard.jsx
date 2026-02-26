import React from "react";
import StatCard from "../components/StatCard";
import PredictionCard from "../components/PredictionCard";

function Dashboard() {
  const predictions = [
    "MED-001",
    "MED-002",
    "MED-003",
    "MED-004",
    "MED-005",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Monitoring Dashboard
          </h1>
          <p className="text-gray-500">
            Medical waste management with AI analytics
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-lg shadow">
            Refresh
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Notifications
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Bins"
          value="5"
          subtitle="Active in system"
        />
        <StatCard
          title="Average Fullness"
          value="51%"
          subtitle="For Month"
        />
        <StatCard
          title="Needs Attention"
          value="0"
          subtitle="Threshold exceeded"
        />
        <StatCard
          title="AI Efficiency"
          value="92%"
          subtitle="Prediction accuracy"
        />
      </div>

      {/* ANALYTICS BLOCK */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">
          Analytics Metrics
        </h2>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-gray-500 text-sm">
              Сборов за месяц
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-gray-500 text-sm">
              Эффективность
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">4ч</p>
            <p className="text-gray-500 text-sm">
              Среднее время отклика
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">15%</p>
            <p className="text-gray-500 text-sm">
              Экономия затрат
            </p>
          </div>
        </div>
      </div>

      {/* AI PREDICTIONS */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          AI Maintenance Predictions
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {predictions.map((id) => (
            <PredictionCard key={id} id={id} />
          ))}
        </div>
      </div>

      {/* SYSTEM METRICS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">
          System Metrics
        </h2>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-gray-500 text-sm">Активные</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-gray-500 text-sm">На обслуживании</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-gray-500 text-sm">Офлайн</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-gray-500 text-sm">Выведены</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;