"use client";

import { useState } from "react";
import { PromesOutput } from "@/types/promes";
import * as XLSX from "xlsx";
import { FileDown, FileText, Loader2 } from "lucide-react";

interface PromesExportButtonProps {
  output: PromesOutput;
}

export default function PromesExportButton({ output }: PromesExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"xlsx" | "pdf" | null>(null);

  const handleExport = async (type: "xlsx" | "pdf") => {
    setIsExporting(true);
    setExportType(type);
    try {
      if (type === "xlsx") {
        await exportExcel();
      } else {
        await exportPdf();
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengekspor dokumen: " + (error as Error).message);
    } finally {
      setIsExporting(false);
      setExportType(null);
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

  const exportPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PROGRAM SEMESTER (PROMES)", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(output.identitas.satuanPendidikan, pageWidth / 2, y, { align: "center" });
    y += 12;

    const drawIdentity = () => {
      doc.setFontSize(10);
      doc.text(`Mata Pelajaran: ${output.identitas.mataPelajaran}`, 15, y);
      doc.text(`Fase/Kelas: ${output.identitas.faseKelas}`, pageWidth / 2, y);
      y += 6;
      doc.text(`Tahun Pelajaran: ${output.identitas.tahunPelajaran}`, 15, y);
      doc.text(`Semester: ${output.identitas.semester}`, pageWidth / 2, y);
      y += 6;
      doc.text(`Total JP: ${output.totalJp} JP`, 15, y);
      y += 10;
    };
    drawIdentity();

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DISTRIBUSI PEMBELAJARAN", 15, y);
    y += 8;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    const colWidths: Record<string, number> = { no: 7, bab: 20, tp: 40, jp: 8 };
    let x = 15;
    const weekColW = 10;

    const writeCell = (text: string, w: number, align: "left" | "center" = "left") => {
      doc.setFont("helvetica", "bold");
      doc.text(text, x + (align === "center" ? w / 2 : 1), y + 4, align === "center" ? { align: "center" } : undefined);
      doc.rect(x, y, w, 14);
      x += w;
    };

    writeCell("No", colWidths.no, "center");
    writeCell("Bab", colWidths.bab);
    writeCell("TP", colWidths.tp);
    writeCell("JP", colWidths.jp, "center");

    const monthXStarts: Record<string, number> = {};
    allBulan.forEach((bulan) => {
      monthXStarts[bulan] = x;
      const nWeeks = maxMingguPerBulan[bulan];
      const totalW = nWeeks * weekColW;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text(bulan, x + totalW / 2, y + 3, { align: "center" });
      doc.setFontSize(7);
      for (let w = 1; w <= nWeeks; w++) {
        writeCell(`M${w}`, weekColW, "center");
      }
    });

    const aktivitasW = 35;
    writeCell("Aktivitas Utama", aktivitasW);

    y += 14;

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    for (const row of output.tabelPromes) {
      if (y > 180) {
        doc.addPage("landscape");
        y = 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PROGRAM SEMESTER (PROMES) - Lanjutan", pageWidth / 2, y, { align: "center" });
        y += 10;
        drawIdentity();

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        x = 15;
        writeCell("No", colWidths.no, "center");
        writeCell("Bab", colWidths.bab);
        writeCell("TP", colWidths.tp);
        writeCell("JP", colWidths.jp, "center");
        allBulan.forEach((bulan) => {
          const nWeeks = maxMingguPerBulan[bulan];
          for (let w = 1; w <= nWeeks; w++) {
            writeCell(`M${w}`, weekColW, "center");
          }
        });
        writeCell("Aktivitas Utama", aktivitasW);
        y += 14;
        doc.setFont("helvetica", "normal");
      }

      x = 15;
      doc.setFontSize(7);
      const rowH = Math.max(10, doc.splitTextToSize(row.tujuanPembelajaran, colWidths.tp).length * 4);

      const writeDataCell = (text: string, w: number, align: "left" | "center" = "left") => {
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(text, w - 2);
        doc.text(lines[0] || "", x + 1, y + 4);
        doc.rect(x, y, w, rowH);
        x += w;
      };

      const writeDataCellCenter = (text: string, w: number) => {
        doc.setFont("helvetica", "normal");
        doc.text(text, x + w / 2, y + 4, { align: "center" });
        doc.rect(x, y, w, rowH);
        x += w;
      };

      writeDataCellCenter(String(row.no), colWidths.no);
      writeDataCell(row.bab, colWidths.bab);
      writeDataCell(row.tujuanPembelajaran, colWidths.tp);
      writeDataCellCenter(String(row.alokasiJp), colWidths.jp);

      allBulan.forEach((bulan) => {
        const weekKeys = Object.keys(row.distribusi[bulan] || {}).sort();
        weekKeys.forEach((wk) => {
          const val = row.distribusi[bulan][wk] || 0;
          writeDataCellCenter(String(val), weekColW);
        });
      });

      writeDataCell(row.aktivitasUtama, aktivitasW);
      y += rowH;
    }

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Total JP: ${output.totalJp} JP`, 15, y);
    y += 6;

    if (output.validasi) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text(`Validasi: Total JP Promes (${output.validasi.totalJpPromes}) ${output.validasi.sesuai ? "=" : "≠"} Total JP Prota (${output.validasi.totalJpProta})`, 15, y);
    }

    const filename = `Promes_${output.identitas.mataPelajaran.replace(/\s+/g, "_")}_Semester_${output.identitas.semester}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("xlsx")}
        disabled={isExporting}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {isExporting && exportType === "xlsx" ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
        Excel
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={isExporting}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {isExporting && exportType === "pdf" ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
        PDF
      </button>
    </div>
  );
}