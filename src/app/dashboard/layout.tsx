"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const STUDENT_ALLOWED = ["/dashboard/grade"];
const TEACHER_ONLY = ["/dashboard/rpp", "/dashboard/prota", "/dashboard/promes", "/dashboard/exam", "/dashboard/user", "/generate", "/generate-prota", "/generate-promes", "/settings", "/payment"];

let cachedUser: any = null;
let cachedUserId: string | null = null;

function getStoredUser(): any | null {
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
    cachedUser = getStoredUser();
    cachedUserId = cachedUser?.id || null;
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

function getSnapshot(): any | null {
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
  const pathname = usePathname();
  useSyncExternalStore(subscribe, getSnapshot, () => null);
  const [isLoading, setIsLoading] = useState(true);

  const user = getStoredUser();
  const isStudent = user?.role === "student";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (isStudent && !STUDENT_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      router.push("/dashboard/grade");
      return;
    }
    if (!isStudent && pathname.startsWith("/dashboard/grade")) {
      router.push("/dashboard");
      return;
    }
    setIsLoading(false);
  }, [router, pathname, isStudent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto p-2 md:p-4 ml-16 md:ml-64">
        {children}
      </main>
    </div>
  );
}
