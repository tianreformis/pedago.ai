"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Crown } from "lucide-react";
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
              window.location.href = "/payment/error";
            },
            onClose: () => {
              setIsLoading(false);
              setSelectedPlan(null);
            },
          });
        } else {
          alert(json.error || "Gagal membuat pembayaran");
          setIsLoading(false);
          setSelectedPlan(null);
        }
      } else {
        alert(json.error || "Gagal membuat pembayaran");
        setIsLoading(false);
        setSelectedPlan(null);
      }
    } catch {
      alert("Terjadi kesalahan");
      setIsLoading(false);
      setSelectedPlan(null);
    }
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
    </div>
  );
}