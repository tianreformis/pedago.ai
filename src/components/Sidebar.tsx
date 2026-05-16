"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Calendar, LayoutDashboard, ChevronDown, LogOut, CreditCard, Users, Plus, Save, School, Table, ClipboardList, GraduationCap, ExternalLink } from "lucide-react";

interface User {
  id?: string;
  name?: string;
  school?: string;
  email?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  isAdmin?: boolean;
  role?: string;
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
        className="w-full flex items-center justify-between px-2 py-3 md:px-4 rounded-lg transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
  const [promesManuallyCollapsed, setPromesManuallyCollapsed] = useState(false);
  const [examManuallyCollapsed, setExamManuallyCollapsed] = useState(false);

  const user = getStoredUser();
  const isStudent = user?.role === "student";
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const rppRoutes = ["/dashboard/rpp", "/generate"];
  const protaRoutes = ["/dashboard/prota", "/generate-prota"];
  const promesRoutes = ["/dashboard/promes", "/generate-promes", "/dashboard/promes"];
  const examRoutes = ["/dashboard/exam"];

  const rppExpanded = rppRoutes.includes(pathname) || !rppManuallyCollapsed;
  const protaExpanded = protaRoutes.includes(pathname) || !protaManuallyCollapsed;
  const promesExpanded = promesRoutes.includes(pathname) || !promesManuallyCollapsed;
  const examExpanded = examRoutes.includes(pathname) || pathname.startsWith("/dashboard/exam") || !examManuallyCollapsed;

  if (isStudent) {
    return (
      <aside className="w-16 md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed inset-y-0 left-0 z-10 pt-16">
        <div className="hidden md:block p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-300 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || "Siswa"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Siswa</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
          <Link
            href="/dashboard/grade"
            className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
              pathname === "/dashboard/grade"
                ? "bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-300"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <ClipboardList size={18} />
            <span className="hidden md:inline font-medium">Lihat Nilai</span>
          </Link>

          <Link
            href="/exam"
            className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
              pathname.startsWith("/exam")
                ? "bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-300"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <GraduationCap size={18} />
            <span className="hidden md:inline font-medium">Masuk Ujian</span>
          </Link>
        </nav>

        <div className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-3 md:px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:inline font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed inset-y-0 left-0 z-10 pt-16">
      <div className="hidden md:block p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user?.name || "Pengguna"}
            </p>
            {user?.school && (
              <div className="flex items-center gap-1 mt-0.5">
                <School size={10} className="text-gray-400 dark:text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                  {user.school}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
            pathname === "/dashboard" || pathname === "/dashboard/"
              ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/dashboard/rpp"
                ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Save size={16} />
            <span className="hidden md:inline">RPP Saya</span>
          </Link>
          <Link
            href="/generate"
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/generate"
                ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Plus size={16} />
            <span className="hidden md:inline">Buat RPP</span>
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
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/dashboard/prota"
                ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Save size={16} />
            <span className="hidden md:inline">Prota Saya</span>
          </Link>
          <Link
            href="/generate-prota"
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/generate-prota"
                ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Plus size={16} />
            <span className="hidden md:inline">Buat Prota</span>
          </Link>
        </NavGroup>

        <NavGroup
          label="Promes"
          icon={<Table size={18} />}
          isExpanded={promesExpanded}
          onToggle={() => setPromesManuallyCollapsed(!promesManuallyCollapsed)}
        >
          <Link
            href="/dashboard/promes"
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname.startsWith("/dashboard/promes")
                ? "bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Save size={16} />
            <span className="hidden md:inline">Promes Saya</span>
          </Link>
          <Link
            href="/generate-promes"
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/generate-promes"
                ? "bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Plus size={16} />
            <span className="hidden md:inline">Buat Promes</span>
          </Link>
        </NavGroup>

        <NavGroup
          label="Ujian"
          icon={<ClipboardList size={18} />}
          isExpanded={examExpanded}
          onToggle={() => setExamManuallyCollapsed(!examManuallyCollapsed)}
        >
          <Link
            href="/dashboard/exam"
            className={`flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm ${
              pathname === "/dashboard/exam"
                ? "bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Save size={16} />
            <span className="hidden md:inline">Ujian Saya</span>
          </Link>
        </NavGroup>

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {user?.isAdmin && (
            <Link
              href="/dashboard/user"
              className="flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Users size={18} />
              <span className="hidden md:inline font-medium">User</span>
            </Link>
          )}
          {user?.subscriptionStatus !== "active" && !user?.isAdmin && (
            <Link
              href="/payment"
              className="flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
            >
              <CreditCard size={18} />
              <span className="hidden md:inline font-medium">Upgrade</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-3 md:px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:inline font-medium">Keluar</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
