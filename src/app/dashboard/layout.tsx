"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Calendar, Users, Plus, LogOut, CreditCard } from "lucide-react";

interface User {
  name?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  isAdmin?: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isProtaPage = pathname === "/dashboard/prota";
  const isUserPage = pathname === "/dashboard/user";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">PedagoAI</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              !isProtaPage && !isUserPage
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">RPP</span>
          </Link>

          <Link
            href="/dashboard/prota"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isProtaPage
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Calendar size={20} />
            <span className="font-medium">Prota</span>
          </Link>

          {user?.isAdmin && (
            <Link
              href="/dashboard/user"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isUserPage
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Users size={20} />
              <span className="font-medium">User</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {user?.subscriptionStatus !== "active" && !user?.isAdmin && (
            <Link
              href="/payment"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              <CreditCard size={20} />
              <span className="font-medium">Upgrade</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}