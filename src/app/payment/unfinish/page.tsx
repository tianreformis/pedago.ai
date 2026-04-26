"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";

export default function PaymentUnfinishPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/payment");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pembayaran Belum Selesai
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Pembayaran Anda belum selesai. Silakan coba lagi jika masih ingin berlangganan.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Anda akan dialihkan ke halaman pembayaran dalam beberapa detik...
        </p>
        <div className="flex justify-center mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <button
          onClick={() => router.push("/payment")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}