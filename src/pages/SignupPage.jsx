import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import InputField from "../components/ui/InputField.jsx";
import SelectField from "../components/ui/SelectField.jsx";
import { signupStudent } from "../services/authService.js";
import { fetchCourses } from "../services/courseService.js";

function SignupPage() {
  const navigate = useNavigate();

  const initialFormState = useMemo(() => ({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    course: "",
    referralCode: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    studyMode: "",
    termsAccepted: false,
  }), []);

  const [formData, setFormData] = useState(() => ({ ...initialFormState }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadCourses = async () => {
      try {
        setCoursesError(null);
        setCoursesLoading(true);
        const data = await fetchCourses();
        if (cancelled) return;
        const formatted = Array.isArray(data)
          ? data
              .filter((course) => !course.disabled)
              .map((course) => ({ value: course._id, label: course.title }))
          : [];
        setCourses(formatted);
        if (formatted.length === 0) {
          setCoursesError("No cohorts are open for signup right now. Please check back soon.");
        }
      } catch (error) {
        if (cancelled) return;
        const message = error?.response?.data?.error || "We couldn’t load the available tracks right now.";
        setCoursesError(message);
        setCourses([]);
      } finally {
        if (!cancelled) {
          setCoursesLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  const courseOptions = useMemo(() => courses, [courses]);

  const genderOptions = [
    { value: "Female", label: "Female" },
    { value: "Male", label: "Male" },
    { value: "Other", label: "Other" },
  ];

  const studyModes = [
    { value: "cohort", label: "Cohort (Weekday)" },
    { value: "weekend", label: "Weekend" },
    { value: "selfpaced", label: "Self-paced" },
  ];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = type === "checkbox" ? checked : value;

    if (type !== "checkbox") {
      if (name === "mobileNumber") {
        nextValue = value.replace(/\D/g, "").slice(0, 10);
      } else if (name === "zip") {
        nextValue = value.replace(/\D/g, "").slice(0, 6);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    const required = [
      "firstName",
      "lastName",
      "email",
      "mobileNumber",
      "password",
      "confirmPassword",
      "dateOfBirth",
      "gender",
      "course",
      "address",
      "city",
      "state",
      "zip",
      "studyMode",
    ];

    required.forEach((field) => {
      if (!formData[field]) {
        nextErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (formData.mobileNumber && !/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      nextErrors.mobileNumber = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.password && formData.password.length < 8) {
      nextErrors.password = "Use at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.dateOfBirth) {
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - dob.getFullYear() - (today < new Date(dob.setFullYear(today.getFullYear())) ? 1 : 0);
      if (Number.isFinite(age) && age < 18) {
        nextErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    const composedAddress = [formData.address, formData.city, formData.state, formData.zip]
      .filter(Boolean)
      .join(", ")
      .trim();
    if (composedAddress.length < 10) {
      nextErrors.address = "Address should be at least 10 characters";
    }

    if (formData.zip && formData.zip.length !== 6) {
      nextErrors.zip = "Enter a 6-digit PIN code";
    }

    if (!courseOptions.length) {
      nextErrors.course = "Tracks are loading. Please try again in a few moments.";
    } else if (!formData.course) {
      nextErrors.course = "Choose a learning track";
    }

    if (!formData.termsAccepted) {
      nextErrors.termsAccepted = "You must accept the terms";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      return;
    }
    setErrors({});
    setStatus(null);

    const composedAddress = [formData.address, formData.city, formData.state, formData.zip]
      .filter(Boolean)
      .join(", ");

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      mobileNumber: formData.mobileNumber.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: composedAddress,
    referralCode: formData.referralCode || undefined,
    selectedCourse: formData.course,
      termsAccepted: formData.termsAccepted,
      studyMode: formData.studyMode || undefined,
    };

    try {
      setSubmitting(true);
      setStatus({ kind: "pending", message: "Submitting your application..." });
      const response = await signupStudent(payload);

      setStatus({
        kind: "success",
        message: response?.message || "Signup successful! Please verify your email to activate your account.",
      });
      setFormData(() => ({ ...initialFormState }));

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3200);
    } catch (error) {
      const statusCode = error?.response?.status;
      const apiError = error?.response?.data;
      const aggregatedMessage = Array.isArray(apiError?.errors)
        ? apiError.errors.join(" · ")
        : undefined;
      const genericMessage = aggregatedMessage || apiError?.error || apiError?.message;

      let friendlyMessage = genericMessage;

      if (statusCode === 500) {
        friendlyMessage =
          "We hit a server-side issue while sending the verification email. Please retry in a minute or ping support.";
      } else if (statusCode === 409) {
        friendlyMessage = genericMessage || "This email address is already registered. Try signing in instead.";
      }

      setStatus({
        kind: "error",
        message: friendlyMessage || "We couldn't create your account. Please try again.",
      });

      const fieldErrors = apiError?.fields || apiError?.fieldErrors;
      if (fieldErrors && typeof fieldErrors === "object") {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <div className="stack" style={{ gap: "var(--space-3)", textAlign: "center" }}>
        <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, margin: 0 }}>Join the next Geekskul cohort</h2>
        <p style={{ color: "var(--text-tertiary)", marginBottom: 0 }}>
          Tell us a little about yourself and the learning track you&apos;re excited about. We&apos;ll confirm your slot once a mentor reviews your profile.
        </p>
      </div>
      <Card tone="soft">
        <form className="stack" style={{ gap: "var(--space-5)" }} onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: "grid",
              gap: "var(--space-4)",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <InputField
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <InputField
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              autoComplete="family-name"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <InputField
              label="Mobile number"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              placeholder="10-digit mobile number"
              autoComplete="tel"
            />
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(83,109,255,0.08)",
                    color: "var(--primary-600)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    padding: "0.3rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />
            <InputField
              label="Confirm password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(83,109,255,0.08)",
                    color: "var(--primary-600)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    padding: "0.3rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              }
            />
            <InputField
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              max={new Date().toISOString().split("T")[0]}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              options={genderOptions}
            />
            <SelectField
              label="Preferred track"
              name="course"
              value={formData.course}
              onChange={handleChange}
              error={errors.course || coursesError}
              options={courseOptions}
              placeholder="Choose your course"
              disabled={coursesLoading || !courseOptions.length}
              hint={
                coursesError
                  ? undefined
                  : coursesLoading
                    ? "Loading available tracks…"
                    : "Pick the track you want to join"
              }
            />
            <SelectField
              label="Learning schedule"
              name="studyMode"
              value={formData.studyMode}
              onChange={handleChange}
              error={errors.studyMode}
              options={studyModes}
              placeholder="Select a schedule"
            />
            <InputField
              label="Referral code"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              hint="Optional"
            />
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              autoComplete="address-level2"
            />
            <InputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              autoComplete="address-level1"
            />
            <InputField
              label="Postal code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              error={errors.zip}
              autoComplete="postal-code"
            />
          </div>
          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            multiline
            rows={4}
            autoComplete="street-address"
          />
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.65rem",
              color: "var(--text-secondary)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              style={{
                width: "1.1rem",
                height: "1.1rem",
                borderRadius: "0.35rem",
                border: errors.termsAccepted
                  ? "1px solid rgba(244,63,94,0.5)"
                  : "1px solid var(--border-primary)",
                accentColor: "var(--primary-500, #536dff)",
                marginTop: "0.15rem",
              }}
            />
            <span>
              I agree to Geekskul&apos;s admissions policy and privacy notice.
              {errors.termsAccepted && (
                <span style={{ color: "var(--accent-rose)", fontWeight: 600, marginLeft: "0.4rem" }}>
                  {errors.termsAccepted}
                </span>
              )}
            </span>
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <Button
              type="submit"
              size="lg"
              disabled={submitting || coursesLoading}
              style={submitting || coursesLoading ? { opacity: 0.7 } : undefined}
            >
              {coursesLoading ? "Loading tracks…" : submitting ? "Submitting…" : "Submit application"}
            </Button>
            {status && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  background:
                    status.kind === "success"
                      ? "rgba(56, 189, 248, 0.14)"
                      : status.kind === "pending"
                        ? "rgba(83, 109, 255, 0.12)"
                        : "rgba(244, 63, 94, 0.12)",
                  color:
                    status.kind === "success"
                      ? "var(--primary-700)"
                      : status.kind === "pending"
                        ? "var(--primary-600)"
                        : "var(--accent-rose)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                }}
              >
                {status.message}
                {status.kind === "success" && (
                  <span style={{ display: "block", marginTop: "0.35rem", fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                    We’ll redirect you to login shortly so you can continue after verifying your email.
                  </span>
                )}
              </div>
            )}
          </div>
        </form>
      </Card>
      <p style={{ fontSize: "var(--text-sm)", margin: 0, textAlign: "center" }}>
        Already part of a cohort? <Link to="/login" style={{ color: "var(--primary-600)", fontWeight: 600 }}>Sign in</Link> instead.
      </p>
    </div>
  );
}

export default SignupPage;
