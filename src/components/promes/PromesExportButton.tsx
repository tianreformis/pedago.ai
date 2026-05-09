"use client";

import { useState } from "react";
import { PromesOutput } from "@/types/promes";
import * as XLSX from "xlsx";
import { FileDown, Loader2 } from "lucide-react";

interface PromesExportButtonProps {
  output: PromesOutput;
}

export default function PromesExportButton({ output }: PromesExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportExcel();
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengekspor dokumen: " + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const allBulan = Object.keys(output.tabelPromes[0]?.distribusi || {});
  const maxMingguPerBulan: Record<string, number> = {};
  allBulan.forEach((bulan) => {
    output.tabelPromes.forEach((row) => {
      const weeks = Object.keys(row.distribusi[bulan] || {});
      maxMingguPerBulan[bulan] = Math.max(maxMingguPerBulan[bulan] || 0, weeks.length);
    });
  });

  const exportExcel = async () => {
    const wb = XLSX.utils.book_new();

    const cellStyle = {
      font: { name: "Times New Roman", size: 10 },
      alignment: { vertical: "center" as const },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const headerStyle = {
      ...cellStyle,
      font: { bold: true, name: "Times New Roman", size: 10 },
      alignment: { horizontal: "center" as const, vertical: "center" as const },
      fill: { fgColor: { rgb: "D9D9D9" } },
    };

    const centerStyle = {
      ...cellStyle,
      alignment: { horizontal: "center" as const, vertical: "center" as const },
    };

    const titleStyle = {
      font: { bold: true, name: "Times New Roman", size: 14 },
      alignment: { horizontal: "center" as const },
    };

    const boldStyle = {
      font: { bold: true, name: "Times New Roman", size: 11 },
    };

    const sheetData: any[] = [];

    sheetData.push([{ t: "s", v: "PROGRAM SEMESTER (PROMES)", s: titleStyle }]);
    sheetData.push([{ t: "s", v: output.identitas.satuanPendidikan, s: { font: { name: "Times New Roman", size: 12 }, alignment: { horizontal: "center" as const } } }]);
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "IDENTITAS", s: boldStyle }]);
    sheetData.push([
      { t: "s", v: "Mata Pelajaran", s: boldStyle },
      { t: "s", v: output.identitas.mataPelajaran, s: cellStyle },
    ]);
    sheetData.push([
      { t: "s", v: "Fase/Kelas", s: boldStyle },
      { t: "s", v: output.identitas.faseKelas, s: cellStyle },
    ]);
    sheetData.push([
      { t: "s", v: "Tahun Pelajaran", s: boldStyle },
      { t: "s", v: output.identitas.tahunPelajaran, s: cellStyle },
    ]);
    sheetData.push([
      { t: "s", v: "Semester", s: boldStyle },
      { t: "s", v: output.identitas.semester, s: cellStyle },
    ]);
    sheetData.push([
      { t: "s", v: "Total JP", s: boldStyle },
      { t: "s", v: `${output.totalJp} JP`, s: cellStyle },
    ]);
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "DISTRIBUSI PEMBELAJARAN", s: boldStyle }]);

    const distribusiHeader: any[] = [
      { t: "s", v: "No", s: headerStyle },
      { t: "s", v: "Bab", s: headerStyle },
      { t: "s", v: "Tujuan Pembelajaran", s: headerStyle },
      { t: "s", v: "JP", s: headerStyle },
    ];

    allBulan.forEach((bulan) => {
      for (let w = 1; w <= maxMingguPerBulan[bulan]; w++) {
        distribusiHeader.push({ t: "s", v: `${bulan}\nM${w}`, s: headerStyle });
      }
    });

    distribusiHeader.push({ t: "s", v: "Aktivitas Utama", s: headerStyle });

    sheetData.push(distribusiHeader);

    for (const row of output.tabelPromes) {
      const dataRow: any[] = [
        { t: "n", v: row.no, s: centerStyle },
        { t: "s", v: row.bab, s: cellStyle },
        { t: "s", v: row.tujuanPembelajaran, s: cellStyle },
        { t: "n", v: row.alokasiJp, s: centerStyle },
      ];

      allBulan.forEach((bulan) => {
        const weekKeys = Object.keys(row.distribusi[bulan] || {}).sort();
        weekKeys.forEach((wk) => {
          const val = row.distribusi[bulan][wk] || 0;
          dataRow.push({ t: "n", v: val, s: centerStyle });
        });
      });

      dataRow.push({ t: "s", v: row.aktivitasUtama, s: cellStyle });
      sheetData.push(dataRow);
    }

    sheetData.push([{}]);
    sheetData.push([{ t: "s", v: `Total JP: ${output.totalJp} JP`, s: boldStyle }]);

    if (output.validasi) {
      sheetData.push([{ t: "s", v: `Validasi: Total JP Promes (${output.validasi.totalJpPromes}) ${output.validasi.sesuai ? "=" : "≠"} Total JP Prota (${output.validasi.totalJpProta})`, s: { font: { italic: true, name: "Times New Roman", size: 10 } } }]);
    }

    sheetData.push([{ t: "s", v: "Keterangan: M1 = Minggu 1, M2 = Minggu 2, dst. Angka 0 menandakan minggu tidak efektif (libur, STS, atau SAS).", s: { font: { italic: true, name: "Times New Roman", size: 9 } } }]);

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const colWidths: { wch: number }[] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 40 },
      { wch: 6 },
    ];

    allBulan.forEach((bulan) => {
      for (let w = 1; w <= maxMingguPerBulan[bulan]; w++) {
        colWidths.push({ wch: 8 });
      }
    });

    colWidths.push({ wch: 30 });

    ws["!cols"] = colWidths;

    const headerRowIndices: number[] = [];
    let rowIdx = 0;
    sheetData.forEach((row, i) => {
      if (row.length > 0 && row[0].s?.fill?.fgColor?.rgb === "D9D9D9") {
        headerRowIndices.push(i);
      }
    });
    ws["!rows"] = sheetData.map((row, i) => {
      if (headerRowIndices.includes(i)) {
        return { hpt: 30 };
      }
      return { hpt: 25 };
    });

    XLSX.utils.book_append_sheet(wb, ws, "Promes");

    const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbOut], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Promes_${output.identitas.mataPelajaran.replace(/\s+/g, "_")}_Semester_${output.identitas.semester}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
      {isExporting ? "Mengekspor..." : "Export Excel"}
    </button>
  );
}