import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import InputField from "../components/ui/InputField.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import { loginSuccess, selectAuth, setAuthError, setAuthLoading } from "../features/auth/authSlice.js";
import { loginStudent } from "../services/authService.js";

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(selectAuth);
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const highlights = [
    {
      title: "Next live",
      accent: "Tue • 11:00 AM",
      caption: "Design Systems Deep Dive",
    },
    {
      title: "Streak bonus",
      accent: "+2",
      caption: "Keep attending to unlock premium labs",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (error) {
      dispatch(setAuthError(null));
    }
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextFieldErrors = {};
    const trimmedEmail = formState.email.trim();

    if (!trimmedEmail) {
      nextFieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextFieldErrors.email = "Enter a valid email address";
    }

    if (!formState.password) {
      nextFieldErrors.password = "Password is required";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      dispatch(setAuthError("Please fix the highlighted fields."));
      return;
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));
      setFieldErrors({});

      const response = await loginStudent({
        email: trimmedEmail.toLowerCase(),
        password: formState.password,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("geekskul_student_token", response.token);
        if (response.refreshToken) {
          window.localStorage.setItem(
            "geekskul_student_refresh_token",
            response.refreshToken,
          );
        } else {
          window.localStorage.removeItem("geekskul_student_refresh_token");
        }
      }

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        }),
      );

      setFormState({ email: "", password: "" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const apiError = err?.response?.data;
      let friendlyMessage;

      if (!status) {
        friendlyMessage = "We couldn't reach the server. Check your connection and try again.";
      } else {
        switch (status) {
          case 400:
          case 401:
            friendlyMessage = "Invalid email or password. Please try again.";
            break;
          case 403:
            friendlyMessage =
              apiError?.code === "EMAIL_VERIFICATION_REQUIRED"
                ? "Please verify your email before signing in. Check your inbox for the verification link."
                : apiError?.message || "Access denied. Please contact support.";
            break;
          case 423:
            friendlyMessage =
              apiError?.message ||
              "Your account is temporarily locked due to multiple failed attempts. Please try again later.";
            break;
          case 429:
            friendlyMessage =
              apiError?.error ||
              apiError?.message ||
              "Too many attempts. Please wait a moment before trying again.";
            break;
          default:
            friendlyMessage =
              status >= 500
                ? "We hit a server-side issue. Please retry in a minute or ping support."
                : apiError?.error || apiError?.message;
            if (!friendlyMessage) {
              friendlyMessage = "We could not log you in. Please try again.";
            }
        }
      }

      const serverFieldErrors = {};
      if (status === 401) {
        serverFieldErrors.password = "Invalid email or password";
      } else if (status === 403 && apiError?.code === "EMAIL_VERIFICATION_REQUIRED") {
        serverFieldErrors.email = "Email verification pending";
      } else if (status === 423) {
        serverFieldErrors.password = friendlyMessage;
      } else if (status === 429) {
        serverFieldErrors.password = friendlyMessage;
      }

      setFieldErrors(serverFieldErrors);
      dispatch(setAuthError(friendlyMessage));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <form className="stack slide-up" style={{ gap: "var(--space-6)" }} onSubmit={handleSubmit}>
      <div className="stack fade-in" style={{ gap: "var(--space-2)", textAlign: "center" }}>
        <span className="badge-pill" style={{ alignSelf: "center", background: "rgba(83,109,255,0.15)" }}>
          Welcome back
        </span>
        <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, margin: 0 }}>Sign in to continue</h2>
        <p style={{ color: "var(--text-tertiary)", margin: 0 }}>
          Access live sessions, track assignments, and stay connected with the mentor line-up.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "var(--radius-lg)",
            background: "rgba(244, 63, 94, 0.12)",
            color: "var(--accent-rose)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      <div className="stack" style={{ gap: "var(--space-4)" }}>
        <InputField
          id="login-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@geekskul.com"
          value={formState.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <InputField
          id="login-password"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formState.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/signup" style={{ color: "var(--primary-600)", fontWeight: 600 }}>
          Need an account?
        </Link>
        <Button type="submit" disabled={loading} style={loading ? { opacity: 0.7 } : undefined}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => navigate("/signup")}
        style={{ justifyContent: "center" }}
      >
        Prefer a magic link? Request invite access
      </Button>

      <div
        className="grid-auto-fit fade-in-delayed"
        style={{ gap: "var(--space-4)", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        {highlights.map((item) => (
          <div
            key={item.title}
            className="glass-card"
            style={{
              padding: "var(--space-4)",
              background: "rgba(255,255,255,0.45)",
              borderColor: "rgba(83,109,255,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              {item.title}
            </span>
            <span style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>{item.accent}</span>
            <span style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>{item.caption}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: 0 }}>
        By continuing you agree to our updated student guidelines and code of conduct.
      </p>
    </form>
  );
}

export default LoginPage;
