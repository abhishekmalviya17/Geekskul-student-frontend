import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { selectIsAuthenticated } from "../../features/auth/authSlice.js";
import {
  fetchStudentDashboard,
  selectDashboardState,
} from "../../features/student/studentSlice.js";
import SidebarNav from "./SidebarNav.jsx";
import AppHeader from "./AppHeader.jsx";

function AppLayout() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const dashboardState = useAppSelector(selectDashboardState);

  useEffect(() => {
    if (isAuthenticated && dashboardState.status === "idle") {
      dispatch(fetchStudentDashboard());
    }
  }, [dispatch, isAuthenticated, dashboardState.status]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="app-shell app-shell--immersive">
      <div className="app-aurora app-aurora--one" aria-hidden />
      <div className="app-aurora app-aurora--two" aria-hidden />
      <div className="app-aurora app-aurora--three" aria-hidden />
      <AppHeader />
      <div className="app-layout-grid">
        <aside className="app-sidebar">
          <SidebarNav />
        </aside>
        <main className="app-main" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
