"use client";

import { PromesOutput } from "@/types/promes";

interface PromesViewerProps {
  output: PromesOutput;
}

export default function PromesViewer({ output }: PromesViewerProps) {
  const allBulan = Object.keys(output.tabelPromes[0]?.distribusi || {});
  const maxMingguPerBulan: Record<string, number> = {};

  allBulan.forEach((bulan) => {
    output.tabelPromes.forEach((row) => {
      const weeks = Object.keys(row.distribusi[bulan] || {});
      const max = Math.max(maxMingguPerBulan[bulan] || 0, weeks.length);
      maxMingguPerBulan[bulan] = max;
    });
  });

  const headerWeeks: string[] = [];
  allBulan.forEach((bulan) => {
    for (let w = 1; w <= maxMingguPerBulan[bulan]; w++) {
      headerWeeks.push(`${bulan} - M${w}`);
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold">Program Semester (Promes)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm text-purple-100">
          <p><span className="font-medium">Satuan Pendidikan:</span> {output.identitas.satuanPendidikan}</p>
          <p><span className="font-medium">Mata Pelajaran:</span> {output.identitas.mataPelajaran}</p>
          <p><span className="font-medium">Fase/Kelas:</span> {output.identitas.faseKelas}</p>
          <p><span className="font-medium">Tahun Pelajaran:</span> {output.identitas.tahunPelajaran}</p>
          <p><span className="font-medium">Semester:</span> {output.identitas.semester}</p>
          <p><span className="font-medium">Total JP:</span> {output.totalJp} JP</p>
        </div>

        {output.validasi && (
          <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium inline-block ${
            output.validasi.sesuai
              ? "bg-green-500/30 text-green-100"
              : "bg-red-500/30 text-red-100"
          }`}>
            {output.validasi.sesuai
              ? `Validasi: Total JP Promes (${output.validasi.totalJpPromes}) == Total JP Prota (${output.validasi.totalJpProta}) ✓`
              : `Validasi: Total JP Promes (${output.validasi.totalJpPromes}) != Total JP Prota (${output.validasi.totalJpProta}) ✗`}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-200 w-10">No</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-24">Bab</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 min-w-[200px]">Tujuan Pembelajaran</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-200 w-16">JP</th>
              {headerWeeks.map((hw) => (
                <th key={hw} className="border border-gray-200 dark:border-gray-600 px-2 py-2 text-center font-medium text-gray-600 dark:text-gray-300 w-14 whitespace-nowrap">
                  {hw}
                </th>
              ))}
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 min-w-[180px]">Aktivitas Utama</th>
            </tr>
          </thead>
          <tbody>
            {output.tabelPromes.map((row) => {
              let rowTotal = 0;
              return (
                <tr key={row.no} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center text-gray-600 dark:text-gray-300">{row.no}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-200">{row.bab}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-200">{row.tujuanPembelajaran}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center font-semibold text-purple-600 dark:text-purple-400">{row.alokasiJp}</td>
                  {allBulan.map((bulan) => {
                    const weekKeys = Object.keys(row.distribusi[bulan] || {}).sort();
                    return weekKeys.map((wk, idx) => {
                      const val = row.distribusi[bulan][wk] || 0;
                      rowTotal += val;
                      return (
                        <td
                          key={`${bulan}-${wk}-${idx}`}
                          className={`border border-gray-200 dark:border-gray-600 px-2 py-2 text-center ${
                            val === 0
                              ? "text-gray-300 dark:text-gray-600"
                              : "text-gray-700 dark:text-gray-200 font-medium"
                          }`}
                        >
                          {val}
                        </td>
                      );
                    });
                  })}
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">{row.aktivitasUtama}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Keterangan: M1 = Minggu 1, M2 = Minggu 2, dst. Angka 0 menandakan minggu tidak efektif (libur, STS, atau SAS).
        </p>
      </div>
    </div>
  );
}
