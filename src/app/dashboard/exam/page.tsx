"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ClipboardList, Clock, Trash2, ChevronLeft, ChevronRight, Pencil, Copy, X } from "lucide-react";
import { toast, Toaster } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const JENJANG_OPTIONS = ["SD", "SMP", "SMA", "SMK"];

function getKelasOptions(jenjang: string): string[] {
  if (jenjang === "SD") return ["1", "2", "3", "4", "5", "6"];
  if (jenjang === "SMP") return ["7", "8", "9"];
  if (jenjang === "SMA" || jenjang === "SMK") return ["10", "11", "12"];
  return [];
}

interface Exam {
  id: string;
  judul: string;
  mataPelajaran: string;
  jenjang?: string | null;
  kelas?: string | null;
  kodeUjian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  createdAt: string;
  _count: { questions: number; students: number };
  user?: { id: string; name: string | null; email: string };
}

interface MataPelajaran {
  id: string;
  nama: string;
}

interface GroupedExams {
  user: { id: string; name: string | null; email: string };
  exams: Exam[];
}

export default function DashboardExamPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [groupedExams, setGroupedExams] = useState<GroupedExams[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<MataPelajaran[]>([]);
  const itemsPerPage = 5;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Exam | null>(null);
  const [form, setForm] = useState({
    mataPelajaran: "",
    jenjang: "",
    kelas: "",
    judul: "",
    tanggalMulai: "",
    tanggalSelesai: "",
  });
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toISO = (dt: string) => dt ? new Date(dt).toISOString() : "";
  const toLocal = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const storedUser = localStorage.getItem("user");
    const admin = storedUser ? (() => { try { return JSON.parse(storedUser).isAdmin === true; } catch { return false; } })() : false;
    setIsAdmin(admin);
    fetchExams(token, admin);
    fetchSubjects();
  }, [router]);

  const fetchExams = async (token: string, admin: boolean) => {
    try {
      const res = await fetch("/api/exam", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (admin) {
          const grouped: Record<string, GroupedExams> = {};
          for (const exam of data.data) {
            const uid = exam.user?.id || "unknown";
            if (!grouped[uid]) {
              grouped[uid] = { user: exam.user || { id: uid, name: null, email: "Unknown" }, exams: [] };
            }
            grouped[uid].exams.push(exam);
          }
          setGroupedExams(Object.values(grouped));
        } else {
          setExams(data.data);
        }
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/mata-pelajaran");
      const data = await res.json();
      if (data.success) setSubjects(data.data);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm({ mataPelajaran: "", jenjang: "", kelas: "", judul: "", tanggalMulai: "", tanggalSelesai: "" });
    setFormError("");
    setShowCreateModal(true);
  };

  const openEdit = (exam: Exam) => {
    setEditTarget(exam);
    setForm({
      mataPelajaran: exam.mataPelajaran,
      jenjang: exam.jenjang || "",
      kelas: exam.kelas || "",
      judul: exam.judul,
      tanggalMulai: toLocal(exam.tanggalMulai),
      tanggalSelesai: toLocal(exam.tanggalSelesai),
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!form.mataPelajaran || !form.judul || !form.tanggalMulai || !form.tanggalSelesai) {
      toast.error("Semua field harus diisi");
      return;
    }

    const mulai = new Date(form.tanggalMulai);
    const selesai = new Date(form.tanggalSelesai);
    if (selesai <= mulai) {
      toast.error("Tanggal selesai harus setelah tanggal mulai");
      return;
    }

    setIsSaving(true);

    const body: Record<string, unknown> = {
      mataPelajaran: form.mataPelajaran,
      judul: form.judul,
      tanggalMulai: toISO(form.tanggalMulai),
      tanggalSelesai: toISO(form.tanggalSelesai),
      jenjang: form.jenjang || null,
      kelas: form.kelas || null,
    };

    try {
      if (editTarget) {
        const res = await fetch(`/api/exam/${editTarget.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          const updated = exams.map((e) => (e.id === editTarget.id ? { ...e, ...data.data } : e));
          setExams(updated);
          if (isAdmin) {
            setGroupedExams(groupedExams.map((g) => ({
              ...g,
              exams: g.exams.map((e) => (e.id === editTarget.id ? { ...e, ...data.data } : e)),
            })));
          }
          setShowCreateModal(false);
          toast.success("Ujian berhasil diperbarui");
        } else {
          toast.error(data.error || "Gagal memperbarui");
        }
      } else {
        const res = await fetch("/api/exam", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          const newExam = data.data;
          setExams([newExam, ...exams]);
          if (isAdmin) {
            const storedUser = localStorage.getItem("user");
            const currentUser = storedUser ? JSON.parse(storedUser) : null;
            const email = currentUser?.email || "unknown";
            const name = currentUser?.name || null;
            let found = false;
            setGroupedExams((prev) => {
              const next = prev.map((g) => {
                if (g.user.email === email) {
                  found = true;
                  return { ...g, exams: [newExam, ...g.exams] };
                }
                return g;
              });
              if (!found) {
                next.unshift({
                  user: { id: currentUser?.id || "unknown", name, email },
                  exams: [newExam],
                });
              }
              return next;
            });
          }
          setCurrentPage(1);
          setShowCreateModal(false);
          toast.success("Ujian berhasil dibuat");
        } else {
          toast.error(data.error || "Gagal membuat ujian");
        }
      }
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`/api/exam/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams((prev) => prev.filter((e) => e.id !== id));
      if (isAdmin) {
        setGroupedExams((prev) =>
          prev
            .map((g) => ({ ...g, exams: g.exams.filter((e) => e.id !== id) }))
            .filter((g) => g.exams.length > 0)
        );
      }
      toast.success("Ujian berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus");
    } finally { setDeleteTarget(null); }
  };

  const copyKode = (kode: string) => {
    navigator.clipboard.writeText(kode);
  };

  const totalPages = Math.ceil(exams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = exams.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-right" richColors />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ujian</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Kelola ujian yang telah Anda buat</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Buat Ujian Baru
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Memuat...</div>
      ) : isAdmin ? (
        groupedExams.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <ClipboardList className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada ujian</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Belum ada guru yang membuat ujian</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedExams.map((group) => (
              <div key={group.user.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    {(group.user.name || group.user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{group.user.name || "Tanpa Nama"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{group.user.email}</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-400 dark:text-gray-500">{group.exams.length} ujian</div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} onEdit={openEdit} onDelete={setDeleteTarget} onCopy={copyKode} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <ClipboardList className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada ujian</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Buat ujian pertama Anda</p>
          <button
            onClick={openCreate}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Buat Ujian
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} onEdit={openEdit} onDelete={setDeleteTarget} onCopy={copyKode} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-4">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Ujian?"
        message="Ujian dan semua soal di dalamnya akan dihapus permanen."
        confirmLabel="Hapus"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editTarget ? "Edit Ujian" : "Buat Ujian Baru"}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mata Pelajaran</label>
                <select
                  value={form.mataPelajaran}
                  onChange={(e) => setForm({ ...form, mataPelajaran: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.nama}>{s.nama}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenjang</label>
                  <select
                    value={form.jenjang}
                    onChange={(e) => setForm({ ...form, jenjang: e.target.value, kelas: "" })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jenjang</option>
                    {JENJANG_OPTIONS.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                  <select
                    value={form.kelas}
                    onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                    disabled={!form.jenjang}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Pilih Kelas</option>
                    {getKelasOptions(form.jenjang).map((k) => (
                      <option key={k} value={k}>Kelas {k}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Ujian</label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Contoh: UTS Semester Genap"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Mulai</label>
                <input
                  type="datetime-local"
                  value={form.tanggalMulai}
                  onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Selesai</label>
                <input
                  type="datetime-local"
                  value={form.tanggalSelesai}
                  onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : editTarget ? "Simpan" : "Buat"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExamCard({ exam, onEdit, onDelete, onCopy }: { exam: Exam; onEdit: (e: Exam) => void; onDelete: (id: string) => void; onCopy: (k: string) => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{exam.judul}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{exam.mataPelajaran}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
          {exam.kodeUjian}
        </code>
        <button onClick={() => onCopy(exam.kodeUjian)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Copy size={14} />
        </button>
      </div>

      <div className="space-y-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          {new Date(exam.tanggalMulai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          {new Date(exam.tanggalSelesai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{exam._count.questions} Soal</span>
        <span>{exam._count.students} Peserta</span>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/exam/${exam.id}`}
          className="flex-1 text-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Kelola
        </Link>
        <button
          onClick={() => onEdit(exam)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(exam.id)}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
