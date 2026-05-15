"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, X, Sparkles, Loader2, Users, Check, HelpCircle, ListChecks } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Choice {
  label: string;
  teks: string;
}

interface Question {
  id: string;
  pertanyaan: string;
  point: number;
  jenis: string;
  kunciJawaban: Record<string, unknown> | null;
  choices: Choice[];
  createdAt: string;
}

interface Exam {
  id: string;
  judul: string;
  mataPelajaran: string;
  kodeUjian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  questions: Question[];
  _count: { students: number };
}

const JENIS_OPTIONS = [
  { value: "essay", label: "Essay", icon: HelpCircle },
  { value: "pilihan_ganda", label: "Pilihan Ganda", icon: Check },
  { value: "multiple_answer", label: "Multiple Answer", icon: ListChecks },
];

const LABELS = ["a", "b", "c", "d", "e"];

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [qForm, setQForm] = useState({
    pertanyaan: "",
    point: "10",
    jenis: "essay" as string,
    choices: [] as { label: string; teks: string }[],
    kunciJawaban: null as Record<string, unknown> | null,
  });
  const [qError, setQError] = useState("");
  const [isSavingQ, setIsSavingQ] = useState(false);

  const [deleteQTarget, setDeleteQTarget] = useState<string | null>(null);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({ jumlah: "5", materi: "", jenis: "essay" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchExam(token);
  }, [id, router]);

  const fetchExam = async (token: string) => {
    try {
      const res = await fetch(`/api/exam/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setExam(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const getJenisIcon = (jenis: string) => {
    const opt = JENIS_OPTIONS.find((o) => o.value === jenis);
    return opt?.icon || HelpCircle;
  };

  const getJenisLabel = (jenis: string) => {
    const opt = JENIS_OPTIONS.find((o) => o.value === jenis);
    return opt?.label || jenis;
  };

  const initChoices = (jenis: string) => {
    if (jenis === "essay") return [];
    return LABELS.slice(0, 4).map((l) => ({ label: l, teks: "" }));
  };

  const openAddQuestion = () => {
    setEditQuestion(null);
    setQForm({
      pertanyaan: "",
      point: "10",
      jenis: "essay",
      choices: [],
      kunciJawaban: null,
    });
    setQError("");
    setShowQuestionModal(true);
  };

  const openEditQuestion = (q: Question) => {
    setEditQuestion(q);
    setQForm({
      pertanyaan: q.pertanyaan,
      point: String(q.point),
      jenis: q.jenis,
      choices: q.choices?.length > 0 ? q.choices.map((c) => ({ label: c.label, teks: c.teks })) : [],
      kunciJawaban: q.kunciJawaban,
    });
    setQError("");
    setShowQuestionModal(true);
  };

  const handleJenisChange = (jenis: string) => {
    setQForm((prev) => ({
      ...prev,
      jenis,
      choices: jenis === "essay" ? [] : (prev.choices.length > 0 ? prev.choices : initChoices(jenis)),
      kunciJawaban: null,
    }));
  };

  const handleChoiceChange = (label: string, teks: string) => {
    setQForm((prev) => ({
      ...prev,
      choices: prev.choices.map((c) => (c.label === label ? { ...c, teks } : c)),
    }));
  };

  const addChoice = () => {
    if (qForm.choices.length >= 5) return;
    const nextLabel = LABELS[qForm.choices.length];
    setQForm((prev) => ({ ...prev, choices: [...prev.choices, { label: nextLabel, teks: "" }] }));
  };

  const removeChoice = (label: string) => {
    if (qForm.choices.length <= 2) return;
    const newChoices = qForm.choices.filter((c) => c.label !== label).map((c, i) => ({ ...c, label: LABELS[i] }));
    setQForm((prev) => ({
      ...prev,
      choices: newChoices,
      kunciJawaban: null,
    }));
  };

  const setKunciPilihanGanda = (label: string) => {
    setQForm((prev) => ({ ...prev, kunciJawaban: { pilihan: label } }));
  };

  const toggleKunciMultiple = (label: string) => {
    const current = (qForm.kunciJawaban as { pilihan?: string[] })?.pilihan || [];
    const newPilihan = current.includes(label)
      ? current.filter((l: string) => l !== label)
      : [...current, label];
    setQForm((prev) => ({ ...prev, kunciJawaban: { pilihan: newPilihan } }));
  };

  const validateForm = (): string | null => {
    if (!qForm.pertanyaan.trim()) return "Pertanyaan tidak boleh kosong";
    const point = parseInt(qForm.point);
    if (!point || point < 1) return "Point harus minimal 1";

    if (qForm.jenis === "pilihan_ganda" || qForm.jenis === "multiple_answer") {
      const emptyChoice = qForm.choices.find((c) => !c.teks.trim());
      if (emptyChoice) return `Pilihan ${emptyChoice.label.toUpperCase()} tidak boleh kosong`;
      if (qForm.choices.length < 2) return "Minimal 2 pilihan jawaban";

      if (qForm.jenis === "pilihan_ganda") {
        if (!qForm.kunciJawaban || !(qForm.kunciJawaban as { pilihan?: string }).pilihan) {
          return "Tentukan jawaban benar terlebih dahulu";
        }
      } else {
        if (!qForm.kunciJawaban || !(qForm.kunciJawaban as { pilihan?: string[] }).pilihan?.length) {
          return "Tentukan minimal satu jawaban benar";
        }
      }
    }

    return null;
  };

  const handleSaveQuestion = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const error = validateForm();
    if (error) { setQError(error); return; }

    setIsSavingQ(true);
    setQError("");

    const body: Record<string, unknown> = {
      pertanyaan: qForm.pertanyaan.trim(),
      point: parseInt(qForm.point),
      jenis: qForm.jenis,
      kunciJawaban: qForm.kunciJawaban,
    };
    if (qForm.jenis !== "essay") {
      body.choices = qForm.choices.filter((c) => c.teks.trim());
    }

    try {
      if (editQuestion) {
        const res = await fetch(`/api/exam/${id}/questions/${editQuestion.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && exam) {
          setExam({ ...exam, questions: exam.questions.map((q) => (q.id === editQuestion.id ? data.data : q)) });
          setShowQuestionModal(false);
        } else setQError(data.error);
      } else {
        const res = await fetch(`/api/exam/${id}/questions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && exam) {
          setExam({ ...exam, questions: [...exam.questions, data.data] });
          setShowQuestionModal(false);
        } else setQError(data.error);
      }
    } catch { setQError("Gagal menyimpan"); }
    finally { setIsSavingQ(false); }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteQTarget) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`/api/exam/${id}/questions/${deleteQTarget}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (exam) {
        setExam({ ...exam, questions: exam.questions.filter((q) => q.id !== deleteQTarget) });
      }
    } catch (e) { console.error(e); }
    finally { setDeleteQTarget(null); }
  };

  const handleGenerate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsGenerating(true);
    setGenError("");

    try {
      const res = await fetch(`/api/exam/${id}/generate-questions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(generateForm),
      });
      const data = await res.json();
      if (data.success && exam) {
        setExam({ ...exam, questions: [...exam.questions, ...data.data] });
        setShowGenerateModal(false);
      } else setGenError(data.error || "Gagal generate");
    } catch { setGenError("Gagal generate"); }
    finally { setIsGenerating(false); }
  };

  if (isLoading) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Memuat...</div>;
  if (!exam) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Ujian tidak ditemukan</div>;

  const totalPoint = exam.questions.reduce((sum, q) => sum + q.point, 0);

  const JenisIcon = qForm.jenis === "essay" ? HelpCircle : qForm.jenis === "pilihan_ganda" ? Check : ListChecks;
  const kunciPilihan = (qForm.kunciJawaban as { pilihan?: string | string[] })?.pilihan;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/dashboard/exam" className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 text-sm">
        <ArrowLeft size={16} /> Kembali
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{exam.judul}</h1>
            <p className="text-gray-500 dark:text-gray-400">{exam.mataPelajaran}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Kode Ujian</p>
            <code className="text-lg font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-blue-600 dark:text-blue-400">{exam.kodeUjian}</code>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Mulai: </span>
            {new Date(exam.tanggalMulai).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Selesai: </span>
            {new Date(exam.tanggalSelesai).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
          <div><span className="font-medium text-gray-700 dark:text-gray-300">Soal: </span>{exam.questions.length}</div>
          <div><span className="font-medium text-gray-700 dark:text-gray-300">Peserta: </span>{exam._count.students}</div>
          <div><span className="font-medium text-gray-700 dark:text-gray-300">Total Point: </span>{totalPoint}</div>
          {exam._count.students > 0 && (
            <Link
              href={`/dashboard/exam/${exam.id}/monitoring`}
              className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Users size={14} /> Monitoring
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daftar Soal</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowGenerateModal(true); setGenError(""); setGenerateForm((p) => ({ ...p, jenis: "essay" })); }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles size={16} />
            Generate AI
          </button>
          <button
            onClick={openAddQuestion}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Tambah Soal
          </button>
        </div>
      </div>

      {exam.questions.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Belum ada soal. Tambah soal manual atau generate dengan AI.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exam.questions.map((q, i) => {
            const QIcon = getJenisIcon(q.jenis);
            const kunci = q.kunciJawaban as { pilihan?: string | string[]; text?: string } | null;
            return (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <QIcon size={12} /> {getJenisLabel(q.jenis)}
                      </span>
                      <span className="text-xs text-gray-400">Point: {q.point}</span>
                    </div>
                    <p className="text-gray-900 dark:text-white">{q.pertanyaan}</p>
                    {q.choices?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {q.choices.map((c) => {
                          const isCorrect = kunci?.pilihan
                            ? Array.isArray(kunci.pilihan)
                              ? kunci.pilihan.includes(c.label)
                              : kunci.pilihan === c.label
                            : false;
                          return (
                            <div key={c.label} className={`flex items-center gap-2 text-sm px-2 py-0.5 rounded ${isCorrect ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
                              <span className="font-mono w-4">{c.label.toUpperCase()}.</span>
                              <span>{c.teks}</span>
                              {isCorrect && <Check size={12} className="text-green-500 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {q.jenis === "essay" && kunci?.text && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Kunci: {kunci.text}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEditQuestion(q)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteQTarget(q.id)} className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteQTarget}
        title="Hapus Soal?"
        message="Soal ini akan dihapus permanen."
        confirmLabel="Hapus"
        onConfirm={handleDeleteQuestion}
        onCancel={() => setDeleteQTarget(null)}
      />

      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQuestionModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editQuestion ? "Edit Soal" : "Tambah Soal"}
              </h3>
              <button onClick={() => setShowQuestionModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Soal</label>
                <div className="grid grid-cols-3 gap-2">
                  {JENIS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleJenisChange(opt.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${qForm.jenis === opt.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                      >
                        <Icon size={16} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pertanyaan</label>
                <textarea
                  value={qForm.pertanyaan}
                  onChange={(e) => setQForm({ ...qForm, pertanyaan: e.target.value })}
                  rows={3}
                  placeholder="Tulis pertanyaan..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Point</label>
                <input
                  type="number"
                  value={qForm.point}
                  onChange={(e) => setQForm({ ...qForm, point: e.target.value })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {(qForm.jenis === "pilihan_ganda" || qForm.jenis === "multiple_answer") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pilihan Jawaban
                    {qForm.jenis === "pilihan_ganda" && <span className="text-gray-400 font-normal ml-1">(pilih satu jawaban benar)</span>}
                    {qForm.jenis === "multiple_answer" && <span className="text-gray-400 font-normal ml-1">(bisa lebih dari satu jawaban benar)</span>}
                  </label>
                  <div className="space-y-2">
                    {qForm.choices.map((c) => {
                      const isKunciPilihanGanda = qForm.jenis === "pilihan_ganda" && kunciPilihan === c.label;
                      const isKunciMultiple = qForm.jenis === "multiple_answer" && Array.isArray(kunciPilihan) && kunciPilihan.includes(c.label);
                      return (
                        <div key={c.label} className={`flex items-center gap-2 p-2 rounded-lg border ${isKunciPilihanGanda || isKunciMultiple ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-600"}`}>
                          <span className="font-mono text-sm font-bold text-gray-500 w-5">{c.label.toUpperCase()}</span>
                          <input
                            type="text"
                            value={c.teks}
                            onChange={(e) => handleChoiceChange(c.label, e.target.value)}
                            placeholder={`Pilihan ${c.label.toUpperCase()}`}
                            className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {qForm.jenis === "pilihan_ganda" && (
                            <button
                              type="button"
                              onClick={() => setKunciPilihanGanda(c.label)}
                              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${isKunciPilihanGanda ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-green-100 dark:hover:bg-green-900/30"}`}
                              title="Tandai sebagai jawaban benar"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {qForm.jenis === "multiple_answer" && (
                            <button
                              type="button"
                              onClick={() => toggleKunciMultiple(c.label)}
                              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${isKunciMultiple ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-green-100 dark:hover:bg-green-900/30"}`}
                              title="Toggle jawaban benar"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {qForm.choices.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeChoice(c.label)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {qForm.choices.length < 5 && (
                    <button
                      type="button"
                      onClick={addChoice}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus size={14} /> Tambah pilihan
                    </button>
                  )}
                </div>
              )}

              {qForm.jenis === "essay" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kunci Jawaban <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    value={(qForm.kunciJawaban as { text?: string })?.text || ""}
                    onChange={(e) => setQForm({ ...qForm, kunciJawaban: { text: e.target.value } })}
                    rows={2}
                    placeholder="Jawaban yang diharapkan..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {qError && <p className="text-sm text-red-600 dark:text-red-400">{qError}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowQuestionModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Batal
                </button>
                <button
                  onClick={handleSaveQuestion}
                  disabled={isSavingQ}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isSavingQ ? "Menyimpan..." : editQuestion ? "Simpan" : "Tambah"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGenerateModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generate Soal dengan AI</h3>
              <button onClick={() => setShowGenerateModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Soal</label>
                <div className="grid grid-cols-3 gap-2">
                  {JENIS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGenerateForm({ ...generateForm, jenis: opt.value })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${generateForm.jenis === opt.value ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                      >
                        <Icon size={16} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah Soal</label>
                <input
                  type="number"
                  value={generateForm.jumlah}
                  onChange={(e) => setGenerateForm({ ...generateForm, jumlah: e.target.value })}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Materi (opsional)</label>
                <input
                  type="text"
                  value={generateForm.materi}
                  onChange={(e) => setGenerateForm({ ...generateForm, materi: e.target.value })}
                  placeholder="Contoh: Sistem Pencernaan Manusia"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {genError && <p className="text-sm text-red-600 dark:text-red-400">{genError}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Batal
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
