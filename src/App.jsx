import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import RoutesHistory from "./pages/RouteHistory";
import Profile from "./pages/Profile";

// Импорты компонентов
import Layout from "./components/Layout"; 
import PrivateRoute from "./components/Privateroute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ПУБЛИЧНЫЕ СТРАНИЦЫ (Без сайдбара) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. ПРИВАТНЫЕ СТРАНИЦЫ (Внутри Layout с Сайдбаром) */}
        {/* Все пути ниже будут начинаться с /dashboard/ */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          {/* Это страница по умолчанию для /dashboard */}
          <Route index element={<Dashboard />} /> 
          
          {/* Эти страницы будут открываться по адресу /dashboard/containers и т.д. */}
          <Route path="containers" element={<Containers />} />
          <Route path="map" element={<MapPage />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="driver-registration" element={<DriverRegistration />} />
          <Route path="profile" element={<Profile />} />
          <Route path="routes-history" element={<RoutesHistory />} />
        </Route>

        {/* Редирект, если путь не найден */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;