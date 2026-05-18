"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Clock, CheckCircle, XCircle, Award, Loader2, X, HelpCircle, ListChecks, ToggleLeft } from "lucide-react";

interface ExamResult {
  examId: string;
  judul: string;
  mataPelajaran: string;
  kodeUjian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  scoreReleased: boolean;
  answerCount: number;
}

interface Choice {
  label: string;
  teks: string;
}

interface QuestionDetail {
  id: string;
  pertanyaan: string;
  point: number;
  jenis: string;
  choices: Choice[];
  kunciJawaban: Record<string, unknown> | null;
  jawabanSiswa: string | null;
  isCorrect: boolean;
}

interface ExamDetail {
  judul: string;
  mataPelajaran: string;
  kodeUjian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  submittedAt: string | null;
  score: number | null;
  scoreReleased: boolean;
  questions: QuestionDetail[];
}

export default function GradePage() {
  const router = useRouter();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [studentInfo, setStudentInfo] = useState({ nama: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState<ExamDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/exam/my-grades", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setResults(data.data.exams);
          setStudentInfo({ nama: data.data.nama, email: data.data.email });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [router]);

  const openDetail = async (examId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/exam/my-grades/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDetail(data.data);
    } catch {}
    finally { setDetailLoading(false); }
  };

  const getJenisIcon = (jenis: string) => {
    if (jenis === "essay") return HelpCircle;
    if (jenis === "pilihan_ganda") return CheckCircle;
    if (jenis === "true_false") return ToggleLeft;
    if (jenis === "multiple_answer") return ListChecks;
    return HelpCircle;
  };

  const getJenisLabel = (jenis: string) => {
    if (jenis === "essay") return "Essay";
    if (jenis === "pilihan_ganda") return "Pilihan Ganda";
    if (jenis === "true_false") return "True/False";
    if (jenis === "multiple_answer") return "Multiple Answer";
    return jenis;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lihat Nilai</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {studentInfo.nama && `${studentInfo.nama} (${studentInfo.email})`}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <ClipboardList className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada ujian</h3>
          <p className="text-gray-600 dark:text-gray-400">Anda belum mengikuti ujian apapun</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {results.map((r) => (
            <button
              key={r.examId}
              onClick={() => openDetail(r.examId)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{r.judul}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{r.mataPelajaran}</p>
                </div>
                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">{r.kodeUjian}</code>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {r.submittedAt
                    ? new Date(r.submittedAt).toLocaleDateString("id-ID")
                    : "Belum submit"}
                </div>
                <div className="flex items-center gap-1">
                  {r.submittedAt ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-400" />}
                  {r.answerCount} jawaban
                </div>
              </div>

              {r.scoreReleased && r.score !== null ? (
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Award className="text-yellow-500" size={20} />
                  <span className="text-gray-900 dark:text-white">{r.score}</span>
                </div>
              ) : r.submittedAt ? (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Nilai belum dirilis</p>
              ) : (
                <p className="text-sm text-gray-400">Belum mengerjakan</p>
              )}
            </button>
          ))}
        </div>
      )}

      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <Loader2 size={40} className="animate-spin text-blue-600 relative" />
        </div>
      )}

      {detail && !detailLoading && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-8 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{detail.judul}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{detail.mataPelajaran} &mdash; {detail.kodeUjian}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {detail.scoreReleased && detail.score !== null && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Nilai Anda</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{detail.score}</p>
              </div>
            )}

            <div className="space-y-4">
              {detail.questions.map((q, i) => {
                const Icon = getJenisIcon(q.jenis);
                const kj = q.kunciJawaban as { pilihan?: string | string[]; text?: string } | null;
                return (
                  <div key={q.id} className={`rounded-xl border p-4 ${q.jawabanSiswa === null ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50" : q.isCorrect ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${q.jawabanSiswa === null ? "bg-gray-200 dark:bg-gray-600 text-gray-500" : q.isCorrect ? "bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300" : "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={14} className="text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-400 font-medium">{getJenisLabel(q.jenis)}</span>
                          <span className="text-xs text-gray-400">&bull; {q.point}pt</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{q.pertanyaan}</p>
                      </div>
                    </div>

                    {q.jenis === "essay" ? (
                      <div className="ml-10 space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Jawaban Anda:</p>
                          <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">{q.jawabanSiswa || <span className="italic text-gray-400">Tidak dijawab</span>}</p>
                        </div>
                        {kj?.text && (
                          <div>
                            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Kunci Jawaban:</p>
                            <p className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800 whitespace-pre-wrap">{kj.text as string}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="ml-10 space-y-1">
                        {q.choices.map((c) => {
                          const isKunci = kj?.pilihan ? (Array.isArray(kj.pilihan) ? kj.pilihan.includes(c.label) : kj.pilihan === c.label) : false;
                          const isSelected = (q.jenis === "pilihan_ganda" || q.jenis === "true_false") ? q.jawabanSiswa === c.label : (q.jawabanSiswa ? (JSON.parse(q.jawabanSiswa) as string[]).includes(c.label) : false);
                          return (
                            <div key={c.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${isKunci && isSelected ? "border-green-400 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" : isKunci ? "border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : isSelected ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"}`}>
                              {isKunci && isSelected && <CheckCircle size={14} className="text-green-600 shrink-0" />}
                              {isKunci && !isSelected && <Award size={14} className="text-green-500 shrink-0" />}
                              {!isKunci && isSelected && <XCircle size={14} className="text-red-500 shrink-0" />}
                              {!isKunci && !isSelected && <div className="w-3.5 shrink-0" />}
                              {q.jenis !== "true_false" && <span className="font-mono text-xs">{c.label.toUpperCase()}.</span>}
                              <span>{c.teks}</span>
                              {isKunci && <span className="text-[10px] opacity-60 ml-auto">(kunci)</span>}
                              {isSelected && !isKunci && <span className="text-[10px] opacity-60 ml-auto">(jawaban Anda)</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
