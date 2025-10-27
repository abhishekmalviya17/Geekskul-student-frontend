import React, { useEffect } from "react";
import "./Toast.css";

export default function Toast({ 
  message, 
  variant = "success", // success, error, info
  onDismiss, 
  autoClose = true,
  duration = 5000 
}) {
  useEffect(() => {
    if (autoClose && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onDismiss]);

  if (!message) return null;

  const getIcon = () => {
    switch (variant) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  return (
    <div className={`toast toast-${variant} slide-in`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
      </div>
      {onDismiss && (
        <button className="toast-close" onClick={onDismiss} aria-label="Close notification">
          ×
        </button>
      )}
    </div>
  );
}
