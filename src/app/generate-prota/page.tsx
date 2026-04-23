"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtaInputForm from "@/components/forms/prota/ProtaInputForm";
import ProtaViewer from "@/components/prota/ProtaViewer";
import ProtaExportButton from "@/components/prota/ProtaExportButton";
import { ProtaOutput } from "@/lib/mistral";
import { Save, Loader2, Calendar } from "lucide-react";

export default function GenerateProtaPage() {
  const router = useRouter();
  const [protaOutput, setProtaOutput] = useState<ProtaOutput | null>(null);
  const [protaInput, setProtaInput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setSaved(false);
    setProtaInput(formData);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/generate-prota", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setProtaOutput(json.data);
      } else if (json.freeLimitReached) {
        setError(json.error || "Batas penggunaan gratis tercapai.");
      } else {
        setError(json.error || "Gagal generate Prota");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!protaInput || !protaOutput) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/prota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...protaInput,
          rawOutput: protaOutput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        router.push(`/dashboard-prota/${data.data.id}`);
      } else {
        setError(data.error || "Gagal menyimpan Prota");
      }
    } catch {
      setError("Gagal menyimpan Prota");
    } finally {
      setIsSaving(false);
    }
  };

  const tips = [
    "Program Tahunan (Prota) menjabarkan Capaian Pembelajaran ke dalam alur pembelajaran sepanjang tahun",
    "Prota membantu guru merencanakan distribusi topik dan alokasi waktu dengan tepat",
    "Pastikan urutan topik memperhatikan prasyarat dan keterkaitan antar materi",
    "Sesuaikan jumlah minggu efektif dengan kalender pendidikan",
    "Gunakan Prota sebagai panduan, bukan ketetapan mutlak",
  ];

  const [currentTip, setCurrentTip] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 3000);
      const dotInterval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 500);
      return () => {
        clearInterval(tipInterval);
        clearInterval(dotInterval);
      };
    } else {
      setCurrentTip(0);
      setDotCount(0);
    }
  }, [isLoading]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="text-emerald-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Generator Program Tahunan
        </h1>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
        Berbasis format resmi Kemendikdasmen Indonesia
      </p>

      <ProtaInputForm onGenerate={handleGenerate} isLoading={isLoading} />

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 rounded-full animate-spin" />
            <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              Membuat Program Tahunan{".".repeat(dotCount)}
            </span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-gray-600 dark:text-gray-300 animate-pulse">
              {tips[currentTip]}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {protaOutput && protaInput && !isLoading && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Hasil Program Tahunan</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!!isSaving || !!saved}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saved ? "Tersimpan" : "Simpan"}
              </button>
              <ProtaExportButton input={protaInput} output={protaOutput} />
            </div>
          </div>
          <ProtaViewer output={protaOutput} />
        </div>
      )}
    </div>
  );
}