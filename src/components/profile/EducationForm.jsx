import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import {
  updateEducationProfile,
  selectProfileEducation,
  selectEducationUpdateStatus,
} from "../../features/profile/profileSlice.js";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import Toast from "../ui/Toast.jsx";
import "./ProfileForms.css";

export default function EducationForm() {
  const dispatch = useAppDispatch();
  const education = useAppSelector(selectProfileEducation);
  const updateStatus = useAppSelector(selectEducationUpdateStatus);

  const [isEditable, setIsEditable] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    highestDegree: "Bachelor's",
    schoolName: "",
    collegeName: "",
    yearOfGraduation: new Date().getFullYear(),
    fieldOfStudy: "",
    skills: [],
    certifications: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  useEffect(() => {
    if (education) {
      setForm({
        highestDegree: education.highestDegree || "Bachelor's",
        schoolName: education.schoolName || "",
        collegeName: education.collegeName || "",
        yearOfGraduation: education.yearOfGraduation || new Date().getFullYear(),
        fieldOfStudy: education.fieldOfStudy || "",
        skills: education.skills || [],
        certifications: education.certifications || [],
      });
    }
  }, [education]);

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

  const addSkill = () => {
    if (skillInput.trim()) {
      setForm((f) => ({
        ...f,
        skills: [...f.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (certInput.trim()) {
      setForm((f) => ({
        ...f,
        certifications: [...f.certifications, certInput.trim()],
      }));
      setCertInput("");
    }
  };

  const removeCertification = (index) => {
    setForm((f) => ({
      ...f,
      certifications: f.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    dispatch(updateEducationProfile(form));
    setIsEditable(false);
  };

  return (
    <Card className="slide-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Education</h3>
        {!isEditable && (
          <Button size="sm" variant="secondary" onClick={() => setIsEditable(true)}>
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="profile-form-grid">
          {/* Degree and Institution */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">Highest Degree</label>
              <select
                name="highestDegree"
                value={form.highestDegree}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
              >
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year of Graduation</label>
              <input
                type="number"
                name="yearOfGraduation"
                value={form.yearOfGraduation}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                min="1950"
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          {/* School and College */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">School Name</label>
              <input
                type="text"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="e.g., Saint Paul's School"
              />
            </div>
            <div className="form-group">
              <label className="form-label">College/University Name</label>
              <input
                type="text"
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="e.g., Indian Institute of Technology"
              />
            </div>
          </div>

          {/* Field of Study */}
          <div className="form-group">
            <label className="form-label">Field of Study</label>
            <input
              type="text"
              name="fieldOfStudy"
              value={form.fieldOfStudy}
              onChange={handleChange}
              disabled={!isEditable}
              className={`form-input ${!isEditable ? "readonly" : ""}`}
              placeholder="e.g., Computer Science & Engineering"
            />
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">Skills</label>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="Add a skill..."
                style={{ flex: 1 }}
              />
              {isEditable && (
                <Button
                  type="button"
                  onClick={addSkill}
                  variant="secondary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Add
                </Button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {form.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "var(--color-accent-light)",
                    color: "var(--color-accent-dark)",
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  {skill}
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "var(--text-lg)",
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="form-group">
            <label className="form-label">Certifications</label>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="Add a certification..."
                style={{ flex: 1 }}
              />
              {isEditable && (
                <Button
                  type="button"
                  onClick={addCertification}
                  variant="secondary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Add
                </Button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {form.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "var(--color-success-light)",
                    color: "var(--color-success-dark)",
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  {cert}
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => removeCertification(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "var(--text-lg)",
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
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
