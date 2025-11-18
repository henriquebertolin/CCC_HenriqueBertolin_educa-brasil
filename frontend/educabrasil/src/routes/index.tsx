import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home/Home";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/ProtectedRoutes";
import CourseDetails from "../pages/Home/CourseDetails";
import CreateCourse from "../pages/Home/CreateCourse";
import ManageLessons from "../pages/Home/ManageLessons";
import CreateLesson from "../pages/Home/CreateLesson";
import EditLesson from "../pages/Home/EditLesson";
import WatchLesson from "../pages/Home/WatchLesson";
import QuestionsPage from "../pages/Home/QuestionsPage";
import QuestionDetails from "../pages/Home/QuestionDetails";
import NewQuestion from "../pages/Home/NewQuestion";




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

      <Route
        path="/course/:courseId/lessons/:lessonId/edit"
        element={
          <ProtectedRoute>
            <EditLesson />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:courseId/lessons/:lessonId/watch"
        element={
          <ProtectedRoute>
            <WatchLesson />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:courseId/questions"
        element={
          <ProtectedRoute>
            <QuestionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:courseId/questions/:questionId"
        element={
          <ProtectedRoute>
            <QuestionDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:courseId/questions/new"
        element={
          <ProtectedRoute>
            <NewQuestion />
          </ProtectedRoute>
        }
      />


      <Route
        path="/course/:id/lessons/new"
        element={
          <ProtectedRoute>
            <CreateLesson />
          </ProtectedRoute>
        }
      />




      {/* redirecionamento padrão */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
