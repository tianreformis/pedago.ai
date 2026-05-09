"use client";

import { useState } from "react";
import { ProtaOutput } from "@/lib/mistral";
import * as XLSX from "xlsx";
import { FileDown, FileText, Loader2 } from "lucide-react";

interface ProtaExportButtonProps {
  input: any;
  output: ProtaOutput;
}

export default function ProtaExportButton({ input, output }: ProtaExportButtonProps) {
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

  const exportExcel = async () => {
    const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

    const wb = XLSX.utils.book_new();

    const headerStyle = {
      font: { bold: true, name: "Times New Roman", size: 11 },
      alignment: { horizontal: "center", vertical: "center" as const },
      fill: { fgColor: { rgb: "D9D9D9" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const cellStyle = {
      font: { name: "Times New Roman", size: 11 },
      alignment: { vertical: "center" as const },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const centerStyle = {
      ...cellStyle,
      alignment: { horizontal: "center" as const, vertical: "center" as const },
    };

    const wsIdentitas = XLSX.utils.aoa_to_sheet([
      [{ t: "s", v: "PROGRAM TAHUNAN (PROTA)", s: { font: { bold: true, name: "Times New Roman", size: 16 }, alignment: { horizontal: "center" } } }],
      [identitas.satuanPendidikan],
      [],
      [{ t: "s", v: "IDENTITAS", s: { font: { bold: true, name: "Times New Roman", size: 12 } } }],
      [{ t: "s", v: "Mata Pelajaran", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, identitas.mataPelajaran],
      [{ t: "s", v: "Fase/Kelas", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, identitas.faseKelas],
      [{ t: "s", v: "Tahun Pelajaran", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, identitas.tahunPelajaran],
    ]);
    wsIdentitas["!cols"] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsIdentitas, "Identitas");

    const cpData = [
      [{ t: "s", v: "CAPAIAN PEMBELAJARAN", s: { font: { bold: true, name: "Times New Roman", size: 12 }, alignment: { horizontal: "left" } } }],
      ...capaianPembelajaran.map((cp) => [{ t: "s", v: `• ${cp}`, s: cellStyle }]),
    ];
    const wsCP = XLSX.utils.aoa_to_sheet(cpData);
    wsCP["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsCP, "Capaian Pembelajaran");

    const alokasiData = [
      [{ t: "s", v: "ALOKASI WAKTU", s: { font: { bold: true, name: "Times New Roman", size: 12 } } }],
      [{ t: "s", v: "Jumlah Minggu Efektif", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, { t: "s", v: `${alokasiWaktu.mingguEfektif} minggu`, s: cellStyle }],
      [{ t: "s", v: "JP per Minggu", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, { t: "s", v: `${alokasiWaktu.jpPerMinggu} JP`, s: cellStyle }],
      [{ t: "s", v: "Total JP per Tahun", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, { t: "s", v: `${alokasiWaktu.totalJpPertahun} JP`, s: cellStyle }],
    ];
    const wsAlokasi = XLSX.utils.aoa_to_sheet(alokasiData);
    wsAlokasi["!cols"] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsAlokasi, "Alokasi Waktu");

    const distribusiHeader = [
      [{ t: "s", v: "No", s: headerStyle }, { t: "s", v: "Materi / Tujuan Pembelajaran", s: headerStyle }, { t: "s", v: "Semester", s: headerStyle }, { t: "s", v: "Alokasi JP", s: headerStyle }, { t: "s", v: "Keterangan", s: headerStyle }],
    ];
    const distribusiRows = distribusiMateri.map((item) => [
      { t: "n", v: item.nomor, s: centerStyle },
      { t: "s", v: item.materi, s: cellStyle },
      { t: "s", v: item.semester, s: centerStyle },
      { t: "s", v: `${item.alokasiJp} JP`, s: centerStyle },
      { t: "s", v: item.keterangan, s: cellStyle },
    ]);
    const wsDistribusi = XLSX.utils.aoa_to_sheet([...distribusiHeader, ...distribusiRows]);
    wsDistribusi["!cols"] = [{ wch: 5 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 30 }];
    wsDistribusi["!rows"] = [{ hpt: 30 }, ...distribusiRows.map(() => ({ hpt: 40 }))];
    XLSX.utils.book_append_sheet(wb, wsDistribusi, "Distribusi Materi");

    const kalenderData = [
      [{ t: "s", v: "KALENDER PENDIDIKAN", s: { font: { bold: true, name: "Times New Roman", size: 12 } } }],
      [{ t: "s", v: "Awal Tahun Ajaran", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, kalenderPendidikan.awalTahunAjaran],
      [{ t: "s", v: "Pembagian Semester", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, kalenderPendidikan.pembagianSemester],
      [{ t: "s", v: "Perkiraan Asesmen", s: { font: { bold: true, name: "Times New Roman", size: 11 } } }, kalenderPendidikan.perkiraanAsesmen],
    ];
    const wsKalender = XLSX.utils.aoa_to_sheet(kalenderData);
    wsKalender["!cols"] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, wsKalender, "Kalender Pendidikan");

    if (catatan && catatan.length > 0) {
      const catatanData = [
        [{ t: "s", v: "CATATAN", s: { font: { bold: true, name: "Times New Roman", size: 12 } } }],
        ...catatan.map((cat) => [{ t: "s", v: `• ${cat}`, s: cellStyle }]),
      ];
      const wsCatatan = XLSX.utils.aoa_to_sheet(catatanData);
      wsCatatan["!cols"] = [{ wch: 80 }];
      XLSX.utils.book_append_sheet(wb, wsCatatan, "Catatan");
    }

    const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbOut], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prota_${identitas.mataPelajaran.replace(/\s+/g, "_")}_${identitas.tahunPelajaran}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PROGRAM TAHUNAN (PROTA)", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(identitas.satuanPendidikan, pageWidth / 2, y, { align: "center" });
    y += 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("IDENTITAS", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Mata Pelajaran: ${identitas.mataPelajaran}`, 20, y);
    y += 6;
    doc.text(`Fase/Kelas: ${identitas.faseKelas}`, 20, y);
    y += 6;
    doc.text(`Tahun Pelajaran: ${identitas.tahunPelajaran}`, 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CAPAIAN PEMBELAJARAN", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const cp of capaianPembelajaran) {
      const lines = doc.splitTextToSize(`• ${cp}`, pageWidth - 40);
      for (const line of lines) {
        doc.text(line, 20, y);
        y += 5;
      }
    }
    y += 5;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ALOKASI WAKTU", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Jumlah Minggu Efektif: ${alokasiWaktu.mingguEfektif} minggu`, 20, y);
    y += 6;
    doc.text(`JP per Minggu: ${alokasiWaktu.jpPerMinggu} JP`, 20, y);
    y += 6;
    doc.text(`Total JP per Tahun: ${alokasiWaktu.totalJpPertahun} JP`, 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DISTRIBUSI MATERI", 20, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("No", 20, y);
    doc.text("Materi", 30, y);
    doc.text("Smstr", 100, y);
    doc.text("JP", 120, y);
    doc.text("Keterangan", 135, y);
    y += 2;
    doc.line(20, y, pageWidth - 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    for (const item of distribusiMateri) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(String(item.nomor), 20, y);
      const materiLines = doc.splitTextToSize(item.materi, 65);
      doc.text(materiLines[0] || "", 30, y);
      doc.text(item.semester, 100, y);
      doc.text(`${item.alokasiJp}`, 120, y);
      const ketLines = doc.splitTextToSize(item.keterangan, 40);
      doc.text(ketLines[0] || "", 135, y);
      y += 5;
    }
    y += 10;

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("KALENDER PENDIDIKAN", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Awal Tahun Ajaran: ${kalenderPendidikan.awalTahunAjaran}`, 20, y);
    y += 6;
    doc.text(`Pembagian Semester: ${kalenderPendidikan.pembagianSemester}`, 20, y);
    y += 6;
    doc.text(`Perkiraan Asesmen: ${kalenderPendidikan.perkiraanAsesmen}`, 20, y);
    y += 10;

    if (catatan && catatan.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CATATAN", 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      for (const cat of catatan) {
        doc.text(`• ${cat}`, 20, y);
        y += 5;
      }
    }

    const filename = `Prota_${identitas.mataPelajaran.replace(/\s+/g, "_")}_${identitas.tahunPelajaran}.pdf`;
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