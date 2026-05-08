"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtaOutput } from "@/lib/mistral";
import { ArrowLeft, Trash2, Calendar, FileText } from "lucide-react";

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

  const rawOutput = prota.rawOutput as any;

  const identitas = rawOutput.identitas || {
    satuanPendidikan: prota.sekolah || "-",
    mataPelajaran: prota.mataPelajaran,
    faseKelas: prota.fase,
    tahunPelajaran: prota.tahunAjaran || "",
  };

  const capaianPembelajaran: string[] = rawOutput.capaianPembelajaran || rawOutput.alurPembelajaran?.flatMap((s: any) =>
    s.mingguan?.flatMap((w: any) => w.cp ? [w.cp] : []) || []
  ) || ["CP tidak tersedia"];

  const alokasiWaktu = rawOutput.alokasiWaktu || {
    mingguEfektif: rawOutput.rekapitulasi?.totalMinggu || 34,
    jpPerMinggu: 4,
    totalJpPertahun: (rawOutput.rekapitulasi?.totalMinggu || 34) * 4,
  };

  interface DistribusiItem {
    nomor: number;
    materi: string;
    semester: string;
    alokasiJp: number;
    keterangan: string;
  }
  const distribusiMateri: DistribusiItem[] = rawOutput.distribusiMateri || rawOutput.alurPembelajaran?.flatMap((semester: any, semIdx: number) =>
    semester.mingguan?.map((week: any, weekIdx: number) => ({
      nomor: weekIdx + 1,
      materi: week.topik || "Topik",
      semester: semIdx === 0 ? "Ganjil" : "Genap",
      alokasiJp: 4,
      keterangan: week.cp || "",
    })) || []
  ) || [];

  const kalenderPendidikan = rawOutput.kalenderPendidikan || {
    awalTahunAjaran: "Juli",
    pembagianSemester: "Ganjil: Juli-Desember, Genap: Januari-Juni",
    perkiraanAsesmen: "Tengah semester & Akhir semester",
  };

  const catatan: string[] = rawOutput.catatan || ["Fleksibilitas pembelajaran disesuaikan kondisi peserta", "Integrasi Projek P5 jika relevan"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/dashboard/prota")}
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
          PROGRAM TAHUNAN (PROTA)
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-emerald-100 text-sm">Satuan Pendidikan</p>
            <p className="font-semibold">{identitas.satuanPendidikan}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Mata Pelajaran</p>
            <p className="font-semibold">{identitas.mataPelajaran}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Fase/Kelas</p>
            <p className="font-semibold">{identitas.faseKelas}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Tahun Pelajaran</p>
            <p className="font-semibold">{identitas.tahunPelajaran}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Capaian Pembelajaran</h4>
        <ul className="list-disc list-inside space-y-2">
          {capaianPembelajaran.map((cp, idx) => (
            <li key={idx} className="text-gray-700 dark:text-gray-300">{cp}</li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Alokasi Waktu</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{alokasiWaktu.mingguEfektif}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Minggu Efektif</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">JP per Minggu</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{alokasiWaktu.jpPerMinggu}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">JP</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Total JP/Tahun</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{alokasiWaktu.totalJpPertahun}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">JP</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={20} />
            Distribusi Materi
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-12">No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Materi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-24">Semester</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-24">Alokasi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {distribusiMateri.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.nomor}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.materi}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.semester === "Ganjil"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    }`}>
                      {item.semester}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.alokasiJp} JP</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{item.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Kalender Pendidikan</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Awal Tahun Ajaran</p>
            <p className="font-medium text-gray-900 dark:text-white">{kalenderPendidikan.awalTahunAjaran}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pembagian Semester</p>
            <p className="font-medium text-gray-900 dark:text-white">{kalenderPendidikan.pembagianSemester}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Perkiraan Asesmen</p>
            <p className="font-medium text-gray-900 dark:text-white">{kalenderPendidikan.perkiraanAsesmen}</p>
          </div>
        </div>
      </div>

      {catatan && catatan.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">Catatan</h4>
          <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300 text-sm">
            {catatan.map((cat, idx) => (
              <li key={idx}>{cat}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
        Dibuat pada {new Date(prota.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
      </p>
    </div>
  );
}