"use client";

import { useState, useEffect } from "react";
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

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setSaved(false);
    
    let cpValue = formData.cp;
    if (formData.cp === "___lainnya___" && formData.cpLainnya) {
      cpValue = formData.cpLainnya;
    }
    
    const normalizedData = {
      ...formData,
      cp: cpValue,
    };
    setRppInput(normalizedData);
    
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/generate-rpp", {
        method: "POST",
        headers,
        body: JSON.stringify(normalizedData),
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
        router.push(`/dashboard/${data.data.id}`);
      } else {
        setError(data.error || "Gagal menyimpan RPP");
      }
    } catch {
      setError("Gagal menyimpan RPP");
    } finally {
      setIsSaving(false);
    }
  };

  const tips = [
    "💡 RPP Pembelajaran Mendalam menekankan pembelajaran yang bermakna dan berkesan",
    "💡 Gunakan kata kerja operasional sesuai Taksonomi Bloom",
    "💡 Fase A untuk kelas 1-2, Fase B untuk kelas 3-4, Fase C untuk kelas 5-6",
    "💡 Fase D untuk kelas 7-9, Fase E untuk kelas 10, Fase F untuk kelas 11-12",
    "💡 Integrasikan 3 jenis pengetahuan: deklaratif, prosedural, dan kontekstual",
    "💡 8 Dimensi Profil Pelajar Pancasila dalam setiap pembelajaran",
    "💡 Gunakan teknik asesmen sesuai tujuan: AS, FOR, dan OF Learning",
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
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">
        Generator RPP Pembelajaran Mendalam
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
        Berbasis format resmi Kemendikdasmen Indonesia
      </p>

      <RPPInputForm onGenerate={handleGenerate} isLoading={isLoading} />

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Membuat RPP{".".repeat(dotCount)}
            </span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 max-w-md mx-auto">
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

      {rppOutput && rppInput && !isLoading && (
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