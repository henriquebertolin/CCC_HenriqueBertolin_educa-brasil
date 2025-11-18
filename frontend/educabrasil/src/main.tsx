import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// main.tsx
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/form.css";
import "./styles/course.css";
import "./styles/header.css";
import "./styles/profile.css";
import "./styles/course-details.css";
import "./styles/create-course.css";
import "./styles/lessons.css";
import "./styles/create-lesson.css";
import "./styles/edit-lesson.css";
import "./styles/watch-lesson.css";
import "./styles/questions-page.css";
import "./styles/question-details.css"


import { AuthProvider } from "./contexts/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
