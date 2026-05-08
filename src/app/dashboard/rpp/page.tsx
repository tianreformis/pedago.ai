"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface RPP {
  id: string;
  mataPelajaran: string;
  fase: string;
  kelas?: string;
  createdAt: string;
  status: string;
}

interface User {
  name?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
}

export default function DashboardRppPage() {
  const router = useRouter();
  const [rpps, setRpps] = useState<RPP[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchRpps(token);
  }, [router]);

  const fetchRpps = async (token: string) => {
    try {
      const res = await fetch("/api/rpp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRpps(data.data);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch RPPs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`/api/rpp?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRpps(rpps.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete RPP:", error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(rpps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRpps = rpps.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RPP Saya</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {user?.subscriptionStatus === "active" && user?.subscriptionExpiry
              ? `Berlangganan aktif hingga ${new Date(user.subscriptionExpiry).toLocaleDateString("id-ID")}`
              : "Kelola RPP yang telah Anda buat"}
          </p>
        </div>
        <Link
          href="/generate"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Buat RPP Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Memuat...</div>
      ) : rpps.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada RPP</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai buat RPP pertama Anda</p>
          <Link
            href="/generate"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Generate RPP
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRpps.map((rpp) => (
              <div key={rpp.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{rpp.mataPelajaran}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rpp.fase}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rpp.status === "final" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                  }`}>
                    {rpp.status === "final" ? "Final" : "Draft"}
                  </span>
                </div>
                {rpp.kelas && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{rpp.kelas}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(rpp.createdAt).toLocaleString("id-ID", { 
                      day: "numeric", 
                      month: "short", 
                      year: "numeric", 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/${rpp.id}`}
                    className="flex-1 text-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Lihat
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(rpp.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus RPP?"
        message="Tindakan ini tidak dapat dibatalkan. RPP yang dihapus akan hilang permanen."
        confirmLabel="Hapus"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}