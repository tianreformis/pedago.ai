"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, ArrowRight, LogIn, Loader2, Eye, EyeOff } from "lucide-react";

export default function ExamPublicPage() {
  const router = useRouter();
  const [kode, setKode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentToken, setStudentToken] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setStudentToken(localStorage.getItem("studentToken") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim()) { setError("Masukkan kode ujian"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/exam/public/${kode.trim().toUpperCase()}`);
      const data = await res.json();

      if (data.success) {
        if (!data.data.isAvailable) {
          setError("Ujian belum dimulai atau sudah berakhir");
          return;
        }
        router.push(`/exam/${kode.trim().toUpperCase()}`);
      } else {
        setError(data.error || "Kode ujian tidak ditemukan");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { setLoginError("Email dan password harus diisi"); return; }

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentData", JSON.stringify({ nama: data.nama, email: data.email }));
        router.push("/student/exam");
      } else {
        setLoginError(data.error || "Login gagal");
      }
    } catch {
      setLoginError("Gagal menghubungi server");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Masuk Ujian</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Masukkan kode ujian yang diberikan guru Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Ujian</label>
            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value.toUpperCase())}
              placeholder="Contoh: ABC123"
              className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Masuk Ujian"}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {studentToken ? (
            <div className="text-center">
              <Link href="/student/exam" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Lihat hasil ujian saya →
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1 mx-auto"
              >
                <LogIn size={14} /> Login Siswa
              </button>
            </div>
          )}
        </div>

        {showLogin && (
          <form onSubmit={handleLogin} className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Login Siswa</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Login untuk melihat hasil ujian Anda</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-sm text-red-600 dark:text-red-400 text-center">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loginLoading ? <Loader2 size={18} className="animate-spin" /> : "Login"}
              <LogIn size={18} />
            </button>
            <div className="text-center">
              <Link href="/student/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                Lupa password?
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
