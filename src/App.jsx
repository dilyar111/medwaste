import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Импорты компонентов
import PrivateRoute from "./components/Privateroute";
import Layout from "./components/Layout"; 

// Импорты страниц
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import MapPage from "./pages/MapPage";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import DriverRegistration from "./pages/DriverRegistration";
import RouteHistory from "./pages/RouteHistory";
import Profile from "./pages/Profile";

function App() {
  // Достаем статус авторизации прямо здесь
  const isLoggedIn = sessionStorage.getItem("mw_logged_in") === "true";

  return (
    <BrowserRouter>
      <Routes>
        {/* --- ПУБЛИЧНЫЕ РОУТЫ (Без Сайдбара) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ПРИВАТНЫЕ РОУТЫ (Внутри Layout с Сайдбаром) --- */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Все эти страницы отрендерятся внутри Outlet в Layout */}
          <Route index element={<Dashboard />} />
          <Route path="containers" element={<Containers />} />
          <Route path="map" element={<MapPage />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="driver-registration" element={<DriverRegistration />} />
          <Route path="routes-history" element={<RouteHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Если зашли не туда — кидаем на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;