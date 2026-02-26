import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

const bins = [
  {
    id: "MED-004",
    status: "active",
    fullness: 78,
    lat: 51.1694,
    lng: 71.4491,
  },
  {
    id: "MED-001",
    status: "active",
    fullness: 60,
    lat: 51.0912,
    lng: 71.4172,
  },
  {
    id: "MED-003",
    status: "active",
    fullness: 45,
    lat: 51.1011,
    lng: 71.4276,
  },
  {
    id: "MED-005",
    status: "active",
    fullness: 40,
    lat: 51.1010,
    lng: 71.4276,
  },
  {
    id: "MED-002",
    status: "active",
    fullness: 33,
    lat: 51.1605,
    lng: 71.4704,
  },
];

// фикс иконки для Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Карта Контейнеров
          </h1>
          <p className="text-gray-500">
            Интерактивная карта расположения всех контейнеров
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-lg shadow">
            Фильтры ↓
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Обновить
          </button>
        </div>
      </div>

      {/* MAP + SIDEBAR */}
      <div className="grid grid-cols-4 gap-6">

        {/* MAP */}
        <div className="col-span-3 bg-white rounded-2xl shadow overflow-hidden">
          <MapContainer
            center={[51.1694, 71.4491]}
            zoom={12}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {bins.map((bin) => (
              <Marker
                key={bin.id}
                position={[bin.lat, bin.lng]}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">
                      {bin.id}
                    </h3>
                    <p>Status: {bin.status}</p>
                    <p>Fullness: {bin.fullness}%</p>
                    <p>
                      {bin.lat}, {bin.lng}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* SIDEBAR */}
        <div className="bg-white rounded-2xl shadow p-4 overflow-y-auto h-[600px]">
          <h2 className="text-lg font-bold mb-4">
            Контейнеры
          </h2>

          {bins.map((bin) => (
            <div
              key={bin.id}
              className="border rounded-xl p-3 mb-3"
            >
              <h3 className="font-bold">
                {bin.id}
              </h3>
              <p className="text-sm text-green-600">
                {bin.status}
              </p>
              <p className="text-sm text-gray-500">
                Auto Registered
              </p>
              <p className="text-sm">
                {bin.fullness}%
              </p>
              <p className="text-xs text-gray-400">
                {bin.lat}, {bin.lng}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MapPage;