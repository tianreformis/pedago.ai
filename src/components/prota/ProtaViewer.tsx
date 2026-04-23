"use client";

import { ProtaOutput } from "@/lib/mistral";
import { Calendar, BookOpen, Clock, Users, GraduationCap } from "lucide-react";

interface ProtaViewerProps {
  output: ProtaOutput;
}

export default function ProtaViewer({ output }: ProtaViewerProps) {
  const { informasiUmum, alurPembelajaran, rekapitulasi } = output;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24} />
          Program Tahunan (Prota)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-green-100 text-sm">Mata Pelajaran</p>
            <p className="font-semibold">{informasiUmum.mataPelajaran}</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Fase</p>
            <p className="font-semibold">{informasiUmum.fase}</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Tahun Ajaran</p>
            <p className="font-semibold">{informasiUmum.tahunAjaran}</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Kelas</p>
            <p className="font-semibold">{informasiUmum.kelas.join(", ")}</p>
          </div>
          {informasiUmum.namaGuru && (
            <div>
              <p className="text-green-100 text-sm">Guru</p>
              <p className="font-semibold">{informasiUmum.namaGuru}</p>
            </div>
          )}
          {informasiUmum.sekolah && (
            <div>
              <p className="text-green-100 text-sm">Sekolah</p>
              <p className="font-semibold">{informasiUmum.sekolah}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen size={20} />
            Alur Pembelajaran Per Semester
          </h4>
        </div>

        {alurPembelajaran.map((semester, semIdx) => (
          <div key={semIdx} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-blue-700 dark:text-blue-300">{semester.semester}</h5>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-12">Mg</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Topik</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Capaian Pembelajaran</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Alokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {semester.mingguan.map((week, weekIdx) => (
                    <tr key={weekIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{week.minggu}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{week.topik}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{week.cp}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{week.alokasWaktu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {rekapitulasi && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              Rekapitulasi
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Minggu</span>
                <span className="font-semibold text-gray-900 dark:text-white">{rekapitulasi.totalMinggu} minggu</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Jam</span>
                <span className="font-semibold text-gray-900 dark:text-white">{rekapitulasi.totalJam}</span>
              </div>
            </div>
          </div>

          {rekapitulasi.distribusiTopik && Object.keys(rekapitulasi.distribusiTopik).length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap size={20} />
                Distribusi Topik
              </h4>
              <div className="space-y-2">
                {Object.entries(rekapitulasi.distribusiTopik).map(([topik, minggu]) => (
                  <div key={topik} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{topik}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{minggu} mg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p className="text-amber-800 dark:text-amber-200 text-sm">
          <strong>Catatan:</strong> Program Tahunan ini merupakan gambaran umum distribusi Capaian Pembelajaran (CP) ke dalam alur pembelajaran mingguan. Guru dapat menyesuaikan dengan kondisi dan kebutuhan peserta didik di lapangan.
        </p>
      </div>
    </div>
  );
}