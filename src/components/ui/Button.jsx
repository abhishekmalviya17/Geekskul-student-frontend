import React from "react";
import PropTypes from "prop-types";

const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  borderRadius: "var(--radius-full)",
  letterSpacing: "-0.01em",
  transition:
    "transform var(--transition-fast) var(--ease-out), box-shadow var(--transition-fast) var(--ease-out), opacity var(--transition-fast) var(--ease-out)",
  boxShadow: "0 14px 30px rgba(83, 109, 255, 0.22)",
  border: "none",
  cursor: "pointer",
};

const variantStyles = {
  primary: {
    background: "linear-gradient(135deg, #536dff, #7c8bff)",
    color: "#ffffff",
  },
  secondary: {
    background: "#ffffff",
    color: "#2b3ea3",
    border: "1px solid rgba(83,109,255,0.35)",
    boxShadow: "0 10px 24px rgba(83, 109, 255, 0.14)",
  },
  subtle: {
    background: "rgba(83,109,255,0.12)",
    color: "#2b3ea3",
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    color: "#2b3ea3",
    boxShadow: "none",
  },
};

const sizeStyles = {
  sm: {
    fontSize: "var(--text-sm)",
    padding: "0.5rem 1.25rem",
  },
  md: {
    fontSize: "var(--text-base)",
    padding: "0.7rem 1.65rem",
  },
  lg: {
    fontSize: "var(--text-lg)",
    padding: "0.85rem 2rem",
  },
};

function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  style,
  disabled = false,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  ...props
}) {
  const sharedStyle = {
    ...baseStyle,
    ...(variantStyles[variant] || variantStyles.primary),
    ...(sizeStyles[size] || sizeStyles.md),
    ...(disabled
      ? {
          cursor: "not-allowed",
          opacity: 0.6,
          boxShadow: "none",
        }
      : null),
    ...style,
  };

  const handleMouseDown = (event) => {
    if (disabled) return;
    event.currentTarget.style.transform = "scale(0.98)";
    if (onMouseDown) onMouseDown(event);
  };

  const handleMouseUp = (event) => {
    if (disabled) return;
    event.currentTarget.style.transform = "scale(1)";
    if (onMouseUp) onMouseUp(event);
  };

  const handleMouseLeave = (event) => {
    if (disabled) return;
    event.currentTarget.style.transform = "scale(1)";
    if (onMouseLeave) onMouseLeave(event);
  };

  const originalOnClick = props?.onClick;
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (originalOnClick) {
      originalOnClick(event);
    }
  };

  const componentProps = {
    ...props,
    className,
    style: sharedStyle,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
  };

  if (Component === "button") {
    componentProps.disabled = disabled;
    if (!componentProps.type) {
      componentProps.type = "button";
    }
  } else if (disabled) {
    componentProps["aria-disabled"] = true;
    componentProps.tabIndex = -1;
  }

  return (
    <Component {...componentProps}>
      {children}
    </Component>
  );
}

Button.propTypes = {
  as: PropTypes.elementType,
  variant: PropTypes.oneOf(Object.keys(variantStyles)),
  size: PropTypes.oneOf(Object.keys(sizeStyles)),
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default Button;
