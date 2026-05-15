"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, LogIn, UserPlus, CheckCircle, Clock, AlertTriangle, AlertOctagon, Award } from "lucide-react";

interface Choice {
  label: string;
  teks: string;
}

interface ExamData {
  id: string;
  judul: string;
  mataPelajaran: string;
  kodeUjian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahSoal: number;
  isAvailable: boolean;
  questions: { id: string; pertanyaan: string; point: number; jenis: string; choices: Choice[] }[];
}

interface StudentData {
  studentId: string;
  nama: string;
  username: string;
  token: string;
  startedAt: string;
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const kode = params.kode as string;

  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [examError, setExamError] = useState("");

  const [student, setStudent] = useState<StudentData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [resultData, setResultData] = useState<{ score: number | null; scoreReleased: boolean } | null>(null);
  const [examEnded, setExamEnded] = useState(false);

  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({ nama: "", username: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [savingId, setSavingId] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<string>("");
  const [tabWarning, setTabWarning] = useState(false);
  const tabSwitchCount = useRef(0);
  const lastTabSwitch = useRef(0);

  const questions = exam?.questions || [];
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    fetchExam();
  }, [kode]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exam/public/${kode}`);
      const data = await res.json();
      if (data.success) {
        setExam(data.data);
        if (!data.data.isAvailable) {
          setExamEnded(true);
        }
      } else {
        setExamError(data.error || "Ujian tidak ditemukan");
      }
    } catch {
      setExamError("Gagal memuat ujian");
    } finally {
      setLoading(false);
    }
  };

  const tryRestoreSession = useCallback(async () => {
    const stored = localStorage.getItem(`exam_session_${kode}`);
    if (!stored) return;

    try {
      const session = JSON.parse(stored);
      const res = await fetch(`/api/exam/public/${kode}/status`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStudent({ ...session, startedAt: data.data.startedAt });
        setAnswers(data.data.answers || {});
        if (data.data.submittedAt) {
          setSubmitted(true);
        }
        if (data.data.scoreReleased) {
          setResultData({ score: data.data.score, scoreReleased: true });
        } else if (data.data.submittedAt && examEnded) {
          setResultData({ score: data.data.score, scoreReleased: false });
        }
        return true;
      }
    } catch {
      localStorage.removeItem(`exam_session_${kode}`);
    }
    return false;
  }, [kode, examEnded]);

  useEffect(() => {
    if (exam && !loading) {
      tryRestoreSession();
    }
  }, [exam, loading, tryRestoreSession]);

  useEffect(() => {
    if (!exam || !student || submitted) return;

    const selesai = new Date(exam.tanggalSelesai).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = selesai - now;
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        handleAutoSubmit();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [exam, student, submitted]);

  const handleAutoSubmit = async () => {
    if (!student || submitted) return;
    try {
      await fetch(`/api/exam/public/${kode}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${student.token}` },
      });
      setSubmitted(true);
    } catch { /* silent */ }
  };

  const logTabSwitch = useCallback(async () => {
    if (!student || submitted) return;
    const now = Date.now();
    if (now - lastTabSwitch.current < 3000) return;
    lastTabSwitch.current = now;
    tabSwitchCount.current += 1;
    try {
      await fetch(`/api/exam/public/${kode}/tab-switch`, {
        method: "POST",
        headers: { Authorization: `Bearer ${student.token}` },
      });
    } catch { /* silent */ }
  }, [student, submitted, kode]);

  useEffect(() => {
    if (!student || submitted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabWarning(true);
        logTabSwitch();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [student, submitted, logTabSwitch]);

  const handleAuth = async () => {
    if (authMode === "register" && !authForm.nama.trim()) {
      setAuthError("Nama harus diisi");
      return;
    }
    if (!authForm.username.trim() || !authForm.password.trim()) {
      setAuthError("Username dan password harus diisi");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`/api/exam/public/${kode}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authMode,
          nama: authForm.nama.trim(),
          username: authForm.username.trim(),
          password: authForm.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStudent(data.data);
        localStorage.setItem(`exam_session_${kode}`, JSON.stringify({
          token: data.data.token,
          studentId: data.data.studentId,
          nama: data.data.nama,
          username: data.data.username,
        }));

        // Check status after login to see if there's a released score
        const statusRes = await fetch(`/api/exam/public/${kode}/status`, {
          headers: { Authorization: `Bearer ${data.data.token}` },
        });
        const statusData = await statusRes.json();
        if (statusData.success) {
          if (statusData.data.submittedAt && statusData.data.scoreReleased) {
            setSubmitted(true);
            setResultData({ score: statusData.data.score, scoreReleased: true });
          } else if (statusData.data.submittedAt) {
            setSubmitted(true);
            setResultData({ score: statusData.data.score, scoreReleased: false });
          }
        }
      } else {
        setAuthError(data.error);
        if (data.error === "Username sudah digunakan") {
          setAuthMode("login");
        }
      }
    } catch {
      setAuthError("Gagal login");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveAnswer = async (questionId: string, jawaban: string) => {
    if (!student) return;
    setSavingId(questionId);
    setAnswers((prev) => ({ ...prev, [questionId]: jawaban }));
    try {
      await fetch(`/api/exam/public/${kode}/answer`, {
        method: "POST",
        headers: { Authorization: `Bearer ${student.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, jawaban }),
      });
    } catch { /* silent */ }
    finally { setSavingId(null); }
  };

  const handleSubmit = async () => {
    if (!student || !confirm("Yakin ingin mengumpulkan ujian? Jawaban tidak dapat diubah lagi.")) return;
    try {
      const res = await fetch(`/api/exam/public/${kode}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${student.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || "Gagal mengumpulkan");
      }
    } catch {
      alert("Gagal mengumpulkan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!exam && examError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak Dapat Mengakses Ujian</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{examError}</p>
          <button onClick={() => router.push("/exam")} className="text-blue-600 hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  if (submitted && resultData?.scoreReleased) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Award className="mx-auto text-blue-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nilai Ujian</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2">{exam?.judul}</p>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Nilai Anda</p>
            <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{resultData.score !== null ? resultData.score : "-"}</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">{student?.nama}</p>
          <button onClick={() => router.push("/exam")} className="text-blue-600 hover:underline">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  if (submitted && resultData && !resultData.scoreReleased) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ujian Terkumpul</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Jawaban Anda telah berhasil dikumpulkan.</p>
          <p className="text-sm text-gray-400 mb-6">Nilai belum dirilis oleh guru.</p>
          <button onClick={() => router.push("/exam")} className="text-blue-600 hover:underline">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ujian Terkumpul</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Jawaban Anda telah berhasil dikumpulkan.</p>
          <button onClick={() => router.push("/exam")} className="text-blue-600 hover:underline">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{exam?.judul}</h1>
            <p className="text-gray-500 dark:text-gray-400">{exam?.mataPelajaran}</p>
            {examEnded && <p className="text-sm text-orange-500 mt-2">Ujian sudah berakhir</p>}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setAuthMode("register"); setAuthError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authMode === "register" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
              >
                <UserPlus size={16} className="inline mr-1" /> Daftar
              </button>
              <button
                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authMode === "login" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
              >
                <LogIn size={16} className="inline mr-1" /> Login
              </button>
            </div>

            <div className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={authForm.nama}
                    onChange={(e) => setAuthForm({ ...authForm, nama: e.target.value })}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder="Buat username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder={authMode === "register" ? "Buat password" : "Masukkan password"}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}

              <button
                onClick={handleAuth}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {authLoading ? <Loader2 size={18} className="animate-spin" /> : "Masuk"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeWarning = timeLeft && timeLeft <= "00:05:00";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">{exam?.judul}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{student.nama} - {answeredCount}/{questions.length} terjawab</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
              timeWarning
                ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 animate-pulse"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}>
              <Clock size={16} />
              {timeLeft}
            </div>
            <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Kumpulkan
            </button>
          </div>
        </div>
      </div>

      {tabWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
            <AlertOctagon className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Peringatan!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Anda meninggalkan halaman ujian. Tindakan ini dicatat.</p>
            <p className="text-sm text-red-500 font-medium mb-4">Jangan tinggalkan ujian atau berpindah tab!</p>
            <button onClick={() => setTabWarning(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Kembali ke Ujian
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {questions.map((q, i) => {
          const jenis = q.jenis || "essay";
          const choices = (q as any).choices || [];
          const selectedValue = answers[q.id] || (jenis === "multiple_answer" ? "[]" : "");
          const selectedArr = jenis === "multiple_answer" ? JSON.parse(selectedValue || "[]") : [];

          const handleEssayChange = (val: string) => handleSaveAnswer(q.id, val);
          const handleRadioChange = (val: string) => handleSaveAnswer(q.id, val);
          const handleCheckboxChange = (label: string) => {
            const current = JSON.parse(answers[q.id] || "[]");
            const next = current.includes(label)
              ? current.filter((l: string) => l !== label)
              : [...current, label];
            handleSaveAnswer(q.id, JSON.stringify(next));
          };

          return (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">{q.pertanyaan}</p>
                  <p className="text-sm text-gray-400 mt-1">Point: {q.point}</p>
                </div>
              </div>

              {jenis === "essay" && (
                <textarea
                  defaultValue={selectedValue}
                  onBlur={(e) => handleEssayChange(e.target.value)}
                  rows={4}
                  placeholder="Tulis jawaban Anda..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                />
              )}

              {jenis === "pilihan_ganda" && (
                <div className="mt-2 space-y-2">
                  {choices.map((c: Choice) => (
                    <label key={c.label} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedValue === c.label ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}>
                      <input type="radio" name={`q_${q.id}`} value={c.label} checked={selectedValue === c.label} onChange={() => handleRadioChange(c.label)} className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-sm text-gray-500 w-4">{c.label.toUpperCase()}.</span>
                      <span className="text-gray-900 dark:text-white">{c.teks}</span>
                    </label>
                  ))}
                </div>
              )}

              {jenis === "multiple_answer" && (
                <div className="mt-2 space-y-2">
                  {choices.map((c: Choice) => (
                    <label key={c.label} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedArr.includes(c.label) ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}>
                      <input type="checkbox" checked={selectedArr.includes(c.label)} onChange={() => handleCheckboxChange(c.label)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="font-mono text-sm text-gray-500 w-4">{c.label.toUpperCase()}.</span>
                      <span className="text-gray-900 dark:text-white">{c.teks}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-2">
                {savingId === q.id ? (
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                ) : answers[q.id] !== undefined ? (
                  <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Tersimpan</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
