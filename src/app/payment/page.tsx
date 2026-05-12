"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Crown, AlertTriangle, X, Copy, Smartphone } from "lucide-react";
import { getClientKey, getSnapUrl } from "@/lib/midtrans-client";
import { MONTHLY_PRICE, YEARLY_PRICE } from "@/lib/pricing";

interface UserData {
  id: string;
  email: string;
  name?: string;
  school?: string;
  isAdmin: boolean;
}

let cachedUser: UserData | null = null;
let cachedUserId: string | null = null;

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) {
    cachedUser = null;
    cachedUserId = null;
    return null;
  }
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  const handler = () => {
    const newUser = getStoredUser();
    cachedUser = newUser;
    cachedUserId = newUser?.id || null;
    callback();
  };
  cachedUser = getStoredUser();
  cachedUserId = cachedUser?.id || null;
  window.addEventListener("storage", handler);
  window.addEventListener("user-updated", handler);
  window.addEventListener("user-logged-in", handler);
  window.addEventListener("user-logged-out", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("user-updated", handler);
    window.removeEventListener("user-logged-in", handler);
    window.removeEventListener("user-logged-out", handler);
  };
}

function getSnapshot(): UserData | null {
  if (cachedUser === null) {
    cachedUser = getStoredUser();
    cachedUserId = cachedUser?.id || null;
  }
  const current = getStoredUser();
  if (current && current.id !== cachedUserId) {
    cachedUser = current;
    cachedUserId = current.id;
  }
  if (!current && cachedUserId !== null) {
    cachedUser = null;
    cachedUserId = null;
  }
  return cachedUser;
}

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
  const [copied, setCopied] = useState(false);
  const userData = useSyncExternalStore(subscribe, getSnapshot, () => null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const clientKey = getClientKey();
    if (!clientKey) return;

    const script = document.createElement("script");
    script.src = getSnapUrl();
    script.setAttribute("data-client-key", clientKey);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (userData?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 shadow-lg text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Access
          </h1>
          <p className="text-white/90 text-lg">
            Anda memiliki akses tanpa batas sebagai administrator.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fitur Admin</h3>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Check className="text-green-500" size={20} />
                Generate RPP tak terbatas
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Check className="text-green-500" size={20} />
                Akses semua dashboard
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Check className="text-green-500" size={20} />
                Tidak perlu membayar
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSelectedPlan(plan);
    setIsLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const json = await res.json();

      if (json.success) {
        if (json.data.redirectUrl) {
          window.location.href = json.data.redirectUrl;
        } else if (json.data.token) {
          window.snap.pay(json.data.token, {
            onSuccess: () => {
              window.location.href = "/payment/finish";
            },
            onPending: () => {
              window.location.href = "/payment/unfinish";
            },
            onError: () => {
              setErrorModal({ open: true, message: "Pembayaran gagal diproses. Silakan coba lagi." });
              setIsLoading(false);
            },
            onClose: () => {
              setErrorModal({ open: true, message: "Pembayaran belum selesai. Jika mengalami kendala, silakan transfer langsung ke GoPay di bawah." });
              setIsLoading(false);
            },
          });
        } else {
          setErrorModal({ open: true, message: json.error || "Gagal membuat pembayaran" });
          setIsLoading(false);
        }
      } else {
        setErrorModal({ open: true, message: json.error || "Gagal membuat pembayaran" });
        setIsLoading(false);
      }
    } catch {
      setErrorModal({ open: true, message: "Terjadi kesalahan. Silakan coba lagi." });
      setIsLoading(false);
    }
  };

  const handleCopyGoPay = () => {
    navigator.clipboard.writeText("085350346852");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
        Langganan RPP Pembelajaran Mendalam
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
        Dapatkan akses tak terbatas untuk generate RPP
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bulanan</h3>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-6">
            Rp{MONTHLY_PRICE.toLocaleString("id-ID")}
            <span className="text-lg font-normal text-gray-500">/bulan</span>
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Check className="text-green-500" size={20} />
              Generate RPP tak terbatas
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Check className="text-green-500" size={20} />
              Simpan RPP di dashboard
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Check className="text-green-500" size={20} />
              Ekspor ke Word
            </li>
          </ul>
          <button
            onClick={() => handleSubscribe("monthly")}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && selectedPlan === "monthly" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : null}
            Pilih Bulanan
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border-2 border-purple-500 rounded-2xl p-8 shadow-lg relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Paling Populer
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tahunan</h3>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-6">
            Rp{YEARLY_PRICE.toLocaleString("id-ID")}
            <span className="text-lg font-normal text-gray-500">/tahun</span>
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            Hemat Rp{MONTHLY_PRICE * 12 - YEARLY_PRICE}!
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Check className="text-green-500" size={20} />
              Semua fitur bulanan
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Check className="text-green-500" size={20} />
              Akses prioritas
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Check className="text-green-500" size={20} />
              Support prioritas
            </li>
          </ul>
          <button
            onClick={() => handleSubscribe("yearly")}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && selectedPlan === "yearly" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : null}
            Pilih Tahunan
          </button>
        </div>
      </div>

      <p className="text-center text-gray-400 text-sm mt-8">
        Pembayaran aman via Midtrans · 7 hari uang kembali
      </p>

      {errorModal.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setErrorModal({ open: false, message: "" })} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setErrorModal({ open: false, message: "" })}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-4">
                <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pembayaran Gagal
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {errorModal.message}
              </p>

              <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Bayar via GoPay
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">085350346852</p>
                    <p className="text-xs text-gray-500">a.n. Kristian Reformis</p>
                  </div>
                  <button
                    onClick={handleCopyGoPay}
                    className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy size={14} />
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-left">
                  Kirim bukti transfer ke admin setelah pembayaran
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setErrorModal({ open: false, message: "" })}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setErrorModal({ open: false, message: "" });
                    handleSubscribe(selectedPlan || "monthly");
                  }}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}