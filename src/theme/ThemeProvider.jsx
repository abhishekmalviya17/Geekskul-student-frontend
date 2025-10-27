import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEME_OPTIONS, isValidTheme } from "./themeConfig.js";

const STORAGE_KEY = "geekskul_student_theme";

const ThemeContext = createContext({
  theme: "default",
  setTheme: () => {},
  cycleTheme: () => {},
  themes: THEME_OPTIONS,
});

function resolveInitialTheme() {
  if (typeof window === "undefined") {
    return "default";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && isValidTheme(stored)) {
    return stored;
  }

  const mediaQuery = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;
  return mediaQuery?.matches ? "midnight" : "default";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(resolveInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme && theme !== "default") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    if (!mediaQuery) return;

    const handleChange = (event) => {
      setThemeState((current) => {
        if (current !== "default") return current;
        return event.matches ? "midnight" : "default";
      });
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener?.(handleChange);
    return () => mediaQuery.removeListener?.(handleChange);
  }, []);

  const setTheme = (nextTheme) => {
    if (!nextTheme) {
      setThemeState("default");
      return;
    }

    if (!isValidTheme(nextTheme)) {
      setThemeState("default");
      return;
    }

    setThemeState(nextTheme);
  };

  const cycleTheme = () => {
    setThemeState((current) => {
      const index = THEME_OPTIONS.findIndex((option) => option.id === current);
      const nextIndex = index >= 0 ? (index + 1) % THEME_OPTIONS.length : 0;
      return THEME_OPTIONS[nextIndex].id;
    });
  };

  const value = useMemo(
    () => ({ theme, setTheme, cycleTheme, themes: THEME_OPTIONS }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
