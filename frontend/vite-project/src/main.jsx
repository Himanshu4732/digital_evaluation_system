import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminContext from "./context/AdminContext.jsx";
import TeacherContext from "./context/TeacherContext.jsx";
import StudentContext from "./context/StudentContext.jsx";

createRoot(document.getElementById("root")).render(
  <AdminContext>
    <TeacherContext>
      <StudentContext>
        <App />
      </StudentContext>
    </TeacherContext>
  </AdminContext>
);
