import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import ProfileBasicForm from "../components/profile/ProfileBasicForm.jsx";
import ProfileLinksForm from "../components/profile/ProfileLinksForm.jsx";
import EducationForm from "../components/profile/EducationForm.jsx";
import PreferencesForm from "../components/profile/PreferencesForm.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import {
  fetchStudentProfile,
  selectProfileSnapshot,
  selectProfileAchievements,
  selectProfileUser,
  selectProfileIsLoading,
} from "../features/profile/profileSlice.js";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import "../components/profile/ProfileForms.css";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("basic");
  
  const authUser = useAppSelector(selectCurrentUser);
  const profileUser = useAppSelector(selectProfileUser);
  const isLoading = useAppSelector(selectProfileIsLoading);
  const snapshot = useAppSelector(selectProfileSnapshot);
  const achievements = useAppSelector(selectProfileAchievements);

  const user = profileUser || authUser;

  useEffect(() => {
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  const tabs = [
    { id: "basic", label: "👤 Personal Info", component: ProfileBasicForm },
    { id: "links", label: "🔗 Social Links", component: ProfileLinksForm },
    { id: "education", label: "🎓 Education", component: EducationForm },
    { id: "preferences", label: "⚙️ Preferences", component: PreferencesForm },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="stack fade-in" style={{ gap: "var(--space-6)", maxWidth: 1200 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 700 }}>Profile & Preferences</h2>
          <p style={{ color: "var(--text-tertiary)", margin: "var(--space-2) 0 0 0" }}>
            Update your profile, review progress, and control how we reach out to you.
          </p>
        </div>
        
        <Card>
          <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
            <div style={{
              fontSize: "var(--text-4xl)",
              marginBottom: "var(--space-4)",
              animation: "spin 1s linear infinite"
            }}>
              ⏳
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>
              Loading your profile...
            </p>
          </div>
        </Card>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="stack fade-in" style={{ gap: "var(--space-6)", maxWidth: 1200 }}>
      {/* Page Header */}
      <div>
        <h2 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 700 }}>Profile & Preferences</h2>
        <p style={{ color: "var(--text-tertiary)", margin: "var(--space-2) 0 0 0" }}>
          Update your profile, review progress, and control how we reach out to you.
        </p>
      </div>

      {/* Hero Card with User Info */}
      <Card className="rise-in">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)" }}>
          <div
            style={{
              height: 96,
              width: 96,
              borderRadius: "34px",
              background: "linear-gradient(135deg, #536dff, #0ea5e9)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontSize: "2.25rem",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {user?.name ? user.name[0] : "?"}
          </div>
          <div className="stack" style={{ gap: "var(--space-2)", flex: 1 }}>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{user?.name ?? "Student"}</div>
            <div style={{ color: "var(--text-tertiary)" }}>{user?.email ?? "email@geekskul.com"}</div>
            <StatusPill tone="success">Cohort {snapshot?.mentor ? "assigned" : "pending"}</StatusPill>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>{snapshot?.completion ?? 0}%</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Overall completion</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: "var(--space-2)" }}>
              Streak • {snapshot?.streak ?? 0} live sessions
            </div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          borderBottom: "2px solid var(--color-border)",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              padding: "var(--space-3) var(--space-4)",
              fontSize: "var(--text-sm)",
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? "var(--color-accent)" : "var(--text-secondary)",
              cursor: "pointer",
              borderBottom: activeTab === tab.id ? "3px solid var(--color-accent)" : "none",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forms Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }}>
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Achievements Section */}
      <Card className="slide-up">
        <h3 style={{ marginTop: 0, marginBottom: "var(--space-4)" }}>🏆 Achievements</h3>
        {achievements && achievements.length > 0 ? (
          <div className="stack" style={{ gap: "var(--space-3)" }}>
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="glass-card"
                style={{
                  padding: "var(--space-4)",
                  borderLeft: "4px solid var(--color-accent)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "var(--text-base)" }}>{achievement.name}</strong>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                    {achievement.earnedOn
                      ? new Date(achievement.earnedOn).toLocaleDateString("en-IN")
                      : "Recently"}
                  </span>
                </div>
                <p style={{ margin: "var(--space-2) 0 0", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "var(--text-tertiary)", textAlign: "center", padding: "var(--space-4)" }}>
            No achievements yet. Keep learning and growing! 🚀
          </div>
        )}
      </Card>
    </div>
  );
}

export default ProfilePage;
