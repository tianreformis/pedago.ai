"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("studentData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStudentName(data.nama || data.email || "");
      } catch {}
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/student/logout", { method: "POST" });
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    window.location.href = "/exam";
  };

  const navLinks = [
    { href: "/student/exam", label: "Hasil Ujian", icon: ClipboardList },
  ];

  const isExamPage = pathname === "/student/exam";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isExamPage && (
        <nav className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/student/exam" className="font-bold text-lg">PedagoAI - Siswa</Link>
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-white/20" : "hover:bg-white/10"}`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {studentName && <span className="text-sm text-blue-200 hidden md:block">{studentName}</span>}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
