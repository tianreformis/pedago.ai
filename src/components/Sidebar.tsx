"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Calendar, LayoutDashboard, ChevronDown, LogOut, CreditCard, Users } from "lucide-react";

interface User {
  id?: string;
  name?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  isAdmin?: boolean;
}

let cachedUser: User | null = null;
let cachedUserId: string | null = null;

function getStoredUser(): User | null {
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
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  const handler = () => {
    const newUser = getStoredUser();
    cachedUser = newUser;
    cachedUserId = newUser?.id || null;
    callback();
  };
  cachedUser = getStoredUser();
  cachedUserId = cachedUser?.id || null;
  window.addEventListener("storage", handler);
  window.addEventListener("user-updated", handler);
  window.addEventListener("user-logged-in", handler);
  window.addEventListener("user-logged-out", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("user-updated", handler);
    window.removeEventListener("user-logged-in", handler);
    window.removeEventListener("user-logged-out", handler);
  };
}

function getSnapshot(): User | null {
  if (cachedUser === null) {
    cachedUser = getStoredUser();
    cachedUserId = cachedUser?.id || null;
  }
  const current = getStoredUser();
  if (current && current.id !== cachedUserId) {
    cachedUser = current;
    cachedUserId = current.id || null;
  }
  if (!current && cachedUserId !== null) {
    cachedUser = null;
    cachedUserId = null;
  }
  return cachedUser;
}

function NavGroup({
  label,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-3 md:px-4 rounded-lg transition-colors text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="hidden md:inline font-medium">{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`hidden md:inline transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
      {isExpanded && (
        <div className="ml-4 md:ml-8 space-y-1 mt-1">{children}</div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [rppManuallyCollapsed, setRppManuallyCollapsed] = useState(false);
  const [protaManuallyCollapsed, setProtaManuallyCollapsed] = useState(false);

  const user = getStoredUser();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const rppRoutes = ["/dashboard/rpp", "/generate"];
  const protaRoutes = ["/dashboard/prota", "/generate-prota"];

  const rppExpanded = rppRoutes.includes(pathname) || !rppManuallyCollapsed;
  const protaExpanded = protaRoutes.includes(pathname) || !protaManuallyCollapsed;

  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed inset-y-0 left-0 z-10 pt-16">
      <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
            pathname === "/dashboard" || pathname === "/dashboard/"
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="hidden md:inline font-medium">Dashboard</span>
        </Link>

        <NavGroup
          label="RPP"
          icon={<FileText size={18} />}
          isExpanded={rppExpanded}
          onToggle={() => setRppManuallyCollapsed(!rppManuallyCollapsed)}
        >
          <Link
            href="/dashboard/rpp"
            className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/dashboard/rpp"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            RPP Saya
          </Link>
          <Link
            href="/generate"
            className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/generate"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Buat RPP
          </Link>
        </NavGroup>

        <NavGroup
          label="Prota"
          icon={<Calendar size={18} />}
          isExpanded={protaExpanded}
          onToggle={() => setProtaManuallyCollapsed(!protaManuallyCollapsed)}
        >
          <Link
            href="/dashboard/prota"
            className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/dashboard/prota"
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Prota Saya
          </Link>
          <Link
            href="/generate-prota"
            className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/generate-prota"
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Buat Prota
          </Link>
        </NavGroup>

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {user?.isAdmin && (
            <Link
              href="/dashboard/user"
              className="flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Users size={18} />
              <span className="hidden md:inline font-medium">User</span>
            </Link>
          )}
          {user?.subscriptionStatus !== "active" && !user?.isAdmin && (
            <Link
              href="/payment"
              className="flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              <CreditCard size={18} />
              <span className="hidden md:inline font-medium">Upgrade</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-3 md:px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:inline font-medium">Keluar</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
