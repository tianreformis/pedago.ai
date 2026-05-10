"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    school: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, school: form.school }),
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
              <input
                type="password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError("password"); }}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="mt-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg inline-block">{errors.password}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Ulang Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); clearError("confirmPassword"); }}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
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

            <button
              type="submit"
              disabled={isLoading}
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