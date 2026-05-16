"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Clock, CheckCircle, XCircle, Award, Loader2 } from "lucide-react";

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

export default function StudentExamsPage() {
  const router = useRouter();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [studentInfo, setStudentInfo] = useState({ nama: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) {
      router.push("/exam");
      return;
    }

    fetch("/api/student/exams", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setResults(data.data.exams);
          setStudentInfo({ nama: data.data.nama, email: data.data.email });
        } else {
          localStorage.removeItem("studentToken");
          localStorage.removeItem("studentData");
          router.push("/exam");
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [router]);

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hasil Ujian</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {studentInfo.nama} ({studentInfo.email})
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
            <div key={r.examId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
