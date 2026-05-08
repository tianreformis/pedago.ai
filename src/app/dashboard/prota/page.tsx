"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface ProtaData {
  id: string;
  mataPelajaran: string;
  fase: string;
  kelas: string[];
  sekolah: string | null;
  namaGuru: string | null;
  tahunAjaran: string | null;
  createdAt: string;
}

export default function DashboardProtaPage() {
  const router = useRouter();
  const [protas, setProtas] = useState<ProtaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProtas = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/prota", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setProtas(data.data as ProtaData[]);
          if (data.user) {
            setUser(data.user as { name: string });
          }
        }
      } catch (error) {
        console.error("Failed to fetch protas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtas();
  }, [router]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/prota/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProtas(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete prota:", error);
    } finally {
      setIsDeleting(null);
      setDeleteTarget(null);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const totalPages = Math.ceil(protas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProtas = protas.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prota Saya</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {user?.name ? `Halo, ${user.name}` : "Kelola Program Tahunan Anda"}
          </p>
        </div>
        <Link
          href="/generate-prota"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Buat Prota Baru
        </Link>
      </div>

      {protas.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Belum Ada Program Tahunan
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Mulai buat Program Tahunan pertama Anda
          </p>
          <Link
            href="/generate-prota"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Buat Prota Baru
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProtas.map((prota) => (
              <div
                key={prota.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 text-white">
                  <h3 className="font-bold text-lg">{prota.mataPelajaran}</h3>
                  <p className="text-emerald-100 text-sm">{prota.fase}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 w-20">Kelas:</span>
                    <span className="text-gray-900 dark:text-white">{prota.kelas.join(", ")}</span>
                  </div>
                  {prota.tahunAjaran && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-20">Tahun:</span>
                      <span className="text-gray-900 dark:text-white">{prota.tahunAjaran}</span>
                    </div>
                  )}
                  {prota.namaGuru && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-20">Guru:</span>
                      <span className="text-gray-900 dark:text-white">{prota.namaGuru}</span>
                    </div>
                  )}
                  {prota.sekolah && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-20">Sekolah:</span>
                      <span className="text-gray-900 dark:text-white">{prota.sekolah}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
                    {new Date(prota.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                  </p>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <Link
                    href={`/dashboard-prota/${prota.id}`}
                    className="flex-1 text-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Lihat
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(prota.id)}
                    disabled={isDeleting === prota.id}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
        title="Hapus Program Tahunan?"
        message="Tindakan ini tidak dapat dibatalkan. Prota yang dihapus akan hilang permanen."
        confirmLabel="Hapus"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={!!isDeleting}
      />
    </div>
  );
}