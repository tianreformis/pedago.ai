"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowLeft } from "lucide-react";

export default function StudentForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email harus diisi"); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/student/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setSuccess(true);
      } else {
        setError(data.error || "Gagal");
      }
    } catch {
      setError("Gagal memproses");
    }
    setIsLoading(false);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lupa Password</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Siswa - Reset password akun Anda</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Dapatkan Token"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 dark:text-green-400 text-sm">Token reset password berhasil dibuat:</p>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <code className="flex-1 text-xs font-mono break-all text-gray-900 dark:text-white">{token}</code>
                <button onClick={copyToken} className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Token berlaku 1 jam. Copy token ini dan gunakan di halaman reset password.</p>
              <Link
                href={`/student/reset-password?token=${token}`}
                className="block text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Reset Password
              </Link>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <Link href="/exam" className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Kembali ke ujian
          </Link>
        </div>
      </div>
    </div>
  );
}
