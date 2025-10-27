import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/Button.jsx";
import { useTheme } from "../../theme/useTheme.js";

function ThemeToggle({ condensed = false }) {
  const { theme, setTheme, cycleTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const activeTheme = useMemo(() => themes.find((item) => item.id === theme) ?? themes[0], [themes, theme]);

  if (condensed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={cycleTheme}
        aria-label={`Switch theme (current: ${activeTheme.label})`}
      >
        {activeTheme.emoji}
      </Button>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{ gap: "var(--space-2)", display: "inline-flex", alignItems: "center" }}
      >
        <span aria-hidden>{activeTheme.emoji}</span>
        <span>{activeTheme.label}</span>
      </Button>
      {open && (
        <div
          className="glass-card fade-in"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            padding: "var(--space-4)",
            minWidth: 220,
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {themes.map((item) => {
            const isActive = item.id === activeTheme.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTheme(item.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  border: isActive ? "1px solid rgba(83,109,255,0.45)" : "1px solid transparent",
                  background: isActive ? "rgba(83,109,255,0.12)" : "transparent",
                  color: "inherit",
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "-0.01em",
                  transition: "transform var(--transition-fast) var(--ease-out), background var(--transition-fast) var(--ease-out)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <span aria-hidden>{item.emoji}</span>
                  {item.label}
                </span>
                {isActive && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Active</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
