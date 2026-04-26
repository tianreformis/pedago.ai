"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Calendar, Users, LogOut, CreditCard, LayoutDashboard } from "lucide-react";

interface User {
  name?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  isAdmin?: boolean;
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function subscribe() {
  return () => {};
}

function getSnapshot(): User | null {
  return getStoredUser();
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const storedUser = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const user = storedUser;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="flex flex-1">
        <aside className="w-16 md:w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed inset-y-0 left-0 z-10">
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

            <Link
              href="/dashboard/rpp"
              className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
                pathname === "/dashboard/rpp"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FileText size={18} />
              <span className="hidden md:inline font-medium">RPP</span>
            </Link>

            <Link
              href="/dashboard/prota"
              className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
                pathname === "/dashboard/prota"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Calendar size={18} />
              <span className="hidden md:inline font-medium">Prota</span>
            </Link>

            {user?.isAdmin && (
              <Link
                href="/dashboard/user"
                className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
                  pathname === "/dashboard/user"
                    ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users size={18} />
                <span className="hidden md:inline font-medium">User</span>
              </Link>
            )}
          </nav>

          <div className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
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
        </aside>

        <main className="flex-1 overflow-auto p-2 md:p-4 pt-16 md:pt-0 ml-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}