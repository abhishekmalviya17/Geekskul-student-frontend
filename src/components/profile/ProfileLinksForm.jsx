import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import {
  updateProfileLinksData,
  selectProfileLinks,
  selectLinksUpdateStatus,
} from "../../features/profile/profileSlice.js";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import Toast from "../ui/Toast.jsx";
import "./ProfileForms.css";

export default function ProfileLinksForm() {
  const dispatch = useAppDispatch();
  const profileLinks = useAppSelector(selectProfileLinks);
  const updateStatus = useAppSelector(selectLinksUpdateStatus);
  
  const [isEditable, setIsEditable] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    linkedIn: "",
    leetCode: "",
    github: "",
    resumeUrl: "",
  });

  useEffect(() => {
    if (profileLinks) {
      setForm({
        linkedIn: profileLinks.linkedIn || "",
        leetCode: profileLinks.leetCode || "",
        github: profileLinks.github || "",
        resumeUrl: profileLinks.resumeUrl || "",
      });
    }
  }, [profileLinks]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    dispatch(updateProfileLinksData(form));
    setIsEditable(false);
  };

  return (
    <Card className="slide-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Social & Links</h3>
        {!isEditable && (
          <Button size="sm" variant="secondary" onClick={() => setIsEditable(true)}>
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="profile-form-grid">
          {/* First Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">
                <span style={{ fontSize: "1.2em", marginRight: "var(--space-2)" }}>💼</span>
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedIn"
                value={form.linkedIn}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span style={{ fontSize: "1.2em", marginRight: "var(--space-2)" }}>🔗</span>
                LeetCode Profile
              </label>
              <input
                type="url"
                name="leetCode"
                value={form.leetCode}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="https://leetcode.com/your-username"
              />
            </div>
          </div>

          {/* Second Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">
                <span style={{ fontSize: "1.2em", marginRight: "var(--space-2)" }}>🐙</span>
                GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                value={form.github}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="https://github.com/your-username"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span style={{ fontSize: "1.2em", marginRight: "var(--space-2)" }}>📄</span>
                Resume URL
              </label>
              <input
                type="url"
                name="resumeUrl"
                value={form.resumeUrl}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="https://drive.google.com/your-resume"
              />
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
