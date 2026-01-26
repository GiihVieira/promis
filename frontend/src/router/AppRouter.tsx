import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
