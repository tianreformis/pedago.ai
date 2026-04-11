"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
    applyTheme(stored || "system");
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    let resolved: "light" | "dark";
    if (newTheme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = newTheme;
    }
    
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const cycleTheme = () => {
    let newTheme: Theme;
    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }
    
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const getIcon = () => {
    if (!mounted) return <Sun size={20} />;
    if (theme === "light") return <Sun size={20} />;
    if (theme === "dark") return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  const getTitle = () => {
    if (theme === "light") return "Mode Terang - Klik untuk mode Gelap";
    if (theme === "dark") return "Mode Gelap - Klik untuk mode Sistem";
    return "Mode Sistem - Klik untuk mode Terang";
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-blue-500 transition-colors text-white"
      title={getTitle()}
      type="button"
    >
      {getIcon()}
    </button>
  );
}