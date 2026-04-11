"use client";

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { RPPInput, RPPOutput } from "@/types/rpp";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface RPPExportButtonProps {
  rppInput: RPPInput;
  rppOutput: RPPOutput;
}

export default function RPPExportButton({ rppInput, rppOutput }: RPPExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log("Creating document...");
      const doc = createRPPDocument(rppInput, rppOutput);
      console.log("Generating blob...");
      const blob = await Packer.toBlob(doc);
      console.log("Creating download link...");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RPP_${rppInput.mataPelajaran}_${rppInput.fase}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Download triggered");
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengekspor dokumen: " + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
      type="button"
    >
      {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
      {isExporting ? "Mengekspor..." : "Export Word"}
    </button>
  );
}

function createRPPDocument(input: RPPInput, output: RPPOutput): Document {
  const { karakteristikPembelajar, desainPembelajaran, pengalamanBelajar, asesmen } = output;

  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: "RENCANA PEMBELAJARAN MENDALAM (RPM)",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    })
  );
  children.push(new Paragraph({ text: "" }));

  // School
  if (input.sekolah) {
    children.push(
      new Paragraph({
        text: input.sekolah,
        alignment: AlignmentType.CENTER,
      })
    );
    children.push(new Paragraph({ text: "" }));
  }

  // Identity
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
        new TextRun(input.mataPelajaran),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Fase: ", bold: true }),
        new TextRun(input.fase),
      ],
    })
  );
  if (input.kelas) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Kelas: ", bold: true }),
          new TextRun(input.kelas),
        ],
      })
    );
  }
  if (input.namaGuru) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Guru: ", bold: true }),
          new TextRun(input.namaGuru),
        ],
      })
    );
  }
  if (input.tahunAjaran) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Tahun Ajaran: ", bold: true }),
          new TextRun(input.tahunAjaran),
        ],
      })
    );
  }
  if (input.alokasWaktu) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Alokasi Waktu: ", bold: true }),
          new TextRun(input.alokasWaktu),
        ],
      })
    );
  }
  children.push(new Paragraph({ text: "" }));

  // A. Karakteristik Pembelajaran
  children.push(
    new Paragraph({
      text: "A. KARAKTERISTIK PEMBELAJARAN",
      heading: HeadingLevel.HEADING_2,
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Kesiapan Peserta Didik: ", bold: true }),
        new TextRun(karakteristikPembelajar.kesiapanPesertaDidik),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Karakteristik Materi: ", bold: true }),
        new TextRun(karakteristikPembelajar.karakteristikMateri),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Dimensi Profil Lulusan: ", bold: true }),
        new TextRun(karakteristikPembelajar.dimensiProfilLulusan.join(", ")),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  // B. Desain Pembelajaran
  children.push(
    new Paragraph({
      text: "B. DESAIN PEMBELAJARAN",
      heading: HeadingLevel.HEADING_2,
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Capaian Pembelajaran: ", bold: true }),
        new TextRun(desainPembelajaran.capaianPembelajaran),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));
  
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Tujuan Pembelajaran:", bold: true })],
    })
  );
  
  // Use simple text instead of bullet
  for (const tp of desainPembelajaran.tujuanPembelajaran) {
    children.push(new Paragraph({ text: `• ${tp}` }));
  }
  children.push(new Paragraph({ text: "" }));

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Topik Pembelajaran: ", bold: true }),
        new TextRun(desainPembelajaran.topikPembelajaran),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Praktik Pedagogis: ", bold: true }),
        new TextRun(desainPembelajaran.praktikPedagogis),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Lingkungan Belajar: ", bold: true }),
        new TextRun(desainPembelajaran.lingkunganBelajar),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  // C. Pengalaman Belajar
  children.push(
    new Paragraph({
      text: "C. PENGALAMAN BELAJAR",
      heading: HeadingLevel.HEADING_2,
    })
  );

  // Fase Awal
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Fase Awal", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Prinsip: ", bold: true }),
        new TextRun(pengalamanBelajar.awal.prinsip),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Orientasi: ", bold: true }),
        new TextRun(pengalamanBelajar.awal.orientasi),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Apersepsi: ", bold: true }),
        new TextRun(pengalamanBelajar.awal.apersepsi),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Motivasi: ", bold: true }),
        new TextRun(pengalamanBelajar.awal.motivasi),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  // Fase Inti - Memahami
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Fase Inti - Memahami", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Prinsip: ", bold: true }),
        new TextRun(pengalamanBelajar.inti.memahami.prinsip),
      ],
    })
  );
  children.push(new Paragraph({ text: "Langkah Kegiatan:" }));
  const memahamiActivities = (pengalamanBelajar.inti.memahami as any).kegitan || [];
  for (const activity of memahamiActivities) {
    children.push(new Paragraph({ text: `• ${activity}` }));
  }
  children.push(new Paragraph({ text: "" }));

  // Fase Inti - Mengaplikasi
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Fase Inti - Mengaplikasi", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Prinsip: ", bold: true }),
        new TextRun(pengalamanBelajar.inti.mengaplikasi.prinsip),
      ],
    })
  );
  children.push(new Paragraph({ text: "Langkah Kegiatan:" }));
  const mengaplikasiActivities = (pengalamanBelajar.inti.mengaplikasi as any).kegitan || [];
  for (const activity of mengaplikasiActivities) {
    children.push(new Paragraph({ text: `• ${activity}` }));
  }
  children.push(new Paragraph({ text: "" }));

  // Fase Inti - Merefleksi
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Fase Inti - Merefleksi", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Prinsip: ", bold: true }),
        new TextRun(pengalamanBelajar.inti.merefleksi.prinsip),
      ],
    })
  );
  children.push(new Paragraph({ text: "Langkah Kegiatan:" }));
  const merefleksiActivities = (pengalamanBelajar.inti.merefleksi as any).kegitan || [];
  for (const activity of merefleksiActivities) {
    children.push(new Paragraph({ text: `• ${activity}` }));
  }
  children.push(new Paragraph({ text: "" }));

  // Fase Penutup
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Fase Penutup", bold: true })],
    })
  );
  children.push(new Paragraph({ text: "Langkah Kegiatan:" }));
  const penutupActivities = (pengalamanBelajar.penutup as any).kegitan || [];
  for (const activity of penutupActivities) {
    children.push(new Paragraph({ text: `• ${activity}` }));
  }
  children.push(new Paragraph({ text: "" }));

  // D. Asesmen Pembelajaran
  children.push(
    new Paragraph({
      text: "D. ASESMEN PEMBELAJARAN",
      heading: HeadingLevel.HEADING_2,
    })
  );

  // Asesmen Awal
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Asesmen Awal (Assessment as Learning)", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Teknik: ", bold: true }),
        new TextRun(asesmen.asesmenAwal.teknik),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Instrumen: ", bold: true }),
        new TextRun(asesmen.asesmenAwal.instrumen),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  // Asesmen Formatif
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Asesmen Formatif (Assessment for Learning)", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Teknik: ", bold: true }),
        new TextRun(asesmen.asesmenFormatif.teknik),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Instrumen: ", bold: true }),
        new TextRun(asesmen.asesmenFormatif.instrumen),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  // Asesmen Sumatif
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Asesmen Sumatif (Assessment of Learning)", bold: true })],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Teknik: ", bold: true }),
        new TextRun(asesmen.asesmenSumatif.teknik),
      ],
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Instrumen: ", bold: true }),
        new TextRun(asesmen.asesmenSumatif.instrumen),
      ],
    })
  );

  return new Document({
    sections: [{ children }],
  });
}