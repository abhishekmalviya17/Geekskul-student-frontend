import React from "react";
import PropTypes from "prop-types";

function InputField({
  label,
  hint,
  error,
  id,
  onFocus,
  onBlur,
  suffix,
  multiline = false,
  rows = 3,
  ...props
}) {
  const inputId = id ?? props.name;
  const Element = multiline ? "textarea" : "input";

  const handleFocus = (event) => {
    event.target.style.border = "1px solid rgba(83,109,255,0.6)";
    event.target.style.boxShadow = "0 12px 36px rgba(83,109,255,0.18)";
    if (onFocus) onFocus(event);
  };

  const handleBlur = (event) => {
    event.target.style.border = error
      ? "1px solid rgba(244,63,94,0.5)"
      : "1px solid var(--border-primary)";
    event.target.style.boxShadow = "0 12px 30px rgba(15, 23, 42, 0.08)";
    if (onBlur) onBlur(event);
  };

  const basePadding = suffix ? "0.9rem 3.3rem 0.9rem 1.1rem" : "0.9rem 1.1rem";

  return (
    <label htmlFor={inputId} style={{ display: "block", width: "100%" }}>
      {label && (
        <div
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: "0.4rem",
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <Element
          id={inputId}
          style={{
            width: "100%",
            maxWidth: "100%",
            borderRadius: "var(--radius-lg)",
            border: error ? "1px solid rgba(244,63,94,0.5)" : "1px solid var(--border-primary)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: basePadding,
            fontSize: "var(--text-base)",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            letterSpacing: "-0.01em",
            boxSizing: "border-box",
            transition:
              "border var(--transition-fast) var(--ease-out), box-shadow var(--transition-fast) var(--ease-out)",
            resize: multiline ? "vertical" : "none",
            minHeight: multiline ? `${rows * 1.4}rem` : undefined,
            lineHeight: multiline ? "1.6" : "inherit",
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={multiline ? rows : undefined}
          {...props}
        />
        {suffix && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "0.75rem",
              transform: "translateY(-50%)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            {suffix}
          </div>
        )}
      </div>
      {hint && !error && (
        <p
          style={{
            marginTop: "0.4rem",
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
          }}
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          style={{
            marginTop: "0.4rem",
            fontSize: "var(--text-xs)",
            color: "var(--accent-rose)",
            fontWeight: 600,
          }}
        >
          {error}
        </p>
      )}
    </label>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  suffix: PropTypes.node,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
};

export default InputField;
