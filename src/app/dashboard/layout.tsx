"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, CreditCard, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";

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
    const parsed = JSON.parse(stored);
    return parsed;
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

  const sidebarFooter = (
    <>
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
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="flex flex-1">
        <Sidebar footer={sidebarFooter} />
        <main className="flex-1 overflow-auto p-2 md:p-4 ml-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
