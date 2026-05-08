"use client";

import { useState } from "react";
import { PromesOutput } from "@/types/promes";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from "docx";
import { FileDown, FileText, Loader2 } from "lucide-react";

interface PromesExportButtonProps {
  output: PromesOutput;
}

export default function PromesExportButton({ output }: PromesExportButtonProps) {
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

  const allBulan = Object.keys(output.tabelPromes[0]?.distribusi || {});
  const maxMingguPerBulan: Record<string, number> = {};
  allBulan.forEach((bulan) => {
    output.tabelPromes.forEach((row) => {
      const weeks = Object.keys(row.distribusi[bulan] || {});
      maxMingguPerBulan[bulan] = Math.max(maxMingguPerBulan[bulan] || 0, weeks.length);
    });
  });

  const headerWeeks: string[] = [];
  allBulan.forEach((bulan) => {
    for (let w = 1; w <= maxMingguPerBulan[bulan]; w++) {
      headerWeeks.push(`M${w}`);
    }
  });

  const exportDocx = async () => {
    const children: (Paragraph | Table)[] = [];

    children.push(
      new Paragraph({
        text: "PROGRAM SEMESTER (PROMES)",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(
      new Paragraph({
        text: output.identitas.satuanPendidikan,
        alignment: AlignmentType.CENTER,
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(new Paragraph({ text: "IDENTITAS", heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Mata Pelajaran: ", bold: true }), new TextRun(output.identitas.mataPelajaran)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Fase/Kelas: ", bold: true }), new TextRun(output.identitas.faseKelas)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Tahun Pelajaran: ", bold: true }), new TextRun(output.identitas.tahunPelajaran)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Semester: ", bold: true }), new TextRun(output.identitas.semester)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Total JP: ", bold: true }), new TextRun(`${output.totalJp} JP`)] }));
    children.push(new Paragraph({ text: "" }));

    children.push(new Paragraph({ text: "DISTRIBUSI PEMBELAJARAN", heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: "" }));

    const headerRow = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No", bold: true })] })], shading: { fill: "E8E8E8" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Bab", bold: true })] })], shading: { fill: "E8E8E8" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tujuan Pembelajaran", bold: true })] })], shading: { fill: "E8E8E8" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "JP", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "E8E8E8" } }),
        ...allBulan.flatMap((bulan) =>
          Array.from({ length: maxMingguPerBulan[bulan] }, (_, i) => i + 1).map((w) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${bulan}\nM${w}`, bold: true })], alignment: AlignmentType.CENTER })],
              shading: { fill: "E8E8E8" },
            })
          )
        ),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Aktivitas Utama", bold: true })] })], shading: { fill: "E8E8E8" } }),
      ],
    });

    const tableRows = [headerRow];

    for (const row of output.tabelPromes) {
      const cells = [
        new TableCell({ children: [new Paragraph({ text: String(row.no), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: row.bab })] }),
        new TableCell({ children: [new Paragraph({ text: row.tujuanPembelajaran })] }),
        new TableCell({ children: [new Paragraph({ text: String(row.alokasiJp), alignment: AlignmentType.CENTER })] }),
        ...allBulan.flatMap((bulan) => {
          const weekKeys = Object.keys(row.distribusi[bulan] || {}).sort();
          return weekKeys.map((wk) => {
            const val = row.distribusi[bulan][wk] || 0;
            return new TableCell({ children: [new Paragraph({ text: String(val), alignment: AlignmentType.CENTER })] });
          });
        }),
        new TableCell({ children: [new Paragraph({ text: row.aktivitasUtama })] }),
      ];

      tableRows.push(new TableRow({ children: cells }));
    }

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
    children.push(new Paragraph({ text: "" }));

    children.push(new Paragraph({
      children: [new TextRun({ text: `Total JP: ${output.totalJp} JP`, bold: true })],
    }));

    if (output.validasi) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `Validasi: Total JP Promes (${output.validasi.totalJpPromes}) ${output.validasi.sesuai ? "=" : "≠"} Total JP Prota (${output.validasi.totalJpProta})`, italics: true }),
        ],
      }));
    }

    children.push(new Paragraph({ text: "" }));
    children.push(new Paragraph({
      children: [new TextRun({ text: "Keterangan: M1 = Minggu 1, M2 = Minggu 2, dst. Angka 0 menandakan minggu tidak efektif (libur, STS, atau SAS).", italics: true, size: 18 })],
    }));

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Promes_${output.identitas.mataPelajaran.replace(/\s+/g, "_")}_Semester_${output.identitas.semester}.docx`;
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

    const drawRowBg = (w: number, h: number) => {
      doc.setFillColor(240, 240, 240);
      doc.rect(x, y, w, h, "F");
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

    const tpColX = x;
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
