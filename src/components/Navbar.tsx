"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

let cachedUser: UserData | null = null;
let cachedUserId: string | null = null;

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) {
    cachedUser = null;
    cachedUserId = null;
    return null;
  }
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed;
  } catch {
    return null;
  }
}

function subscribeToUser(callback: () => void) {
  const handler = () => {
    const newUser = getStoredUser();
    cachedUser = newUser;
    cachedUserId = newUser?.id || null;
    callback();
  };
  cachedUser = getStoredUser();
  cachedUserId = cachedUser?.id || null;
  window.addEventListener("user-logged-out", handler);
  window.addEventListener("user-logged-in", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("user-logged-out", handler);
    window.removeEventListener("user-logged-in", handler);
    window.removeEventListener("storage", handler);
  };
}

function getUserSnapshot(): UserData | null {
  if (cachedUser === null) {
    cachedUser = getStoredUser();
    cachedUserId = cachedUser?.id || null;
  }
  const current = getStoredUser();
  if (current && current.id !== cachedUserId) {
    cachedUser = current;
    cachedUserId = current.id;
  }
  if (!current && cachedUserId !== null) {
    cachedUser = null;
    cachedUserId = null;
  }
  return cachedUser;
}

let cachedPathname = "";

function subscribeToPathname(callback: () => void) {
  const handler = () => {
    cachedPathname = window.location.pathname;
    callback();
  };
  window.addEventListener("popstate", handler);
  return () => window.removeEventListener("popstate", handler);
}

function getPathname(): string {
  if (typeof window === "undefined") return "";
  return cachedPathname || window.location.pathname;
}

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = useSyncExternalStore(subscribeToUser, getUserSnapshot, () => null);
  const pathname = useSyncExternalStore(subscribeToPathname, getPathname, () => "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowUserMenu(false);
    window.dispatchEvent(new Event("user-logged-out"));
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg fixed top-0 left-0 right-0 z-20 md:relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="font-bold text-xl">PedagoAI</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                >
                  <User size={18} />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                  <ChevronDown size={16} className={`transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-blue-200 transition-colors">Login</Link>
            )}
          </div>
          <button
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-blue-500">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/dashboard"
              className="block hover:text-blue-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <div className="pt-3 border-t border-blue-500">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-200">
                    <User size={16} />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-300 hover:text-red-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hover:text-blue-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}