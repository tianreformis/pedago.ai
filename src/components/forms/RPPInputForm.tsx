"use client";

import { useState, useEffect } from "react";

interface Capaian {
  id: string;
  nama: string;
  deskripsi: string;
}

interface Fase {
  id: string;
  nama: string;
  keterangan: string | null;
  capaianPembelajarans: Capaian[];
}

interface MataPelajaran {
  id: string;
  nama: string;
  fases: Fase[];
}

interface RPPFormData {
  mataPelajaran: string;
  fase: string;
  cp: string;
  cpLainnya: string;
  kelas: string;
  namaGuru: string;
  sekolah: string;
  tahunAjaran: string;
  semester: string;
  alokasWaktu: string;
  faseKeterangan?: string | null;
}

interface RPPInputFormProps {
  onGenerate: (formData: RPPFormData) => void;
  isLoading: boolean;
}

export default function RPPInputForm({ onGenerate, isLoading }: RPPInputFormProps) {
  const [mounted, setMounted] = useState(false);
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([]);
  const [cpOptions, setCpOptions] = useState<Capaian[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [form, setForm] = useState({
    mataPelajaran: "",
    fase: "",
    cp: "",
    cpLainnya: "",
    kelas: "",
    namaGuru: "",
    sekolah: "",
    tahunAjaran: "2025/2026",
    semester: "1",
    alokasWaktu: "2 x 45 menit",
  });

  const showCpLainnya = form.cp === "___lainnya___";

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
    if (form.mataPelajaran && form.fase) {
      const mapel = mataPelajaranList.find(m => m.id === form.mataPelajaran);
      const fase = mapel?.fases.find(f => f.id === form.fase);
      setCpOptions(fase?.capaianPembelajarans || []);
    } else {
      setCpOptions([]);
    }
  }, [form.mataPelajaran, form.fase, mataPelajaranList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mataPelajaran") {
      setForm(prev => ({ ...prev, mataPelajaran: value, fase: "", cp: "" }));
    } else if (name === "fase") {
      setForm(prev => ({ ...prev, fase: value, cp: "" }));
    } else if (name === "cpLainnya") {
      setForm(prev => ({ ...prev, cpLainnya: value }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mataPelajaran || !form.fase) return;
    
    const selectedMapel = mataPelajaranList.find(m => m.id === form.mataPelajaran);
    const selectedFase = selectedMapel?.fases.find(f => f.id === form.fase);
    
    let cpValue = form.cp;
    if (form.cp === "___lainnya___" && form.cpLainnya) {
      cpValue = form.cpLainnya;
    }
    
    if (!cpValue) return;
    
    onGenerate({
      ...form,
      cp: cpValue,
      mataPelajaran: selectedMapel?.nama || form.mataPelajaran,
      fase: selectedFase?.nama || form.fase,
      faseKeterangan: selectedFase?.keterangan || null,
    });
  };

  if (!mounted) {
    return null;
  }

  const canSubmit = !isLoading && Boolean(form.mataPelajaran) && Boolean(form.fase) && (
    form.cp === "___lainnya___"
      ? Boolean(form.cpLainnya && form.cpLainnya.trim())
      : Boolean(form.cp)
  );

  const selectedMapel = mataPelajaranList.find(m => m.id === form.mataPelajaran);

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

        {(cpOptions.length > 0 || showCpLainnya) && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
              Capaian Pembelajaran (CP) <span className="text-red-500">*</span>
            </label>
            <select
              name="cp"
              value={form.cp}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Pilih Capaian Pembelajaran —</option>
              {cpOptions.map((cp) => (
                <option key={cp.id} value={`${cp.nama}: ${cp.deskripsi}`}>{cp.nama}: {cp.deskripsi}</option>
              ))}
              <option value="___lainnya___">Lainnya (buat sendiri)</option>
            </select>
          </div>
        )}

        {showCpLainnya && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
              Tulis Capaian Pembelajaran <span className="text-red-500">*</span>
            </label>
            <textarea
              name="cpLainnya"
              value={form.cpLainnya}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Tuliskan Capaian Pembelajaran yang Anda ingin ajarkan..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

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
          disabled={canSubmit ? false : true}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {isLoading ? "⏳ Sedang membuat RPP..." : "✨ Generate RPP Pembelajaran Mendalam"}
        </button>
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
          * Mata Pelajaran, Fase, dan CP wajib diisi
        </p>
      </div>
    </form>
  );
}