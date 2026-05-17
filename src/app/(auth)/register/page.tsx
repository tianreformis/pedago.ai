"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    school: "",
    role: "teacher",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.name.trim()) {
      errs.name = "Nama harus diisi";
    }

    if (!form.email.trim()) {
      errs.email = "Email harus diisi";
    }

    if (!form.password) {
      errs.password = "Password harus diisi";
    } else if (form.password.length < 6) {
      errs.password = "Minimal 6 karakter";
    } else if (!/\d/.test(form.password)) {
      errs.password = "Minimal 1 angka";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Input ulang password";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Password tidak cocok";
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!turnstileToken) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, school: form.school, role: form.role, turnstileToken }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Akun berhasil dibuat!");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        window.dispatchEvent(new Event("user-logged-in"));
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Registrasi gagal");
      }
    } catch {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Buat akun baru</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); clearError("name"); }}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama lengkap"
              />
              {errors.name && (
                <div className="mt-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg inline-block">{errors.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError("email"); }}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
              {errors.email && (
                <div className="mt-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg inline-block">{errors.email}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError("password"); }}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="mt-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg inline-block">{errors.password}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Ulang Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); clearError("confirmPassword"); }}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg inline-block">{errors.confirmPassword}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sekolah (Opsional)</label>
              <input
                type="text"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama sekolah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Daftar sebagai</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "teacher" })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.role === "teacher"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  Guru
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "student" })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.role === "student"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                  Siswa
                </button>
              </div>
            </div>

            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
              options={{ theme: 'auto' }}
            />

            <button
              type="submit"
              disabled={isLoading || !turnstileToken}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}