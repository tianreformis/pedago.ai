import Link from "next/link";
import { BookOpen, Sparkles, FileDown, Save, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Generator RPP Pembelajaran Mendalam
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Buat Rencana Pembelajaran Mendalam (RPM) sesuai format resmi Kemendikdasmen Indonesia dengan bantuan AI
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Powered</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Generate otomatis</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Program Tahunan</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Buat Prota sekali buat</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Format Resmi</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Sesuai standar Kemendikdasmen</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileDown className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export Word</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Unduh dokumen siap cetak</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Simpan RPP</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Kelola RPP di dashboard</p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/generate"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
        >
          Generate RPP
        </Link>
        <Link
          href="/generate-prota"
          className="inline-block ml-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
        >
          Generate Prota
        </Link>
      </div>

      <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Tentang Pembelajaran Mendalam</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">BERKESADARAN</h3>
            <p className="text-gray-600 dark:text-gray-300">PesertaDidik menyadari proses belajar dan meningkatkan kesadaran diri</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">BERMAKNA</h3>
            <p className="text-gray-600 dark:text-gray-300">Pembelajaran terkait dengan konteks kehidupan nyata dan pengalaman pesertaDidik</p>
          </div>
          <div>
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">MENGGEMBIRAKAN</h3>
            <p className="text-gray-600 dark:text-gray-300">Suasana belajar yang menyenangkan dan memotivasi pesertaDidik</p>
          </div>
        </div>
      </div>
    </div>
  );
}