import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home/Home";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/ProtectedRoutes";
import CourseDetails from "../pages/Home/CourseDetails";
import CreateCourse from "../pages/Home/CreateCourse";
import ManageLessons from "../pages/Home/ManageLessons";



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

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/new"
        element={
          <ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id/lessons"
        element={
          <ProtectedRoute>
            <ManageLessons />
          </ProtectedRoute>
        }
      />



      {/* redirecionamento padrão */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
