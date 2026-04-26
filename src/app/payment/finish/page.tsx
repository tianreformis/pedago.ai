"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PaymentFinishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("subscription_updated", "true");
      window.dispatchEvent(new Event("subscription-updated"));
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pembayaran Berhasil!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Terima kasih!langganan Anda telah aktif.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Anda akan dialihkan ke dashboard dalam beberapa detik...
        </p>
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Ke Dashboard Sekarang
        </button>
      </div>
    </div>
  );
}