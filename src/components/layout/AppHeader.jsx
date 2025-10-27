import React from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import Button from "../ui/Button.jsx";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { logout, selectCurrentUser } from "../../features/auth/authSlice.js";
import ThemeToggle from "./ThemeToggle.jsx";
import StatusPill from "../ui/StatusPill.jsx";

function AppHeader() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("geekskul_student_token");
      window.localStorage.removeItem("geekskul_student_refresh_token");
    }
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header glass-card">
      <div className="app-header__brand">
        <BrandMark size={44} />
        <div className="app-header__headline">
          <span className="app-header__welcome">Welcome back</span>
          <strong className="app-header__title">
            {user?.name ? `${user.name.split(" ")[0]}, your cohort is waiting` : "Let’s get learning"}
          </strong>
        </div>
      </div>

      <div className="app-header__center">
        <div className="app-header__glow" aria-hidden />
        <div className="app-header__ticker">
          <StatusPill tone="info">Live now</StatusPill>
          <span className="app-header__ticker-text">Mentor lounge open · Career AMA at 7:30 PM</span>
        </div>
        <div className="app-header__search">
          <span aria-hidden>🔍</span>
          <input type="search" placeholder="Search lectures, mentors, modules" aria-label="Search" />
        </div>
      </div>

      <div className="app-header__actions">
        <ThemeToggle condensed />
        <button type="button" className="icon-button" aria-label="Notifications">
          <span aria-hidden>🔔</span>
          <span className="icon-button__pulse" />
        </button>
        <div className="app-header__profile" role="presentation">
          <div className="app-header__avatar" aria-hidden>
            {user?.name ? user.name[0] : "?"}
          </div>
          <div className="app-header__meta">
            <span>{user?.email ?? "student@geekskul.com"}</span>
            <button type="button" onClick={handleLogout} className="link-button">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
