import React from "react";
import PropTypes from "prop-types";

function SelectField({
  label,
  hint,
  error,
  id,
  options,
  placeholder = "Select an option",
  onFocus,
  onBlur,
  ...props
}) {
  const selectId = id ?? props.name;

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

  return (
    <label htmlFor={selectId} style={{ display: "block", width: "100%" }}>
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
        <select
          id={selectId}
          style={{
            width: "100%",
            maxWidth: "100%",
            borderRadius: "var(--radius-lg)",
            border: error ? "1px solid rgba(244,63,94,0.5)" : "1px solid var(--border-primary)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "0.9rem 3.1rem 0.9rem 1.1rem",
            fontSize: "var(--text-base)",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            color: props.value ? "var(--text-primary)" : "var(--text-tertiary)",
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            letterSpacing: "-0.01em",
            boxSizing: "border-box",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            transition:
              "border var(--transition-fast) var(--ease-out), box-shadow var(--transition-fast) var(--ease-out)",
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            right: "1.1rem",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--text-tertiary)",
            fontSize: "0.85rem",
          }}
        >
          ▾
        </div>
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

SelectField.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SelectField;
