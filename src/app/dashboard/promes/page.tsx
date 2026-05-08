"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Calendar, Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Promes {
  id: string;
  mataPelajaran: string;
  fase: string;
  kelas?: string;
  semester: string;
  tahunAjaran?: string;
  createdAt: string;
  status: string;
}

export default function DashboardPromesPage() {
  const router = useRouter();
  const [promes, setPromes] = useState<Promes[]>([]);
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
    fetchPromes(token);
  }, [router]);

  const fetchPromes = async (token: string) => {
    try {
      const res = await fetch("/api/promes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPromes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch Promes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`/api/promes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromes(promes.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete Promes:", error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(promes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPromes = promes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promes Saya</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Kelola Program Semester yang telah Anda buat
          </p>
        </div>
        <Link
          href="/generate-promes"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Buat Promes Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Memuat...</div>
      ) : promes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Calendar className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada Promes</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai buat Promes pertama Anda dari Prota</p>
          <Link
            href="/generate-promes"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Generate Promes
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPromes.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{p.mataPelajaran}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{p.fase}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.semester === "1"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  }`}>
                    {p.semester === "1" ? "Ganjil" : "Genap"}
                  </span>
                </div>
                {p.kelas && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{p.kelas}</p>
                )}
                {p.tahunAjaran && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{p.tahunAjaran}</p>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Clock size={14} />
                  {new Date(p.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/promes/${p.id}`}
                    className="flex-1 text-center bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Lihat
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(p.id)}
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
        title="Hapus Promes?"
        message="Tindakan ini tidak dapat dibatalkan. Promes yang dihapus akan hilang permanen."
        confirmLabel="Hapus"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
