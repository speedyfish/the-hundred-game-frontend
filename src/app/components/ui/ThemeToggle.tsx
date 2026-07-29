"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  const applyThemeClass = (next: Theme) => {
    const root = document.documentElement; // <html>
    root.classList.remove("light", "dark");
    root.classList.add(next);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("theme") as Theme | null;

    let initial: Theme;
    if (stored) {
      initial = stored;
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      initial = prefersDark ? "dark" : "light";
    }

    setTheme(initial);
    applyThemeClass(initial);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", next);
      applyThemeClass(next);
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center rounded-full border border-border bg-surface-muted px-1 py-1 text-xs font-medium text-foreground shadow-sm transition-colors"
      aria-label="Toggle theme"
    >
      <span
        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] transition-colors ${
          isDark
            ? "bg-foreground text-background"
            : "bg-background text-foreground"
        }`}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full transition-colors ${
            isDark ? "bg-yellow-400" : "bg-slate-900"
          }`}
        />
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
