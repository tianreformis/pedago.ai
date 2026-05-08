"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Moon, Sun, Loader2, ArrowLeft, School, Edit, Check, X } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name?: string;
  school?: string;
  isAdmin?: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingSchool, setEditingSchool] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSchool, setEditSchool] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditName(parsed.name || "");
      setEditSchool(parsed.school || "");
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, school: editSchool }),
      });
      const data = await res.json();

      if (data.success) {
        const updatedUser = data.data;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditingName(false);
        setEditingSchool(false);
        setMessage({ type: "success", text: "Profil berhasil diperbarui" });
      } else {
        setMessage({ type: "error", text: data.error || "Gagal memperbarui profil" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "Password baru dan konfirmasi tidak sama" });
      return;
    }
    if (passwords.new.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Password berhasil diubah" });
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mengubah password" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={20} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {message && (
        <div className={`p-3 rounded-lg mb-6 text-sm ${
          message.type === "success"
            ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profil</h2>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-900 dark:text-white">{user?.email}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
              {editingName ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                  placeholder="Masukkan nama"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user?.name || "-"}</p>
              )}
            </div>
            <button
              onClick={() => editingName ? handleUpdateProfile() : setEditingName(true)}
              disabled={isSaving}
              className="ml-2 p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {editingName ? <Check size={18} /> : <Edit size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sekolah</p>
              {editingSchool ? (
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full mt-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                  placeholder="Masukkan nama sekolah"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user?.school || "-"}</p>
              )}
            </div>
            <button
              onClick={() => editingSchool ? handleUpdateProfile() : setEditingSchool(true)}
              disabled={isSaving}
              className="ml-2 p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {editingSchool ? <Check size={18} /> : <Edit size={18} />}
            </button>
          </div>

          {(editingName || editingSchool) && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                Simpan
              </button>
              <button
                onClick={() => { setEditingName(false); setEditingSchool(false); setEditName(user?.name || ""); setEditSchool(user?.school || ""); }}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <X size={16} />
                Batal
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="text-blue-600" size={24} /> : <Sun className="text-yellow-500" size={24} />}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tampilan</h2>
          </div>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? "Mode Terang" : "Mode Gelap"}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Klik tombol di atas untuk beralih antara mode terang dan gelap.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-blue-600" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ubah Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password Saat Ini
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
              placeholder="Masukkan password saat ini"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password Baru
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
              placeholder="Masukkan password baru (min 6 karakter)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
              placeholder="Konfirmasi password baru"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isSaving ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Simpan Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
