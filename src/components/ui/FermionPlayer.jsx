import React, { useState, useEffect } from "react";
import { getFermionEmbedToken, getFermionSessionStatus } from "../../services/fermionService.js";
import "./FermionPlayer.css";

/**
 * FermionPlayer Component
 * Embeds Fermion live event player in the page
 * 
 * @prop {string} sessionId - Fermion liveEventSessionId
 * @prop {string} userId - Current user's ID
 * @prop {string} lectureTitle - Lecture title for display
 * @prop {function} onError - Callback for errors
 */
export default function FermionPlayer({ sessionId, userId, lectureTitle = "Live Class", onError }) {
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading, ready, error
  const [error, setError] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(null);

  const playerUrlTemplates = [
    import.meta.env.VITE_FERMION_PLAYER_URL_TEMPLATE,
    "https://player.fermion.app/player/{sessionId}?token={token}",
    "https://fermion.app/live/{sessionId}?token={token}",
    "https://codedamn.com/player/{sessionId}?token={token}",
  ].filter(Boolean);

  // Fetch embed token and session status
  useEffect(() => {
    if (!sessionId || !userId) {
      setError("Missing sessionId or userId");
      setStatus("error");
      onError?.("Missing sessionId or userId");
      return;
    }

    const fetchToken = async () => {
      try {
        setStatus("loading");
        setError(null);

        // Fetch embed token
        const embedToken = await getFermionEmbedToken(sessionId, userId);
        setToken(embedToken);

        // Fetch session status
        try {
          const sessionData = await getFermionSessionStatus(sessionId);
          setSessionStatus(sessionData);
        } catch (statusError) {
          console.warn("Could not fetch session status:", statusError);
          // Don't fail if we can't get status, still try to show player
        }

        // Construct embed URL with token (configurable base + graceful fallbacks)
        const embedLink = playerUrlTemplates
          .map((template) =>
            template
              .replace("{sessionId}", sessionId)
              .replace("{token}", embedToken)
          )
          .find((url) => url && !url.includes("{sessionId}") && !url.includes("{token}"));

        if (!embedLink) {
          throw new Error("No valid Fermion player URL template configured");
        }

        setEmbedUrl(embedLink);

        setStatus("ready");
      } catch (err) {
        console.error("Failed to setup Fermion player:", err);
        const errorMsg = err.message || "Failed to load player";
        setError(errorMsg);
        setStatus("error");
        onError?.(errorMsg);
      }
    };

    fetchToken();
  }, [sessionId, userId, onError]);

  // Render error state
  if (status === "error") {
    return (
      <div className="fermion-player-container fermion-error">
        <div className="fermion-error-content">
          <div className="fermion-error-icon">⚠️</div>
          <h3>Unable to load player</h3>
          <p>{error}</p>
          <p className="fermion-error-hint">
            Please try refreshing the page or contacting support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (status === "loading") {
    return (
      <div className="fermion-player-container fermion-loading">
        <div className="fermion-loading-spinner">
          <div className="spinner"></div>
          <p>Loading {lectureTitle}...</p>
        </div>
      </div>
    );
  }

  // Render player
  if (status === "ready" && embedUrl) {
    return (
      <div className="fermion-player-container">
        <div className="fermion-player-header">
          <h3>{lectureTitle}</h3>
          {sessionStatus && (
            <div className="fermion-session-status">
              <span className={`status-badge status-${sessionStatus.state || "unknown"}`}>
                {sessionStatus.state === "live" ? "🔴 Live" : 
                 sessionStatus.state === "completed" ? "✅ Recording" : 
                 "⏱️ Scheduled"}
              </span>
            </div>
          )}
        </div>
        <div className="fermion-player-iframe-container">
          <iframe
            src={embedUrl}
            title={lectureTitle}
            className="fermion-player-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="fermion-player-footer">
          <p className="fermion-disclaimer">
            💡 Tip: You can go full screen to enjoy the best viewing experience
          </p>
        </div>
      </div>
    );
  }

  return null;
}
