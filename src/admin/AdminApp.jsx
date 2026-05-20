import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";
import "../styles/admin-polish.css";

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("legal-advisor-admin-token"));

  return (
    <Routes>
      <Route
        index
        element={token ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={setToken} />}
      />
      <Route
        path="dashboard"
        element={token ? <AdminDashboard onLogout={() => setToken(null)} /> : <Navigate to="/admin" replace />}
      />
    </Routes>
  );
}
