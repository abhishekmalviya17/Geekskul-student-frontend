import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import InputField from "../components/ui/InputField.jsx";
import {
  confirmEmailVerification,
  requestEmailVerification,
} from "../services/authService.js";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verificationId = useMemo(() => {
    const raw = searchParams.get("vid");
    return raw ? raw.trim().toUpperCase() : "";
  }, [searchParams]);

  const [verificationStatus, setVerificationStatus] = useState(() =>
    verificationId
      ? {
          kind: "pending",
          message: "Hang tight while we confirm your email…",
        }
      : {
          kind: "idle",
          message: "Enter your email to request a fresh verification link.",
        }
  );
  const [verifying, setVerifying] = useState(Boolean(verificationId));
  const [resendEmail, setResendEmail] = useState("");
  const [resendError, setResendError] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const runVerification = async () => {
      if (!verificationId) return;
      setVerifying(true);
      setVerificationStatus({
        kind: "pending",
        message: "Hang tight while we confirm your email…",
      });

      try {
        const result = await confirmEmailVerification(verificationId);
        if (cancelled) return;
        setVerificationStatus({
          kind: "success",
          message:
            result?.message ||
            "Email verified successfully! You can now sign in to your account.",
        });
      } catch (error) {
        if (cancelled) return;
        const status = error?.response?.status;
        const apiError = error?.response?.data;
        let message = apiError?.error || apiError?.message;

        if (!message) {
          if (status === 401) {
            message = "This verification link has expired or is invalid.";
          } else if (status === 500) {
            message = "We ran into a server issue while verifying your email.";
          } else {
            message = "We could not verify your email. Please try again.";
          }
        }

        setVerificationStatus({
          kind: "error",
          message,
        });
      } finally {
        if (!cancelled) {
          setVerifying(false);
        }
      }
    };

    runVerification();

    return () => {
      cancelled = true;
    };
  }, [verificationId]);

  const handleResend = async (event) => {
    event.preventDefault();
    setResendStatus(null);

    const email = resendEmail.trim().toLowerCase();
    if (!email) {
      setResendError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResendError("Enter a valid email address");
      return;
    }

    setResendError(null);
    setResendLoading(true);

    try {
      const result = await requestEmailVerification(email);
      setResendStatus({
        kind: "success",
        message:
          result?.message ||
          "If the account exists, a verification email has been sent.",
      });
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.error ||
        apiError?.message ||
        "We couldn't resend the verification email. Please try again.";
      setResendStatus({ kind: "error", message });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <div className="stack" style={{ gap: "var(--space-2)", textAlign: "center" }}>
        <span
          className="badge-pill"
          style={{ alignSelf: "center", background: "rgba(83,109,255,0.15)" }}
        >
          Email verification
        </span>
        <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, margin: 0 }}>
          Confirm your Geekskul account
        </h2>
        <p style={{ color: "var(--text-tertiary)", margin: 0 }}>
          {verificationStatus.kind === "success"
            ? "You're all set. Log in to start learning."
            : "We need to verify your email before you can access your cohort."}
        </p>
      </div>

      <Card tone="soft">
        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-lg)",
              background:
                verificationStatus.kind === "success"
                  ? "rgba(56, 189, 248, 0.14)"
                  : verificationStatus.kind === "error"
                  ? "rgba(244, 63, 94, 0.12)"
                  : "rgba(83, 109, 255, 0.12)",
              color:
                verificationStatus.kind === "success"
                  ? "var(--primary-700)"
                  : verificationStatus.kind === "error"
                  ? "var(--accent-rose)"
                  : "var(--primary-600)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
            }}
          >
            {verificationStatus.message}
            {verifying && (
              <span
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                }}
              >
                This usually takes a second.
              </span>
            )}
            {verificationStatus.kind === "error" && verificationId && (
              <span
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                }}
              >
                Verification ID used: <strong>{verificationId}</strong>
              </span>
            )}
          </div>

          {verificationStatus.kind === "success" ? (
            <div className="stack" style={{ gap: "var(--space-3)" }}>
              <Button size="lg" onClick={() => navigate("/login", { replace: true })}>
                Go to login
              </Button>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: 0 }}>
                Need help? <Link to="/signup">Contact support</Link> and we’ll get you set up.
              </p>
            </div>
          ) : (
            <form className="stack" style={{ gap: "var(--space-4)" }} onSubmit={handleResend}>
              <div className="stack" style={{ gap: "var(--space-2)" }}>
                <InputField
                  label="Email"
                  name="resend-email"
                  type="email"
                  value={resendEmail}
                  onChange={(event) => {
                    setResendEmail(event.target.value);
                    if (resendError) setResendError(null);
                  }}
                  placeholder="you@geekskul.com"
                  autoComplete="email"
                  error={resendError}
                />
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)", margin: 0 }}>
                  We’ll send a fresh verification link if the account exists and is still pending.
                </p>
              </div>

              {resendStatus && (
                <div
                  role="status"
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-lg)",
                    background:
                      resendStatus.kind === "success"
                        ? "rgba(56, 189, 248, 0.14)"
                        : "rgba(244, 63, 94, 0.12)",
                    color:
                      resendStatus.kind === "success"
                        ? "var(--primary-700)"
                        : "var(--accent-rose)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                  }}
                >
                  {resendStatus.message}
                </div>
              )}

              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                <Button type="submit" size="lg" disabled={resendLoading} style={resendLoading ? { opacity: 0.7 } : undefined}>
                  {resendLoading ? "Sending…" : "Resend verification email"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  style={{ justifyContent: "center" }}
                >
                  Back to login
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}

export default VerifyEmailPage;
