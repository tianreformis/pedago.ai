"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface Fase {
  id: string;
  nama: string;
  keterangan: string | null;
}

interface MataPelajaran {
  id: string;
  nama: string;
  fases: Fase[];
}

interface ProtaInputFormProps {
  onGenerate: (formData: any) => void;
  isLoading: boolean;
}

export default function ProtaInputForm({ onGenerate, isLoading }: ProtaInputFormProps) {
  const [mounted, setMounted] = useState(false);
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<string[]>([]);
  const [showKelasDropdown, setShowKelasDropdown] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [form, setForm] = useState({
    mataPelajaran: "",
    fase: "",
    namaGuru: "",
    sekolah: "",
    tahunAjaran: "2025/2026",
    jpPerMinggu: "4",
    mingguEfektif: "34",
    cp: "",
    materi: "",
  });

  const kelasByFase: Record<string, string[]> = {
    "Fase A": ["Kelas 1", "Kelas 2"],
    "Fase B": ["Kelas 3", "Kelas 4"],
    "Fase C": ["Kelas 5", "Kelas 6"],
    "Fase D": ["Kelas 7", "Kelas 8", "Kelas 9"],
    "Fase E": ["Kelas 10"],
    "Fase F": ["Kelas 11", "Kelas 12"],
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/mata-pelajaran");
      const json = await res.json();
      if (json.success) {
        setMataPelajaranList(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch mata pelajaran:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    setSelectedKelas([]);
  }, [form.fase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mataPelajaran") {
      setForm(prev => ({ ...prev, mataPelajaran: value, fase: "" }));
    } else if (name === "fase") {
      setForm(prev => ({ ...prev, fase: value }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleKelas = (kelas: string) => {
    setSelectedKelas(prev =>
      prev.includes(kelas)
        ? prev.filter(k => k !== kelas)
        : [...prev, kelas]
    );
  };

  const removeKelas = (kelas: string) => {
    setSelectedKelas(prev => prev.filter(k => k !== kelas));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mataPelajaran || !form.fase || selectedKelas.length === 0) return;

    const selectedMapel = mataPelajaranList.find(m => m.id === form.mataPelajaran);
    const selectedFase = selectedMapel?.fases.find(f => f.id === form.fase);

    onGenerate({
      ...form,
      kelas: selectedKelas,
      mataPelajaran: selectedMapel?.nama || form.mataPelajaran,
      fase: selectedFase?.nama || form.fase,
    });
  };

  if (!mounted) {
    return null;
  }

  const selectedMapel = mataPelajaranList.find(m => m.id === form.mataPelajaran);
  const selectedFase = selectedMapel?.fases.find(f => f.id === form.fase);
  const availableKelas = kelasByFase[selectedFase?.nama || ""] || [];
  const canSubmit = !isLoading && Boolean(form.mataPelajaran) && Boolean(form.fase) && selectedKelas.length > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
            Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <select
            name="mataPelajaran"
            value={form.mataPelajaran}
            onChange={handleChange}
            required
            disabled={isLoadingData}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Pilih Mata Pelajaran —</option>
            {mataPelajaranList.map((m) => (
              <option key={m.id} value={m.id}>{m.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
            Fase <span className="text-red-500">*</span>
          </label>
          <select
            name="fase"
            value={form.fase}
            onChange={handleChange}
            required
            disabled={!form.mataPelajaran || isLoadingData}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Pilih Fase —</option>
            {selectedMapel?.fases.map((f) => (
              <option key={f.id} value={f.id}>{f.nama} — {f.keterangan}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
          Kelas <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowKelasDropdown(!showKelasDropdown)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span className={selectedKelas.length === 0 ? "text-gray-400" : ""}>
              {selectedKelas.length === 0 ? "— Pilih Kelas —" : `${selectedKelas.length} kelas dipilih`}
            </span>
            <Plus size={18} className={`transition-transform ${showKelasDropdown ? "rotate-45" : ""}`} />
          </button>

          {showKelasDropdown && form.fase && availableKelas.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
              {availableKelas.length === 0 ? (
                <div className="px-3 py-2 text-gray-500 text-sm">Pilih fase terlebih dahulu</div>
              ) : (
                availableKelas.map((kelas) => (
                  <button
                    key={kelas}
                    type="button"
                    onClick={() => toggleKelas(kelas)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedKelas.includes(kelas)}
                      onChange={() => {}}
                      className="rounded"
                    />
                    <span className="text-gray-900 dark:text-white">{kelas}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedKelas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedKelas.map((kelas) => (
              <span
                key={kelas}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {kelas}
                <button
                  type="button"
                  onClick={() => removeKelas(kelas)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Nama Guru</label>
          <input
            name="namaGuru"
            value={form.namaGuru}
            onChange={handleChange}
            placeholder="e.g. Ibu Dewi Lestari, S.Pd"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Nama Sekolah</label>
          <input
            name="sekolah"
            value={form.sekolah}
            onChange={handleChange}
            placeholder="e.g. SMP Negeri 1 Banjarmasin"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Tahun Ajaran</label>
          <input
            name="tahunAjaran"
            value={form.tahunAjaran}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">JP per Minggu</label>
          <select
            name="jpPerMinggu"
            value={form.jpPerMinggu}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          >
            <option value="2">2 JP</option>
            <option value="3">3 JP</option>
            <option value="4">4 JP</option>
            <option value="5">5 JP</option>
            <option value="6">6 JP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Minggu Efektif</label>
          <select
            name="mingguEfektif"
            value={form.mingguEfektif}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          >
            <option value="32">32 minggu</option>
            <option value="33">33 minggu</option>
            <option value="34">34 minggu</option>
            <option value="35">35 minggu</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Capaian Pembelajaran (Opsional)</label>
          <textarea
            name="cp"
            value={form.cp}
            onChange={handleChange}
            rows={3}
            placeholder="Tuliskan CP yang ingin dicapai..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Daftar Materi (Opsional)</label>
          <textarea
            name="materi"
            value={form.materi}
            onChange={handleChange}
            rows={3}
            placeholder="Tuliskan materi yang akan dipelajari..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {isLoading ? "⏳ Sedang membuat Prota..." : "✨ Generate Program Tahunan"}
        </button>
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
          * Mata Pelajaran, Fase, dan minimal 1 Kelas wajib diisi
        </p>
      </div>
    </form>
  );
}