import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import {
  updateBasicProfile,
  selectProfileBasic,
  selectBasicUpdateStatus,
} from "../../features/profile/profileSlice.js";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import Toast from "../ui/Toast.jsx";
import "./ProfileForms.css";

export default function ProfileBasicForm() {
  const dispatch = useAppDispatch();
  const basicProfile = useAppSelector(selectProfileBasic);
  const updateStatus = useAppSelector(selectBasicUpdateStatus);
  
  const [isEditable, setIsEditable] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    if (basicProfile) {
      setForm({
        firstName: basicProfile.firstName || "",
        lastName: basicProfile.lastName || "",
        mobileNumber: basicProfile.mobileNumber || "",
        email: basicProfile.email || "",
        dateOfBirth: basicProfile.dateOfBirth
          ? new Date(basicProfile.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: basicProfile.gender || "",
        address: basicProfile.address || "",
      });
    }
  }, [basicProfile]);

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
    dispatch(updateBasicProfile(form));
    setIsEditable(false);
  };

  return (
    <Card className="slide-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Personal Information</h3>
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
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Second Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Third Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={!isEditable}
                className={`form-input ${!isEditable ? "readonly" : ""}`}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address Row */}
          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditable}
              className={`form-input form-textarea ${!isEditable ? "readonly" : ""}`}
              placeholder="Enter your full address"
              rows="3"
              required
            />
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
