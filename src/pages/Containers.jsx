import React, { useState } from "react";

const mockBins = [
  {
    id: "MED-004",
    status: "Активен",
    fullness: 78,
    temperature: 22.0,
    weight: 0,
    date: "9 нояб. 2025 г.",
    type: "Острые",
  },
  {
    id: "MED-001",
    status: "Активен",
    fullness: 60,
    temperature: 22.0,
    weight: 0,
    date: "4 февр. 2026 г.",
    type: "Острые",
  },
  {
    id: "MED-003",
    status: "Активен",
    fullness: 45,
    temperature: 22.0,
    weight: 0,
    date: "5 д. назад",
    type: "Острые",
  },
  {
    id: "MED-005",
    status: "Активен",
    fullness: 40,
    temperature: 22.0,
    weight: 0,
    date: "8 янв. 2026 г.",
    type: "Острые",
  },
  {
    id: "MED-002",
    status: "Активен",
    fullness: 33,
    temperature: 22.0,
    weight: 0,
    date: "4 д. назад",
    type: "Острые",
  },
];

function Containers() {
  const [sortType, setSortType] = useState("fullness");

  const sortedBins = [...mockBins].sort((a, b) => {
    if (sortType === "fullness") return b.fullness - a.fullness;
    if (sortType === "id") return a.id.localeCompare(b.id);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bins</h1>
          <p className="text-gray-500">
            Manage and monitor medical waste bins
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-lg shadow">
            Filters ↓
          </button>

          <button className="bg-white px-4 py-2 rounded-lg shadow">
            Refresh
          </button>
        </div>
      </div>

      {/* SORT */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm mr-2">Sort:</label>
          <select
            className="px-3 py-1 rounded-lg border"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="fullness">By Fullness</option>
            <option value="id">By ID</option>
          </select>
        </div>

        <p className="text-gray-500 text-sm">
          Shown {sortedBins.length} of {mockBins.length}
        </p>
      </div>

      {/* BINS GRID */}
      <div className="grid grid-cols-3 gap-5">
        {sortedBins.map((bin) => (
          <div
            key={bin.id}
            className="bg-white rounded-2xl shadow p-5"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">{bin.id}</h2>
              <span className="text-green-600 text-sm font-medium">
                {bin.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Auto Registered
            </p>

            {/* FULLNESS */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Заполненность</span>
                <span>{bin.fullness}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${bin.fullness}%` }}
                ></div>
              </div>
            </div>

            {/* INFO */}
            <div className="text-sm space-y-1 text-gray-600">
              <p>Темп. {bin.temperature}°C</p>
              <p>Вес {bin.weight} кг</p>
              <p>{bin.date}</p>
              <p className="font-medium">{bin.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Containers;