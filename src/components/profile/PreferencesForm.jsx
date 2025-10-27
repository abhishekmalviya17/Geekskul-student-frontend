import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import {
  updateProfilePreferencesData,
  selectProfilePreferences,
  selectPreferencesUpdateStatus,
} from "../../features/profile/profileSlice.js";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import Toast from "../ui/Toast.jsx";
import "./ProfileForms.css";

export default function PreferencesForm() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(selectProfilePreferences);
  const updateStatus = useAppSelector(selectPreferencesUpdateStatus);
  
  const [isEditable, setIsEditable] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    timezone: "Asia/Kolkata",
    communication: "slack",
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
  });

  useEffect(() => {
    if (preferences) {
      setForm({
        timezone: preferences.timezone || "Asia/Kolkata",
        communication: preferences.communication || "slack",
        notifications: preferences.notifications || {
          email: true,
          sms: false,
          inApp: true,
        },
      });
    }
  }, [preferences]);

  useEffect(() => {
    if (updateStatus.state === "succeeded") {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleNotificationChange = (channel) => {
    setForm((f) => ({
      ...f,
      notifications: {
        ...f.notifications,
        [channel]: !f.notifications[channel],
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    dispatch(updateProfilePreferencesData(form));
    setIsEditable(false);
  };

  return (
    <Card className="slide-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Preferences</h3>
        {!isEditable && (
          <Button size="sm" variant="secondary" onClick={() => setIsEditable(true)}>
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="profile-form-grid">
          {/* Timezone & Communication */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Communication</label>
              <select
                name="communication"
                value={form.communication}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
              >
                <option value="slack">Slack</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="form-group">
            <label className="form-label">Notification Channels</label>
            <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
              {["email", "sms", "inApp"].map((channel) => (
                <label key={channel} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: isEditable ? "pointer" : "not-allowed", opacity: isEditable ? 1 : 0.6 }}>
                  <input
                    type="checkbox"
                    checked={form.notifications[channel] || false}
                    onChange={() => isEditable && handleNotificationChange(channel)}
                    disabled={!isEditable}
                    style={{ width: 20, height: 20, cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: 500, textTransform: "uppercase", fontSize: "var(--text-sm)" }}>
                    {channel === "inApp" ? "In-App" : channel}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {isEditable && (
          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditable(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateStatus.state === "loading"}
            >
              {updateStatus.state === "loading" ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        {updateStatus.state === "failed" && (
          <div style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3)",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#991b1b",
            fontSize: "var(--text-sm)"
          }}>
            ⚠️ {updateStatus.error}
          </div>
        )}
      </form>

      {showToast && (
        <Toast
          variant="success"
          message={updateStatus.message}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </Card>
  );
}
