import React from "react";
import PropTypes from "prop-types";

const toneStyles = {
  success: {
    background: "rgba(16,185,129,0.12)",
    color: "#047857",
    border: "1px solid rgba(16,185,129,0.3)",
  },
  info: {
    background: "rgba(14,165,233,0.12)",
    color: "#0369a1",
    border: "1px solid rgba(14,165,233,0.3)",
  },
  warning: {
    background: "rgba(245,158,11,0.12)",
    color: "#b45309",
    border: "1px solid rgba(245,158,11,0.3)",
  },
  danger: {
    background: "rgba(244,63,94,0.12)",
    color: "#be123c",
    border: "1px solid rgba(244,63,94,0.3)",
  },
  neutral: {
    background: "rgba(148,163,184,0.12)",
    color: "#475569",
    border: "1px solid rgba(148,163,184,0.3)",
  },
};

function StatusPill({ tone = "neutral", children, icon }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        padding: "0.4rem 0.85rem",
        borderRadius: "var(--radius-full)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        ...toneStyles[tone],
      }}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}

StatusPill.propTypes = {
  tone: PropTypes.oneOf(Object.keys(toneStyles)),
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
};

export default StatusPill;
