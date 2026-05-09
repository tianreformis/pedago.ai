"use client";

import { useState } from "react";
import { ProtaOutput } from "@/lib/mistral";
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  PageOrientation, VerticalAlign
} from "docx";
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

  const defaultBorder = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: "000000",
  };

  const cellBorders = {
    top: defaultBorder,
    bottom: defaultBorder,
    left: defaultBorder,
    right: defaultBorder,
  };

  const createHeaderCell = (text: string, widthDxa?: number) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true, font: "Times New Roman", size: 20 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 60 },
        }),
      ],
      shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
      borders: cellBorders,
      verticalAlign: VerticalAlign.CENTER,
      width: widthDxa ? { size: widthDxa, type: WidthType.DXA } : undefined,
    });

  const createDataCell = (text: string, align?: typeof AlignmentType[keyof typeof AlignmentType]) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text, font: "Times New Roman", size: 20 })],
          alignment: align || AlignmentType.LEFT,
          spacing: { before: 40, after: 40 },
        }),
      ],
      borders: cellBorders,
      verticalAlign: VerticalAlign.CENTER,
    });

  const createTextParagraph = (children: (TextRun | { text: string; bold?: boolean })[]) =>
    new Paragraph({
      children: children.map((child) =>
        "text" in child
          ? new TextRun({ text: child.text, bold: child.bold, font: "Times New Roman", size: 22 })
          : child
      ),
      spacing: { after: 80 },
    });

  const exportDocx = async () => {
    const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

    const children: (Paragraph | Table)[] = [];

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "PROGRAM TAHUNAN (PROTA)", bold: true, font: "Times New Roman", size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: identitas.satuanPendidikan, font: "Times New Roman", size: 24 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "IDENTITAS", bold: true, font: "Times New Roman", size: 24 })],
        spacing: { before: 200, after: 100 },
      })
    );

    children.push(createTextParagraph([
      { text: "Mata Pelajaran: ", bold: true },
      { text: identitas.mataPelajaran },
    ]));
    children.push(createTextParagraph([
      { text: "Fase/Kelas: ", bold: true },
      { text: identitas.faseKelas },
    ]));
    children.push(createTextParagraph([
      { text: "Tahun Pelajaran: ", bold: true },
      { text: identitas.tahunPelajaran },
    ]));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "CAPAIAN PEMBELAJARAN", bold: true, font: "Times New Roman", size: 24 })],
        spacing: { before: 200, after: 100 },
      })
    );
    for (const cp of capaianPembelajaran) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${cp}`, font: "Times New Roman", size: 20 })],
          spacing: { after: 60 },
        })
      );
    }
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "ALOKASI WAKTU", bold: true, font: "Times New Roman", size: 24 })],
        spacing: { before: 200, after: 100 },
      })
    );
    children.push(createTextParagraph([
      { text: "Jumlah Minggu Efektif: ", bold: true },
      { text: `${alokasiWaktu.mingguEfektif} minggu` },
    ]));
    children.push(createTextParagraph([
      { text: "JP per Minggu: ", bold: true },
      { text: `${alokasiWaktu.jpPerMinggu} JP` },
    ]));
    children.push(createTextParagraph([
      { text: "Total JP per Tahun: ", bold: true },
      { text: `${alokasiWaktu.totalJpPertahun} JP` },
    ]));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "DISTRIBUSI MATERI / TUJUAN PEMBELAJARAN", bold: true, font: "Times New Roman", size: 24 })],
        spacing: { before: 200, after: 150 },
      })
    );

    const headerRow = new TableRow({
      children: [
        createHeaderCell("No", 400),
        createHeaderCell("Materi / Tujuan Pembelajaran", 5000),
        createHeaderCell("Semester", 1500),
        createHeaderCell("Alokasi JP", 1200),
        createHeaderCell("Keterangan", 2500),
      ],
      tableHeader: true,
    });

    const tableRows = [headerRow];

    for (const item of distribusiMateri) {
      tableRows.push(
        new TableRow({
          children: [
            createDataCell(String(item.nomor), AlignmentType.CENTER),
            createDataCell(item.materi),
            createDataCell(item.semester, AlignmentType.CENTER),
            createDataCell(`${item.alokasiJp} JP`, AlignmentType.CENTER),
            createDataCell(item.keterangan),
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
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "KALENDER PENDIDIKAN", bold: true, font: "Times New Roman", size: 24 })],
        spacing: { before: 200, after: 100 },
      })
    );
    children.push(createTextParagraph([
      { text: "Awal Tahun Ajaran: ", bold: true },
      { text: kalenderPendidikan.awalTahunAjaran },
    ]));
    children.push(createTextParagraph([
      { text: "Pembagian Semester: ", bold: true },
      { text: kalenderPendidikan.pembagianSemester },
    ]));
    children.push(createTextParagraph([
      { text: "Perkiraan Asesmen: ", bold: true },
      { text: kalenderPendidikan.perkiraanAsesmen },
    ]));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    if (catatan && catatan.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "CATATAN", bold: true, font: "Times New Roman", size: 24 })],
          spacing: { before: 200, after: 100 },
        })
      );
      for (const cat of catatan) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${cat}`, font: "Times New Roman", size: 20 })],
            spacing: { after: 60 },
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 16838,
                height: 11906,
                orientation: PageOrientation.LANDSCAPE,
              },
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000,
                header: 720,
                footer: 720,
              },
            },
          },
          children,
        },
      ],
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