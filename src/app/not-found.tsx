import Link from "next/link";
import { BookOpen, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="relative z-10 text-center px-4 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
          <BookOpen size={16} className="text-yellow-300" />
          <span className="text-white/80 text-sm font-medium">Pedago.ai</span>
        </div>

        <div className="text-[10rem] md:text-[12rem] font-bold leading-none text-white/10 select-none">404</div>

        <div className="relative -mt-12 md:-mt-16">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 hover:rotate-0 transition-transform duration-300">
            <Search size={44} className="text-white/60" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-sm mx-auto">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg w-full sm:w-auto justify-center"
            >
              <Home size={18} />
              Kembali ke Beranda
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
