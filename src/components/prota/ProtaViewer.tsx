"use client";

import { ProtaOutput } from "@/lib/mistral";
import { Calendar, BookOpen, Clock, GraduationCap, FileText } from "lucide-react";

interface ProtaViewerProps {
  output: ProtaOutput;
}

export default function ProtaViewer({ output }: ProtaViewerProps) {
  const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24} />
          PROGRAM TAHUNAN (PROTA)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-emerald-100 text-sm">Satuan Pendidikan</p>
            <p className="font-semibold">{identitas.satuanPendidikan}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Mata Pelajaran</p>
            <p className="font-semibold">{identitas.mataPelajaran}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Fase/Kelas</p>
            <p className="font-semibold">{identitas.faseKelas}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Tahun Pelajaran</p>
            <p className="font-semibold">{identitas.tahunPelajaran}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Capaian Pembelajaran
        </h4>
        <ul className="list-disc list-inside space-y-2">
          {capaianPembelajaran.map((cp, idx) => (
            <li key={idx} className="text-gray-700 dark:text-gray-300">{cp}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock size={20} />
          Alokasi Waktu
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{alokasiWaktu.mingguEfektif}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Minggu Efektif</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{alokasiWaktu.jpPerMinggu}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">JP per Minggu</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{alokasiWaktu.totalJpPertahun}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total JP per Tahun</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={20} />
            Distribusi Materi / Tujuan Pembelajaran
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-12">No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Materi / Tujuan Pembelajaran</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-24">Semester</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-24">Alokasi JP</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {distribusiMateri.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.nomor}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.materi}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.semester === "Ganjil" 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    }`}>
                      {item.semester}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.alokasiJp} JP</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{item.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Kalender Pendidikan
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Awal Tahun Ajaran</p>
            <p className="font-medium text-gray-900 dark:text-white">{kalenderPendidikan.awalTahunAjaran}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pembagian Semester</p>
            <p className="font-medium text-gray-900 dark:text-white">{kalenderPendidikan.pembagianSemester}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Perkiraan Asesmen</p>
            <p className="font-medium text-gray-900 dark:text-white">{kalenderPendidikan.perkiraanAsesmen}</p>
          </div>
        </div>
      </div>

      {catatan && catatan.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">Catatan</h4>
          <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300 text-sm">
            {catatan.map((cat, idx) => (
              <li key={idx}>{cat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}