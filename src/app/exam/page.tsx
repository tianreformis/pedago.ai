"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, ArrowRight } from "lucide-react";

export default function ExamPublicPage() {
  const router = useRouter();
  const [kode, setKode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim()) { setError("Masukkan kode ujian"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/exam/public/${kode.trim().toUpperCase()}`);
      const data = await res.json();

      if (data.success) {
        if (!data.data.isAvailable) {
          setError("Ujian belum dimulai atau sudah berakhir");
          return;
        }
        router.push(`/exam/${kode.trim().toUpperCase()}`);
      } else {
        setError(data.error || "Kode ujian tidak ditemukan");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Masuk Ujian</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Masukkan kode ujian yang diberikan guru Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Ujian</label>
            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value.toUpperCase())}
              placeholder="Contoh: ABC123"
              className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Masuk Ujian"}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
