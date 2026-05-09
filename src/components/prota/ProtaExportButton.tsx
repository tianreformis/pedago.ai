"use client";

import { useState } from "react";
import { ProtaOutput } from "@/lib/mistral";
import * as XLSX from "xlsx";
import { FileDown, Loader2 } from "lucide-react";

interface ProtaExportButtonProps {
  input: any;
  output: ProtaOutput;
}

export default function ProtaExportButton({ input, output }: ProtaExportButtonProps) {
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