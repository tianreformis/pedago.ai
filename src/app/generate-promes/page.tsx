"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromesOutput } from "@/types/promes";
import PromesViewer from "@/components/promes/PromesViewer";
import PromesExportButton from "@/components/promes/PromesExportButton";
import { Save, Loader2, Calendar, ChevronDown } from "lucide-react";

interface ProtaData {
  id: string;
  mataPelajaran: string;
  fase: string;
  kelas: string[];
  sekolah: string | null;
  namaGuru: string | null;
  tahunAjaran: string | null;
  rawOutput: any;
}

const BULAN_GANJIL = ["Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const BULAN_GENAP = ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];
const BULAN_ALL = [...BULAN_GANJIL, ...BULAN_GENAP];

export default function GeneratePromesPage() {
  const router = useRouter();
  const [protas, setProtas] = useState<ProtaData[]>([]);
  const [selectedProta, setSelectedProta] = useState<string>("");
  const [semester, setSemester] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promesOutput, setPromesOutput] = useState<PromesOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showProtaDropdown, setShowProtaDropdown] = useState(false);

  const [mingguEfektif, setMingguEfektif] = useState<Record<string, number>>({});
  const [mingguNonEfektif, setMingguNonEfektif] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProtas(token);
  }, [router]);

  useEffect(() => {
    const currentBulan = semester === "1" ? BULAN_GANJIL : BULAN_GENAP;
    const init: Record<string, number> = {};
    const initNon: Record<string, boolean> = {};
    currentBulan.forEach((b) => {
      init[b] = 4;
      initNon[`${b}-3`] = false;
      initNon[`${b}-4`] = false;
    });
    setMingguEfektif(init);
    setMingguNonEfektif(initNon);
  }, [semester]);

  const fetchProtas = async (token: string) => {
    try {
      const res = await fetch("/api/prota", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProtas(data.data);
      }
    } catch {
      console.error("Failed to fetch protas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProta) {
      setError("Pilih Program Tahunan terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSaved(false);

    const prota = protas.find((p) => p.id === selectedProta);
    if (!prota) {
      setError("Data Prota tidak ditemukan");
      setIsGenerating(false);
      return;
    }

    const currentBulan = semester === "1" ? BULAN_GANJIL : BULAN_GENAP;
    const materiProta = prota.rawOutput?.distribusiMateri?.filter(
      (m: any) => {
        if (semester === "1") return m.semester === "Ganjil" || m.semester === "1";
        return m.semester === "Genap" || m.semester === "2";
      }
    ) || [];

    if (materiProta.length === 0) {
      setError(`Tidak ada materi untuk semester ${semester === "1" ? "Ganjil" : "Genap"} di Prota ini`);
      setIsGenerating(false);
      return;
    }

    const mingguNonEfektifList: Array<{ bulan: string; minggu: string; alasan: string }> = [];
    Object.entries(mingguNonEfektif).forEach(([key, isNonEfektif]) => {
      if (isNonEfektif) {
        const [bulan, mingguNum] = key.split("-");
        if (currentBulan.includes(bulan)) {
          mingguNonEfektifList.push({ bulan, minggu: mingguNum, alasan: "Tidak Efektif" });
        }
      }
    });

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/generate-promes", {
        method: "POST",
        headers,
        body: JSON.stringify({
          mataPelajaran: prota.mataPelajaran,
          fase: prota.fase,
          kelas: prota.kelas.join(", "),
          semester,
          jpPerMinggu: prota.rawOutput?.alokasiWaktu?.jpPerMinggu || 4,
          namaGuru: prota.namaGuru,
          sekolah: prota.sekolah,
          tahunAjaran: prota.tahunAjaran,
          materiProta,
          mingguEfektifBulan: mingguEfektif,
          mingguNonEfektif: mingguNonEfektifList,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setPromesOutput(json.data);
      } else if (json.freeLimitReached) {
        setError(json.error || "Batas penggunaan gratis tercapai.");
      } else {
        setError(json.error || "Gagal generate Promes");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!promesOutput || !selectedProta) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const prota = protas.find((p) => p.id === selectedProta);
      const res = await fetch("/api/promes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mataPelajaran: prota?.mataPelajaran || "",
          fase: prota?.fase || "",
          kelas: prota?.kelas.join(", ") || "",
          namaGuru: prota?.namaGuru,
          sekolah: prota?.sekolah,
          tahunAjaran: prota?.tahunAjaran,
          semester,
          jpPerMinggu: String(prota?.rawOutput?.alokasiWaktu?.jpPerMinggu || 4),
          rawOutput: promesOutput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        router.push(`/dashboard/promes`);
      } else {
        setError(data.error || "Gagal menyimpan Promes");
      }
    } catch {
      setError("Gagal menyimpan Promes");
    } finally {
      setIsSaving(false);
    }
  };

  const updateMingguEfektif = (bulan: string, value: number) => {
    setMingguEfektif((prev) => ({ ...prev, [bulan]: Math.max(0, Math.min(5, value)) }));
  };

  const toggleMingguNonEfektif = (key: string) => {
    setMingguNonEfektif((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedProtaData = protas.find((p) => p.id === selectedProta);
  const currentBulan = semester === "1" ? BULAN_GANJIL : BULAN_GENAP;
  const semesterLabel = semester === "1" ? "Ganjil (Juli - Desember)" : "Genap (Januari - Juni)";

  const tips = [
    "💡 Pilih Prota yang sudah ada, lalu tentukan semester yang ingin dibuat Promes-nya",
    "💡 Atur jumlah minggu efektif per bulan sesuai kalender sekolah Anda",
    "💡 Tandai minggu yang tidak efektif (STS, SAS, Libur) agar tidak terisi materi",
    "💡 AI akan mendistribusikan JP secara otomatis ke minggu-minggu efektif",
  ];
  const [currentTip, setCurrentTip] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const tipInterval = setInterval(() => setCurrentTip((p) => (p + 1) % tips.length), 3000);
      const dotInterval = setInterval(() => setDotCount((p) => (p + 1) % 4), 500);
      return () => {
        clearInterval(tipInterval);
        clearInterval(dotInterval);
      };
    } else {
      setCurrentTip(0);
      setDotCount(0);
    }
  }, [isGenerating]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">
        Generator Program Semester (Promes)
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
        Otomatis dari data Program Tahunan (Prota)
      </p>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">
            Pilih Program Tahunan (Prota) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProtaDropdown(!showProtaDropdown)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 text-left flex items-center justify-between"
            >
              <span className={selectedProtaData ? "" : "text-gray-400"}>
                {selectedProtaData
                  ? `${selectedProtaData.mataPelajaran} — ${selectedProtaData.fase} (${selectedProtaData.kelas.join(", ")})`
                  : "— Pilih Prota —"}
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </button>
            {showProtaDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {protas.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                    Belum ada Prota. <a href="/generate-prota" className="text-purple-600 hover:underline">Buat Prota terlebih dahulu</a>
                  </div>
                ) : (
                  protas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedProta(p.id); setShowProtaDropdown(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-0"
                    >
                      <p className="text-gray-900 dark:text-white text-sm font-medium">{p.mataPelajaran}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{p.fase} — {p.kelas.join(", ")}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
            >
              <option value="1">Semester Ganjil (Juli - Desember)</option>
              <option value="2">Semester Genap (Januari - Juni)</option>
            </select>
          </div>
        </div>

        {selectedProtaData && (
          <div>
            <label className="block text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
              Konfigurasi Minggu Efektif
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentBulan.map((bulan) => (
                <div key={bulan} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{bulan}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Minggu:</span>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={mingguEfektif[bulan] || 4}
                      onChange={(e) => updateMingguEfektif(bulan, parseInt(e.target.value) || 0)}
                      className="w-14 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded px-2 py-1 text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    {Array.from({ length: mingguEfektif[bulan] || 4 }, (_, i) => i + 1).map((w) => {
                      const key = `${bulan}-${w}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mingguNonEfektif[key] || false}
                            onChange={() => toggleMingguNonEfektif(key)}
                            className="rounded"
                          />
                          <span className={mingguNonEfektif[key] ? "text-red-500 line-through" : "text-gray-600 dark:text-gray-300"}>
                            M{w}: {mingguNonEfektif[key] ? "Tidak Efektif" : "Efektif"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedProta}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {isGenerating ? "⏳ Sedang membuat Promes..." : "✨ Generate Promes"}
        </button>
        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          * Pilih Prota dan semester wajib diisi
        </p>
      </div>

      {isGenerating && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin" />
            <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">
              Membuat Promes{".".repeat(dotCount)}
            </span>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 max-w-md mx-auto">
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

      {promesOutput && !isGenerating && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Hasil Promes</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving || saved}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saved ? "Tersimpan" : "Simpan"}
              </button>
              <PromesExportButton output={promesOutput} />
            </div>
          </div>
          <PromesViewer output={promesOutput} />
        </div>
      )}
    </div>
  );
}
