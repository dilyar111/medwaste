import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";

const mockRoutes = []; // сейчас 0 маршрутов

function RouteHistory() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            История Маршрутов
          </h1>
          <p className="text-gray-500">
            Просмотр и анализ завершенных маршрутов сбора
          </p>
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Обновить
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard title="Всего Маршрутов" value="0" />
        <KpiCard title="Завершено" value="0" />
        <KpiCard title="Общее Расстояние" value="0 km" />
        <KpiCard title="Собрано Контейнеров" value="0" />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">
            Период
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Статус
          </label>
          <select className="w-full border rounded-lg px-3 py-2 mt-1">
            <option>Все</option>
            <option>Завершен</option>
            <option>Отменен</option>
          </select>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* ROUTE LIST */}
        <div className="bg-white rounded-2xl shadow p-4 h-[600px] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">
            Маршруты ({mockRoutes.length})
          </h2>

          {mockRoutes.length === 0 ? (
            <div className="text-gray-400 text-center mt-20">
              Маршруты не найдены
            </div>
          ) : (
            mockRoutes.map((route) => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className="border p-3 rounded-xl mb-3 cursor-pointer hover:bg-gray-50"
              >
                <h3 className="font-semibold">
                  {route.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {route.distance} km
                </p>
              </div>
            ))
          )}
        </div>

        {/* MAP */}
        <div className="col-span-2 bg-white rounded-2xl shadow overflow-hidden h-[600px]">

          {!selectedRoute ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <h2 className="text-lg mb-2">
                Карта Маршрута
              </h2>
              <p>Выберите маршрут для просмотра</p>
              <p>Кликните на маршрут в списке слева</p>
            </div>
          ) : (
            <MapContainer
              center={selectedRoute.coordinates[0]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline
                positions={selectedRoute.coordinates}
              />

              {selectedRoute.coordinates.map((point, index) => (
                <Marker key={index} position={point}>
                  <Popup>Точка {index + 1}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

      </div>

    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm">
        {title}
      </p>
      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

export default RouteHistory;