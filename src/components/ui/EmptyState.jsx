import React from "react";
import PropTypes from "prop-types";
import Button from "./Button.jsx";

function EmptyState({ title, description, actionLabel, onAction, className, style }) {
  const combinedClassName = className ? `glass-card ${className}` : "glass-card";

  return (
    <div
      className={combinedClassName}
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px dashed rgba(83,109,255,0.3)",
        padding: "var(--space-8)",
        textAlign: "center",
        background: "linear-gradient(135deg, rgba(83,109,255,0.08), rgba(14,165,233,0.08))",
        color: "var(--text-secondary)",
        ...style,
      }}
    >
      <h3
        style={{
          fontSize: "var(--text-2xl)",
          marginBottom: "var(--space-3)",
          fontWeight: 700,
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ maxWidth: 420, margin: "0 auto var(--space-5)", color: "var(--text-tertiary)" }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default EmptyState;
