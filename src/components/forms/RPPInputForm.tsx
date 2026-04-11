"use client";

import { useState } from "react";

const MATA_PELAJARAN_OPTIONS = [
  "Bahasa Indonesia", "Matematika", "IPA", "IPS", "PKN / PPKN",
  "Bahasa Inggris", "Pendidikan Agama Islam", "Seni Budaya",
  "Pendidikan Jasmani (PJOK)", "Sejarah", "Geografi", "Ekonomi",
  "Biologi", "Fisika", "Kimia", "Sosiologi", "Informatika",
  "Pendidikan Agama Kristen", "Pendidikan Agama Hindu",
  "Pendidikan Agama Buddha", "Pendidikan Agama Konghucu",
];

const FASE_OPTIONS = [
  { value: "Fase A", label: "Fase A — Kelas 1 & 2 SD/MI" },
  { value: "Fase B", label: "Fase B — Kelas 3 & 4 SD/MI" },
  { value: "Fase C", label: "Fase C — Kelas 5 & 6 SD/MI" },
  { value: "Fase D", label: "Fase D — Kelas 7, 8 & 9 SMP/MTs" },
  { value: "Fase E", label: "Fase E — Kelas 10 SMA/SMK/MA" },
  { value: "Fase F", label: "Fase F — Kelas 11 & 12 SMA/SMK/MA" },
];

interface RPPInputFormProps {
  onGenerate: (formData: any) => void;
  isLoading: boolean;
}

export default function RPPInputForm({ onGenerate, isLoading }: RPPInputFormProps) {
  const [form, setForm] = useState({
    mataPelajaran: "",
    fase: "",
    kelas: "",
    namaGuru: "",
    sekolah: "",
    tahunAjaran: "2025/2026",
    semester: "1",
    alokasWaktu: "2 x 45 menit",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mataPelajaran || !form.fase) return;
    onGenerate(form);
  };

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
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Pilih Mata Pelajaran —</option>
            {MATA_PELAJARAN_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
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
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Pilih Fase —</option>
            {FASE_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

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
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Kelas</label>
          <input
            name="kelas"
            value={form.kelas}
            onChange={handleChange}
            placeholder="e.g. Kelas 7A"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Alokasi Waktu</label>
          <input
            name="alokasWaktu"
            value={form.alokasWaktu}
            onChange={handleChange}
            placeholder="e.g. 2 x 45 menit"
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
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Semester</label>
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          >
            <option value="1">Semester 1 (Ganjil)</option>
            <option value="2">Semester 2 (Genap)</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !form.mataPelajaran || !form.fase}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {isLoading ? "⏳ Sedang membuat RPP..." : "✨ Generate RPP Pembelajaran Mendalam"}
        </button>
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
          * Hanya Mata Pelajaran dan Fase yang wajib diisi. Sisanya akan di-generate oleh AI.
        </p>
      </div>
    </form>
  );
}