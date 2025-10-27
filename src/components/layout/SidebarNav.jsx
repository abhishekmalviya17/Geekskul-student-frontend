import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks.js";
import { selectCurrentUser } from "../../features/auth/authSlice.js";
import {
  selectDashboardData,
  selectDashboardState,
} from "../../features/student/studentSlice.js";

const navSections = [
  {
    label: "Core",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: "🏠", hint: "Pulse overview" },
      { to: "/courses", label: "Courses", icon: "📘", hint: "Track enrollments" },
      { to: "/lectures", label: "Lectures", icon: "🎥", hint: "Join live sessions" },
      { to: "/profile", label: "Profile", icon: "👤", hint: "Personalize account" },
    ],
  },
];

function SidebarNav() {
  const user = useAppSelector(selectCurrentUser);
  const dashboardState = useAppSelector(selectDashboardState);
  const dashboard = useAppSelector(selectDashboardData);

  const initials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase())
      .join("");
  }, [user?.name]);

  const progressMetrics = useMemo(() => {
    const batches = dashboard?.batches || [];
    const modules = batches.flatMap((batch) => batch.modules || []);
    const lectures = modules.flatMap((module) => module.lectures || []);
    const now = new Date();

    const totalLectures = lectures.length;
    const completedLectures = lectures.filter((lecture) => {
      if (!lecture?.endTime) return false;
      return new Date(lecture.endTime) < now;
    }).length;
    const upcomingLectures = lectures.filter((lecture) => {
      if (!lecture?.startTime) return false;
      return new Date(lecture.startTime) >= now;
    }).length;

    const completion = totalLectures
      ? Math.min(100, Math.round((completedLectures / totalLectures) * 100))
      : 0;

    return {
      completion,
      streakLabel:
        upcomingLectures > 0
          ? `${upcomingLectures} upcoming ` + (upcomingLectures === 1 ? "session" : "sessions")
          : dashboardState.status === "loading"
          ? "Loading progress…"
          : "No scheduled sessions",
    };
  }, [dashboard, dashboardState.status]);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel__glow" aria-hidden />
      <header className="sidebar-header">
        <div className="sidebar-avatar" aria-hidden>
          <span>{initials}</span>
          <span className="sidebar-avatar__pulse" />
        </div>
        <div className="sidebar-header__meta">
          <span className="sidebar-header__label">Logged in</span>
          <strong className="sidebar-header__name">{user?.name ?? "Student"}</strong>
          <span className="sidebar-header__hint">{user?.email ?? "cohort@geekskul.com"}</span>
        </div>
      </header>

      <section className="sidebar-progress">
        <div className="sidebar-progress__ring" aria-hidden>
          <svg viewBox="0 0 120 120">
            <circle className="progress-bg" cx="60" cy="60" r="52" />
            <circle
              className="progress-indicator"
              cx="60"
              cy="60"
              r="52"
              style={{
                strokeDashoffset: 326 - (326 * progressMetrics.completion) / 100,
              }}
            />
          </svg>
          <span className="sidebar-progress__value">{progressMetrics.completion}%</span>
        </div>
        <div className="sidebar-progress__meta">
          <p>Your cohort progress</p>
          <span>{progressMetrics.streakLabel}</span>
        </div>
      </section>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navSections.map((section) => (
          <div key={section.label} className="sidebar-group">
            <span className="sidebar-group__label">{section.label}</span>
            <div className="sidebar-group__links">
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? " sidebar-link--active" : ""}`
                  }
                >
                  <span className="sidebar-link__icon" aria-hidden>
                    {link.icon}
                  </span>
                  <span className="sidebar-link__content">
                    <span className="sidebar-link__label">{link.label}</span>
                    <span className="sidebar-link__hint">{link.hint}</span>
                  </span>
                  <span className="sidebar-link__pulse" aria-hidden />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <div className="sidebar-footer__card">
          <span className="sidebar-footer__title">Need help?</span>
          <p>Drop a note to mentors and we’ll get back instantly.</p>
          <NavLink to="/profile" className="sidebar-footer__cta">
            Open support desk
          </NavLink>
        </div>
      </footer>
    </div>
  );
}

export default SidebarNav;
