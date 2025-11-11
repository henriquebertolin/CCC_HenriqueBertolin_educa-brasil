import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home/Home";
import ProtectedRoute from "../components/ProtectedRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* público */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protegido */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* redirecionamento padrão */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
