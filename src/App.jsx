import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import AuthLayout from "./components/layout/AuthLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseModulesPage from "./pages/CourseModulesPage.jsx";
import LecturesPage from "./pages/LecturesPage.jsx";
import AttendLecturePage from "./pages/AttendLecturePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId/modules" element={<CourseModulesPage />} />
        <Route path="/lectures" element={<LecturesPage />} />
        <Route path="/lectures/:lectureId" element={<AttendLecturePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
