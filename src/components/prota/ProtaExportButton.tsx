"use client";

import { useState } from "react";
import { ProtaOutput } from "@/lib/mistral";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from "docx";
import { FileDown, FileText, Loader2 } from "lucide-react";

interface ProtaExportButtonProps {
  input: any;
  output: ProtaOutput;
}

export default function ProtaExportButton({ input, output }: ProtaExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"docx" | "pdf" | null>(null);

  const handleExport = async (type: "docx" | "pdf") => {
    setIsExporting(true);
    setExportType(type);
    try {
      if (type === "docx") {
        await exportDocx();
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

  const exportDocx = async () => {
    const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

    const children: (Paragraph | Table)[] = [];

    children.push(
      new Paragraph({
        text: "PROGRAM TAHUNAN (PROTA)",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: identitas.satuanPendidikan,
        alignment: AlignmentType.CENTER,
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: "IDENTITAS",
        heading: HeadingLevel.HEADING_2,
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Mata Pelajaran: ", bold: true }),
          new TextRun(identitas.mataPelajaran),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Fase/Kelas: ", bold: true }),
          new TextRun(identitas.faseKelas),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Tahun Pelajaran: ", bold: true }),
          new TextRun(identitas.tahunPelajaran),
        ],
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: "CAPAIAN PEMBELAJARAN",
        heading: HeadingLevel.HEADING_2,
      })
    );
    for (const cp of capaianPembelajaran) {
      children.push(new Paragraph({ text: `• ${cp}` }));
    }
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: "ALOKASI WAKTU",
        heading: HeadingLevel.HEADING_2,
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Jumlah Minggu Efektif: ", bold: true }),
          new TextRun(`${alokasiWaktu.mingguEfektif} minggu`),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "JP per Minggu: ", bold: true }),
          new TextRun(`${alokasiWaktu.jpPerMinggu} JP`),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Total JP per Tahun: ", bold: true }),
          new TextRun(`${alokasiWaktu.totalJpPertahun} JP`),
        ],
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: "DISTRIBUSI MATERI / TUJUAN PEMBELAJARAN",
        heading: HeadingLevel.HEADING_2,
      })
    );

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "No", bold: true })] })],
            shading: { fill: "E8E8E8" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Materi", bold: true })] })],
            shading: { fill: "E8E8E8" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Semester", bold: true })] })],
            shading: { fill: "E8E8E8" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Alokasi JP", bold: true })] })],
            shading: { fill: "E8E8E8" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Keterangan", bold: true })] })],
            shading: { fill: "E8E8E8" },
          }),
        ],
      }),
    ];

    for (const item of distribusiMateri) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: String(item.nomor) })] }),
            new TableCell({ children: [new Paragraph({ text: item.materi })] }),
            new TableCell({ children: [new Paragraph({ text: item.semester })] }),
            new TableCell({ children: [new Paragraph({ text: `${item.alokasiJp} JP` })] }),
            new TableCell({ children: [new Paragraph({ text: item.keterangan })] }),
          ],
        })
      );
    }

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: "KALENDER PENDIDIKAN",
        heading: HeadingLevel.HEADING_2,
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Awal Tahun Ajaran: ", bold: true }),
          new TextRun(kalenderPendidikan.awalTahunAjaran),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Pembagian Semester: ", bold: true }),
          new TextRun(kalenderPendidikan.pembagianSemester),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Perkiraan Asesmen: ", bold: true }),
          new TextRun(kalenderPendidikan.perkiraanAsesmen),
        ],
      })
    );
    children.push(new Paragraph({ text: "" }));

    if (catatan && catatan.length > 0) {
      children.push(
        new Paragraph({
          text: "CATATAN",
          heading: HeadingLevel.HEADING_2,
        })
      );
      for (const cat of catatan) {
        children.push(new Paragraph({ text: `• ${cat}` }));
      }
    }

    const doc = new Document({
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prota_${identitas.mataPelajaran.replace(/\s+/g, "_")}_${identitas.tahunPelajaran}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

    const doc = new jsPDF();
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
        onClick={() => handleExport("docx")}
        disabled={isExporting}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {isExporting && exportType === "docx" ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
        Word
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