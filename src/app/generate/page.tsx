"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RPPInputForm from "@/components/forms/RPPInputForm";
import RPPViewer from "@/components/rpp/RPPViewer";
import RPPExportButton from "@/components/rpp/RPPExportButton";
import { RPPInput, RPPOutput } from "@/types/rpp";
import { Save, Loader2 } from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();
  const [rppOutput, setRppOutput] = useState<RPPOutput | null>(null);
  const [rppInput, setRppInput] = useState<RPPInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (formData: RPPInput) => {
    setIsLoading(true);
    setError(null);
    setRppInput(formData);
    setSaved(false);
    try {
      const res = await fetch("/api/generate-rpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setRppOutput(json.data);
      } else if (json.freeLimitReached) {
        setError(json.error || "Batas penggunaan gratis tercapai.");
      } else {
        setError(json.error || "Gagal generate RPP");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!rppInput || !rppOutput) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/rpp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...rppInput,
          rawOutput: rppOutput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        router.push("/dashboard");
      } else {
        setError(data.error || "Gagal menyimpan RPP");
      }
    } catch {
      setError("Gagal menyimpan RPP");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">
        Generator RPP Pembelajaran Mendalam
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
        Berbasis format resmi Kemendikdasmen Indonesia
      </p>

      <RPPInputForm onGenerate={handleGenerate} isLoading={isLoading} />

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {rppOutput && rppInput && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Hasil RPP</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!!isSaving || !!saved}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saved ? "Tersimpan" : "Simpan"}
              </button>
              <RPPExportButton rppInput={rppInput} rppOutput={rppOutput} />
            </div>
          </div>
          <RPPViewer input={rppInput} output={rppOutput} />
        </div>
      )}
    </div>
  );
}