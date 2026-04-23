"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtaOutput } from "@/lib/mistral";
import { ArrowLeft, Trash2, Calendar } from "lucide-react";

interface ProtaData {
  id: string;
  mataPelajaran: string;
  fase: string;
  kelas: string[];
  sekolah: string | null;
  namaGuru: string | null;
  tahunAjaran: string | null;
  rawOutput: ProtaOutput;
  createdAt: string;
}

export default function DashboardProtaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [prota, setProta] = useState<ProtaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProta = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/prota/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setProta(data.data as ProtaData);
        } else {
          setError("Prota tidak ditemukan");
        }
      } catch {
        setError("Gagal memuat Prota");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProta();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus Program Tahunan ini?")) return;

    setIsDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/prota/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard-prota");
      } else {
        setError(data.error || "Gagal menghapus Prota");
      }
    } catch {
      setError("Gagal menghapus Prota");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !prota) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error || "Prota tidak ditemukan"}</p>
        <button
          onClick={() => router.push("/dashboard-prota")}
          className="text-emerald-600 hover:underline"
        >
          Kembali ke Dashboard Prota
        </button>
      </div>
    );
  }

  const { informasiUmum, alurPembelajaran, rekapitulasi } = prota.rawOutput;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/dashboard-prota")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
          Hapus
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={28} />
          Program Tahunan (Prota)
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-emerald-100 text-sm">Mata Pelajaran</p>
            <p className="font-semibold">{informasiUmum.mataPelajaran}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Fase</p>
            <p className="font-semibold">{informasiUmum.fase}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Tahun Ajaran</p>
            <p className="font-semibold">{informasiUmum.tahunAjaran}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Kelas</p>
            <p className="font-semibold">{informasiUmum.kelas.join(", ")}</p>
          </div>
          {informasiUmum.namaGuru && (
            <div>
              <p className="text-emerald-100 text-sm">Guru</p>
              <p className="font-semibold">{informasiUmum.namaGuru}</p>
            </div>
          )}
          {informasiUmum.sekolah && (
            <div>
              <p className="text-emerald-100 text-sm">Sekolah</p>
              <p className="font-semibold">{informasiUmum.sekolah}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white">Alur Pembelajaran Per Semester</h4>
        </div>

        {alurPembelajaran.map((semester, semIdx) => (
          <div key={semIdx} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-blue-700 dark:text-blue-300">{semester.semester}</h5>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-12">Mg</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Topik</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Capaian Pembelajaran</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Alokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {semester.mingguan.map((week, weekIdx) => (
                    <tr key={weekIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{week.minggu}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{week.topik}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{week.cp}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{week.alokasWaktu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {rekapitulasi && (
        <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Rekapitulasi</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Minggu</span>
              <span className="font-semibold text-gray-900 dark:text-white">{rekapitulasi.totalMinggu} minggu</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Jam</span>
              <span className="font-semibold text-gray-900 dark:text-white">{rekapitulasi.totalJam}</span>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-6">
        Dibuat pada {new Date(prota.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
      </p>
    </div>
  );
}