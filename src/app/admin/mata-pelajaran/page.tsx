"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Save, X, ChevronDown } from "lucide-react";

interface Capaian {
  id?: string;
  nama: string;
  deskripsi: string;
}

interface Fase {
  id?: string;
  nama: string;
  keterangan: string | null;
  capaianPembelajarans: Capaian[];
}

interface MataPelajaran {
  id?: string;
  nama: string;
  fases: Fase[];
}

export default function AdminMataPelajaranPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([]);
  const [expandedMapel, setExpandedMapel] = useState<string | null>(null);
  const [expandedFase, setExpandedFase] = useState<string | null>(null);
  const [editingMapel, setEditingMapel] = useState<string | null>(null);
  const [editingFase, setEditingFase] = useState<string | null>(null);
  const [newMapelNama, setNewMapelNama] = useState("");
  const [newFaseNama, setNewFaseNama] = useState("");
  const [newFaseKeterangan, setNewFaseKeterangan] = useState("");
  const [newCpNama, setNewCpNama] = useState("");
  const [newCpDeskripsi, setNewCpDeskripsi] = useState("");
  const [addingMapel, setAddingMapel] = useState(false);
  const [addingFase, setAddingFase] = useState<string | null>(null);
  const [addingCp, setAddingCp] = useState<string | null>(null);

  useEffect(() => {
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
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMapel = async () => {
    if (!newMapelNama.trim()) return;
    try {
      await fetch("/api/admin/mata-pelajaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: newMapelNama }),
      });
      setNewMapelNama("");
      setAddingMapel(false);
      fetchData();
    } catch (error) {
      console.error("Failed to add:", error);
    }
  };

  const handleDeleteMapel = async (id: string) => {
    if (!confirm("Yakin ingin menghapus mata pelajaran ini?")) return;
    try {
      await fetch(`/api/admin/mata-pelajaran/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleAddFase = async (mapelId: string) => {
    if (!newFaseNama.trim()) return;
    try {
      await fetch("/api/admin/mata-pelajaran/fase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: newFaseNama, keterangan: newFaseKeterangan, mataPelajaranId: mapelId }),
      });
      setNewFaseNama("");
      setNewFaseKeterangan("");
      setAddingFase(null);
      fetchData();
    } catch (error) {
      console.error("Failed to add fase:", error);
    }
  };

  const handleDeleteFase = async (id: string) => {
    if (!confirm("Yakin ingin menghapus fase ini?")) return;
    try {
      await fetch(`/api/admin/mata-pelajaran/fase/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete fase:", error);
    }
  };

  const handleAddCp = async (faseId: string) => {
    if (!newCpNama.trim() || !newCpDeskripsi.trim()) return;
    try {
      await fetch("/api/admin/mata-pelajaran/cp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: newCpNama, deskripsi: newCpDeskripsi, faseId }),
      });
      setNewCpNama("");
      setNewCpDeskripsi("");
      setAddingCp(null);
      fetchData();
    } catch (error) {
      console.error("Failed to add CP:", error);
    }
  };

  const handleDeleteCp = async (id: string) => {
    if (!confirm("Yakin ingin menghapus CP ini?")) return;
    try {
      await fetch(`/api/admin/mata-pelajaran/cp/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete CP:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Data Kurikulum</h1>
          <p className="text-gray-500 dark:text-gray-400">Mata Pelajaran, Fase, dan Capaian Pembelajaran</p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
        >
          Kembali
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setAddingMapel(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Tambah Mata Pelajaran
          </button>
        </div>

        {addingMapel && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={newMapelNama}
                onChange={(e) => setNewMapelNama(e.target.value)}
                placeholder="Nama Mata Pelajaran"
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
              />
              <button
                onClick={handleAddMapel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <Save size={18} />
              </button>
              <button
                onClick={() => { setAddingMapel(false); setNewMapelNama(""); }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {mataPelajaranList.map((mapel) => (
          <div key={mapel.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
              onClick={() => setExpandedMapel(expandedMapel === mapel.id ? null : mapel.id)}
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedMapel === mapel.id ? "rotate-180" : ""}`}
                />
                <span className="font-semibold text-gray-900 dark:text-white">{mapel.nama}</span>
                <span className="text-sm text-gray-500">({mapel.fases.length} fase)</span>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setAddingFase(mapel.id!)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleDeleteMapel(mapel.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {expandedMapel === mapel.id && (
              <div className="p-4 space-y-3">
                {addingFase === mapel.id && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-2">
                    <input
                      type="text"
                      value={newFaseNama}
                      onChange={(e) => setNewFaseNama(e.target.value)}
                      placeholder="Nama Fase (misal: Fase A)"
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      value={newFaseKeterangan}
                      onChange={(e) => setNewFaseKeterangan(e.target.value)}
                      placeholder="Keterangan (misal: Kelas 1 & 2 SD/MI)"
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleAddFase(mapel.id!)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => { setAddingFase(null); setNewFaseNama(""); setNewFaseKeterangan(""); }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {mapel.fases.map((fase) => (
                  <div key={fase.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedFase(expandedFase === fase.id ? null : fase.id)}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${expandedFase === fase.id ? "rotate-180" : ""}`}
                        />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{fase.nama}</span>
                        {fase.keterangan && (
                          <span className="text-sm text-gray-500">— {fase.keterangan}</span>
                        )}
                        <span className="text-sm text-gray-500">({fase.capaianPembelajarans.length} CP)</span>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setAddingCp(fase.id!)}
                          className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFase(fase.id!)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedFase === fase.id && (
                      <div className="mt-3 space-y-2">
                        {addingCp === fase.id && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-2">
                            <input
                              type="text"
                              value={newCpNama}
                              onChange={(e) => setNewCpNama(e.target.value)}
                              placeholder="Nama CP (misal: Menyimak)"
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm"
                            />
                            <textarea
                              value={newCpDeskripsi}
                              onChange={(e) => setNewCpDeskripsi(e.target.value)}
                              placeholder="Deskripsi Capaian Pembelajaran"
                              rows={2}
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleAddCp(fase.id!)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => { setAddingCp(null); setNewCpNama(""); setNewCpDeskripsi(""); }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        )}

                        {fase.capaianPembelajarans.map((cp) => (
                          <div
                            key={cp.id}
                            className="flex items-start justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-blue-800 dark:text-blue-200 text-sm">{cp.nama}</p>
                              <p className="text-blue-600 dark:text-blue-300 text-xs">{cp.deskripsi}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteCp(cp.id!)}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {fase.capaianPembelajarans.length === 0 && (
                          <p className="text-gray-500 text-sm text-center py-2">Belum ada Capaian Pembelajaran</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {mapel.fases.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-2">Belum ada Fase</p>
                )}
              </div>
            )}
          </div>
        ))}

        {mataPelajaranList.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500">Belum ada data Mata Pelajaran</p>
          </div>
        )}
      </div>
    </div>
  );
}