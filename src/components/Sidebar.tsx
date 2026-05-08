"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Calendar, LayoutDashboard, Plus } from "lucide-react";

interface SidebarProps {
  footer?: React.ReactNode;
}

export default function Sidebar({ footer }: SidebarProps) {
  const pathname = usePathname();

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

        <Link
          href="/generate"
          className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
            pathname === "/generate"
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Plus size={18} />
          <span className="hidden md:inline font-medium">Buat RPP</span>
        </Link>

        <Link
          href="/generate-prota"
          className={`flex items-center gap-3 px-2 py-3 md:px-4 rounded-lg transition-colors ${
            pathname === "/generate-prota"
              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Calendar size={18} />
          <span className="hidden md:inline font-medium">Buat Prota</span>
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
          <span className="hidden md:inline font-medium">RPP Saya</span>
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
          <span className="hidden md:inline font-medium">Prota Saya</span>
        </Link>

        {footer}
      </nav>
    </aside>
  );
}
