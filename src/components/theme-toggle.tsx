"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
}

function subscribe() {
  return () => {};
}

function getSnapshot(): Theme {
  return getStoredTheme();
}

function applyTheme(newTheme: Theme) {
  if (typeof window === "undefined") return;
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
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, getSnapshot, () => "system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applyTheme(theme);
    setMounted(true);
  }, [theme]);

  const cycleTheme = () => {
    let newTheme: Theme;
    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }
    
    localStorage.setItem("theme", newTheme);
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