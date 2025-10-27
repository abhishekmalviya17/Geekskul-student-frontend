import React from "react";
import PropTypes from "prop-types";

function Card({ children, tone = "default", style, className, ...props }) {
  const toneStyles = {
    default: {
      background: "var(--surface-overlay)",
      border: "1px solid var(--border-primary)",
      boxShadow: "var(--shadow-md)",
    },
    soft: {
      background: "linear-gradient(135deg, rgba(83,109,255,0.14), rgba(14,165,233,0.1))",
      border: "1px solid rgba(83,109,255,0.2)",
      boxShadow: "0 28px 60px rgba(83, 109, 255, 0.18)",
    },
  };

  const combinedClassName = className ? `glass-card ${className}` : "glass-card";

  return (
    <div
      className={combinedClassName}
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        backdropFilter: "blur(18px)",
        ...toneStyles[tone],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(["default", "soft"]),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Card;
