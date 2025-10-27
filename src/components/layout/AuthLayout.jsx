import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks.js";
import { selectIsAuthenticated } from "../../features/auth/authSlice.js";
import BrandMark from "./BrandMark.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

function AuthLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cohortStats = [
    { value: "92%", label: "Offer conversion", hint: "within 45 days of course completion" },
    { value: "38", label: "Active mentors", hint: "across product & engineering" },
    { value: "12k+", label: "Live sessions", hint: "hosted in the past 18 months" },
  ];

  const spotlight = {
    quote:
      "I landed a product engineer role in three months. The weekly accountability pods kept me laser-focused without burning out.",
    name: "Akanksha Patel",
    role: "Geekskul Cohort Spring ’25",
  };

  const timelineSteps = [
    {
      title: "Application review",
      copy: "Admissions coaches assess your goals and readiness within 24 hours of submission.",
    },
    {
      title: "Mentor connect",
      copy: "Hop on a 20-minute discovery call to align outcomes and confirm your track fit.",
    },
    {
      title: "Starter sprint",
      copy: "Receive a curated pre-work bundle so you arrive on day one with momentum.",
    },
    {
      title: "Cohort kickoff",
      copy: "Meet your pod, unlock the learning workspace, and ship your first build in week one.",
    },
  ];

  const communityHighlights = [
    {
      emoji: "🌍",
      title: "Global cohort mix",
      copy: "Learners dial in from 18 countries, pairing across time zones for live collaboration.",
    },
    {
      emoji: "🛠️",
      title: "Build-first projects",
      copy: "Ship production-ready apps with CI/CD, observability, and stakeholder walkthroughs.",
    },
    {
      emoji: "🤝",
      title: "Hiring guild",
      copy: "Partner companies run exclusive demo days every quarter with dedicated recruiter support.",
    },
  ];

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="ambient-gradient"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        position: "relative",
      }}
    >
      <div className="scene-layers" aria-hidden>
        <span
          style={{ background: "rgba(83,109,255,0.24)", width: 220, height: 220, top: "12%", left: "8%" }}
        />
        <span
          style={{ background: "rgba(14,165,233,0.18)", width: 180, height: 180, bottom: "15%", left: "24%" }}
        />
        <span
          style={{ background: "rgba(148,163,255,0.22)", width: 260, height: 260, top: "18%", right: "16%" }}
        />
      </div>

      <div className="auth-hero fade-in">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BrandMark size={52} />
          <ThemeToggle />
        </div>

        <div style={{ maxWidth: 460 }}>
          <h1
            style={{
              fontSize: "var(--text-4xl)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              marginBottom: "var(--space-4)",
            }}
          >
            Level up your learning journey.
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--text-tertiary)" }}>
            Join live mentorship, track progress across cohorts, and access on-demand content tailored for modern engineers.
          </p>
        </div>

        <div className="stack fade-in-delayed" style={{ gap: "var(--space-3)", maxWidth: 440 }}>
          {[
            {
              title: "Live mentor access",
              copy: "Hop into guided sessions with industry mentors and get real-time feedback on projects.",
            },
            {
              title: "Momentum streaks",
              copy: "Earn boosts for consistent attendance and unlock premium recordings and labs.",
            },
            {
              title: "Adaptive tracks",
              copy: "Personalised module sequencing keeps you focused on the skills that matter most.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card"
              style={{
                padding: "var(--space-4)",
                background: "rgba(255,255,255,0.35)",
                borderColor: "rgba(148,163,184,0.28)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "var(--space-2)" }}>{item.title}</div>
              <p style={{ margin: 0, color: "var(--text-tertiary)" }}>{item.copy}</p>
            </div>
          ))}
        </div>

        <div className="auth-stats-grid fade-in-delayed">
          {cohortStats.map((stat) => (
            <div key={stat.label} className="auth-stat-card glass-card">
              <div className="auth-stat-value">{stat.value}</div>
              <div className="auth-stat-label">{stat.label}</div>
              <div className="auth-stat-hint">{stat.hint}</div>
            </div>
          ))}
        </div>

        <div className="auth-testimonial glass-card fade-in-delayed">
          <div className="auth-testimonial-quote">{spotlight.quote}</div>
          <div className="auth-testimonial-meta">
            <span>{spotlight.name}</span>
            <span>{spotlight.role}</span>
          </div>
        </div>

        <div className="auth-timeline glass-card fade-in-delayed">
          <div className="auth-section-title">What happens after you apply</div>
          <ol className="auth-timeline-list">
            {timelineSteps.map((step) => (
              <li key={step.title} className="auth-timeline-step">
                <div className="auth-timeline-step-title">{step.title}</div>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="auth-highlights-grid fade-in-delayed">
          {communityHighlights.map((item) => (
            <div key={item.title} className="auth-highlight-card glass-card">
              <div className="auth-highlight-emoji" aria-hidden>
                {item.emoji}
              </div>
              <div className="auth-highlight-title">{item.title}</div>
              <p>{item.copy}</p>
            </div>
          ))}
        </div>

        <div style={{ opacity: 0.7, fontSize: "var(--text-xs)" }}>
          © {new Date().getFullYear()} Geekskul. Crafted for ambitious learners.
        </div>
      </div>

      <div className="auth-panel rise-in">
        <div className="glass-card" style={{ width: "100%", maxWidth: 440, padding: "var(--space-8)" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
