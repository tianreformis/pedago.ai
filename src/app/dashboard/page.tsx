"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Calendar, Users, Plus } from "lucide-react";

interface Stats {
  rppCount: number;
  protaCount: number;
  userCount?: number;
}

interface User {
  name?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  isAdmin?: boolean;
}

export default function DashboardStatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [rppRes, protaRes, adminRes] = await Promise.all([
          fetch("/api/rpp", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/prota", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [rppData, protaData, adminData] = await Promise.all([
          rppRes.json(),
          protaRes.json(),
          adminRes.json(),
        ]);

        const rppCount = rppData.success ? rppData.data.length : 0;
        const protaCount = protaData.success ? protaData.data.length : 0;
        const userCount = (adminRes.ok && adminData.success) ? adminData.data.length : 0;

        setStats({ rppCount, protaCount, userCount });
        setUser(rppData.user);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const isAdmin = user?.isAdmin === true;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistik</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {user?.subscriptionStatus === "active" && user?.subscriptionExpiry
            ? `Berlangganan aktif hingga ${new Date(user.subscriptionExpiry).toLocaleDateString("id-ID")}`
            : `Halo, ${user?.name || "Selamat datang"}`}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard/rpp"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <FileText className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">RPP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.rppCount || 0}</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/prota"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
              <Calendar className="text-emerald-600 dark:text-emerald-400" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prota</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.protaCount || 0}</p>
            </div>
          </div>
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/user"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Users className="text-purple-600 dark:text-purple-400" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.userCount || 0}</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/rpp"
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium transition-colors"
        >
          <Plus size={24} />
          Buat RPP Baru
        </Link>

        <Link
          href="/dashboard/prota"
          className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-medium transition-colors"
        >
          <Plus size={24} />
          Buat Prota Baru
        </Link>
      </div>
    </div>
  );
}