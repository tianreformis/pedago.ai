"use client";

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { RPPInput, RPPOutput } from "@/types/rpp";
import { FileDown, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

interface RPPExportButtonProps {
  rppInput: RPPInput;
  rppOutput: RPPOutput;
}

export default function RPPExportButton({ rppInput, rppOutput }: RPPExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"docx" | "xlsx" | null>(null);

  const handleExport = async (type: "docx" | "xlsx") => {
    setIsExporting(true);
    setExportType(type);
    try {
      if (type === "xlsx") {
        await exportExcel();
      } else {
        await exportDocx();
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
    const doc = createRPPDocument(rppInput, rppOutput);
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPP_${rppInput.mataPelajaran}_${rppInput.fase}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportExcel = async () => {
    const wb = XLSX.utils.book_new();

    const boldStyle = { font: { bold: true, name: "Times New Roman", size: 11 } };
    const normalStyle = { font: { name: "Times New Roman", size: 11 } };
    const cellStyle = {
      font: { name: "Times New Roman", size: 11 },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const { karakteristikPembelajar, desainPembelajaran, pengalamanBelajar, asesmen, glosarium, pertanyaanRefleksiGuru, lembarKerjaPesertaDidik } = rppOutput;

    const sheetData: any[] = [];

    sheetData.push([{ t: "s", v: "RENCANA PEMBELAJARAN MENDALAM (RPM)", s: { font: { bold: true, name: "Times New Roman", size: 16 }, alignment: { horizontal: "center" as const } } }]);
    if (rppInput.sekolah) {
      sheetData.push([{ t: "s", v: rppInput.sekolah, s: { font: { name: "Times New Roman", size: 12 }, alignment: { horizontal: "center" as const } } }]);
    }
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "IDENTITAS", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Mata Pelajaran", s: boldStyle }, { t: "s", v: rppInput.mataPelajaran, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Fase", s: boldStyle }, { t: "s", v: rppInput.fase, s: cellStyle }]);
    if (rppInput.kelas) sheetData.push([{ t: "s", v: "Kelas", s: boldStyle }, { t: "s", v: rppInput.kelas, s: cellStyle }]);
    if (rppInput.namaGuru) sheetData.push([{ t: "s", v: "Guru", s: boldStyle }, { t: "s", v: rppInput.namaGuru, s: cellStyle }]);
    if (rppInput.tahunAjaran) sheetData.push([{ t: "s", v: "Tahun Ajaran", s: boldStyle }, { t: "s", v: rppInput.tahunAjaran, s: cellStyle }]);
    if (rppInput.alokasWaktu) sheetData.push([{ t: "s", v: "Alokasi Waktu", s: boldStyle }, { t: "s", v: rppInput.alokasWaktu, s: cellStyle }]);
    if (rppInput.semester) sheetData.push([{ t: "s", v: "Semester", s: boldStyle }, { t: "s", v: rppInput.semester, s: cellStyle }]);
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "A. KARAKTERISTIK PEMBELAJARAN", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Kesiapan Peserta Didik", s: boldStyle }]);
    sheetData.push([karakteristikPembelajar.kesiapanPesertaDidik].map(v => ({ t: "s", v, s: cellStyle })));
    sheetData.push([{ t: "s", v: "Karakteristik Materi", s: boldStyle }]);
    sheetData.push([karakteristikPembelajar.karakteristikMateri].map(v => ({ t: "s", v, s: cellStyle })));
    sheetData.push([{ t: "s", v: "Dimensi Profil Lulusan", s: boldStyle }]);
    sheetData.push([karakteristikPembelajar.dimensiProfilLulusan.join(", ")].map(v => ({ t: "s", v, s: cellStyle })));
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "B. DESAIN PEMBELAJARAN", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Capaian Pembelajaran", s: boldStyle }]);
    sheetData.push([desainPembelajaran.capaianPembelajaran].map(v => ({ t: "s", v, s: cellStyle })));
    sheetData.push([{ t: "s", v: "Topik Pembelajaran", s: boldStyle }]);
    sheetData.push([desainPembelajaran.topikPembelajaran].map(v => ({ t: "s", v, s: cellStyle })));
    if (desainPembelajaran.lintasDisiplinIlmu) {
      sheetData.push([{ t: "s", v: "Lintas Disiplin Ilmu", s: boldStyle }]);
      sheetData.push([desainPembelajaran.lintasDisiplinIlmu].map(v => ({ t: "s", v, s: cellStyle })));
    }
    sheetData.push([{ t: "s", v: "Tujuan Pembelajaran", s: boldStyle }]);
    desainPembelajaran.tujuanPembelajaran.forEach((tp) => {
      sheetData.push([`• ${tp.replace(/^[0-9]+[\.\)]\s*/, "")}`].map(v => ({ t: "s", v, s: cellStyle })));
    });
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "C. PENGALAMAN BELAJAR", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Fase Awal", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Prinsip", s: boldStyle }, { t: "s", v: pengalamanBelajar.awal.prinsip, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Orientasi", s: boldStyle }, { t: "s", v: pengalamanBelajar.awal.orientasi, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Apersepsi", s: boldStyle }, { t: "s", v: pengalamanBelajar.awal.apersepsi, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Motivasi", s: boldStyle }, { t: "s", v: pengalamanBelajar.awal.motivasi, s: cellStyle }]);
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "Fase Inti - Memahami", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Prinsip", s: boldStyle }, { t: "s", v: pengalamanBelajar.inti.memahami.prinsip, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Langkah Kegiatan", s: boldStyle }]);
    ((pengalamanBelajar.inti.memahami as any).kegitan || []).forEach((activity: string) => {
      sheetData.push([`• ${activity}`].map(v => ({ t: "s", v, s: cellStyle })));
    });
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "Fase Inti - Mengaplikasi", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Prinsip", s: boldStyle }, { t: "s", v: pengalamanBelajar.inti.mengaplikasi.prinsip, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Langkah Kegiatan", s: boldStyle }]);
    ((pengalamanBelajar.inti.mengaplikasi as any).kegitan || []).forEach((activity: string) => {
      sheetData.push([`• ${activity}`].map(v => ({ t: "s", v, s: cellStyle })));
    });
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "Fase Inti - Merefleksi", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Prinsip", s: boldStyle }, { t: "s", v: pengalamanBelajar.inti.merefleksi.prinsip, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Langkah Kegiatan", s: boldStyle }]);
    ((pengalamanBelajar.inti.merefleksi as any).kegitan || []).forEach((activity: string) => {
      sheetData.push([`• ${activity}`].map(v => ({ t: "s", v, s: cellStyle })));
    });
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "Fase Penutup", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Langkah Kegiatan", s: boldStyle }]);
    ((pengalamanBelajar.penutup as any).kegitan || []).forEach((activity: string) => {
      sheetData.push([`• ${activity}`].map(v => ({ t: "s", v, s: cellStyle })));
    });
    sheetData.push([{}]);

    sheetData.push([{ t: "s", v: "D. ASESMEN PEMBELAJARAN", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Asesmen Awal (Assessment as Learning)", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Teknik", s: boldStyle }, { t: "s", v: asesmen.asesmenAwal.teknik, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Instrumen", s: boldStyle }, { t: "s", v: asesmen.asesmenAwal.instrumen, s: cellStyle }]);
    sheetData.push([{}]);
    sheetData.push([{ t: "s", v: "Asesmen Formatif (Assessment for Learning)", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Teknik", s: boldStyle }, { t: "s", v: asesmen.asesmenFormatif.teknik, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Instrumen", s: boldStyle }, { t: "s", v: asesmen.asesmenFormatif.instrumen, s: cellStyle }]);
    sheetData.push([{}]);
    sheetData.push([{ t: "s", v: "Asesmen Sumatif (Assessment of Learning)", s: boldStyle }]);
    sheetData.push([{ t: "s", v: "Teknik", s: boldStyle }, { t: "s", v: asesmen.asesmenSumatif.teknik, s: cellStyle }]);
    sheetData.push([{ t: "s", v: "Instrumen", s: boldStyle }, { t: "s", v: asesmen.asesmenSumatif.instrumen, s: cellStyle }]);
    sheetData.push([{}]);
    sheetData.push([{ t: "s", v: "Pengayaan", s: boldStyle }]);
    sheetData.push([asesmen.pengayaan].map(v => ({ t: "s", v, s: cellStyle })));
    sheetData.push([{ t: "s", v: "Remedial", s: boldStyle }]);
    sheetData.push([asesmen.remedial].map(v => ({ t: "s", v, s: cellStyle })));
    sheetData.push([{}]);

    if (glosarium?.terms) {
      sheetData.push([{ t: "s", v: "E. GLOSARIUM", s: boldStyle }]);
      glosarium.terms.forEach((term) => {
        sheetData.push([{ t: "s", v: term.istilah, s: boldStyle }, { t: "s", v: term.definisi, s: cellStyle }]);
      });
      sheetData.push([{}]);
    }

    if (pertanyaanRefleksiGuru?.pertanyaan) {
      sheetData.push([{ t: "s", v: "F. PERTANYAAN REFLEKSI GURU", s: boldStyle }]);
      if (pertanyaanRefleksiGuru.tujuan) {
        sheetData.push([pertanyaanRefleksiGuru.tujuan].map(v => ({ t: "s", v, s: { ...cellStyle, font: { ...cellStyle.font, italic: true } } })));
      }
      pertanyaanRefleksiGuru.pertanyaan.forEach((q, i) => {
        sheetData.push([`${i + 1}. ${q.replace(/^\d+\.\s*/, "")}`].map(v => ({ t: "s", v, s: cellStyle })));
      });
      sheetData.push([{}]);
    }

    if (lembarKerjaPesertaDidik?.namaLembarKerja) {
      sheetData.push([{ t: "s", v: "G. LEMBAR KERJA PESERTA DIDIK", s: boldStyle }]);
      sheetData.push([{ t: "s", v: "Nama Lembar Kerja", s: boldStyle }, { t: "s", v: lembarKerjaPesertaDidik.namaLembarKerja, s: cellStyle }]);
      if (lembarKerjaPesertaDidik.instruksi) {
        sheetData.push([{ t: "s", v: "Instruksi", s: boldStyle }, { t: "s", v: lembarKerjaPesertaDidik.instruksi, s: cellStyle }]);
      }
      if (lembarKerjaPesertaDidik.tugas) {
        sheetData.push([{ t: "s", v: "Tugas", s: boldStyle }]);
        lembarKerjaPesertaDidik.tugas.forEach((tugas) => {
          sheetData.push([`${tugas.nomor}. ${tugas.pertanyaan}`].map(v => ({ t: "s", v, s: cellStyle })));
          if (tugas.ruangJawaban) {
            sheetData.push([`   Jawaban: ${tugas.ruangJawaban}`].map(v => ({ t: "s", v, s: cellStyle })));
          }
        });
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!cols"] = [{ wch: 30 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(wb, ws, "RPP");

    const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbOut], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPP_${rppInput.mataPelajaran}_${rppInput.fase}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("docx")}
        disabled={isExporting}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        type="button"
      >
        {isExporting && exportType === "docx" ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
        Word
      </button>
      <button
        onClick={() => handleExport("xlsx")}
        disabled={isExporting}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        type="button"
      >
        {isExporting && exportType === "xlsx" ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
        Excel
      </button>
    </div>
  );
}

function createRPPDocument(input: RPPInput, output: RPPOutput): Document {
  const { karakteristikPembelajar, desainPembelajaran, pengalamanBelajar, asesmen, glosarium, pertanyaanRefleksiGuru, lembarKerjaPesertaDidik } = output;

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
  if (input.semester) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Semester: ", bold: true }),
          new TextRun(input.semester),
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
      children: [
        new TextRun({ text: "Topik Pembelajaran: ", bold: true }),
        new TextRun(desainPembelajaran.topikPembelajaran),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  if (desainPembelajaran.lintasDisiplinIlmu) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Lintas Disiplin Ilmu: ", bold: true }),
          new TextRun(desainPembelajaran.lintasDisiplinIlmu),
        ],
      })
    );
  }

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Tujuan Pembelajaran:", bold: true })],
    })
  );

  // Use simple text instead of bullet
  for (const tp of desainPembelajaran.tujuanPembelajaran) {
    children.push(new Paragraph({ text: tp.replace(/^[0-9]+[\.\)]\s*/, "") }));
  }
  children.push(new Paragraph({ text: "" }));

  if (desainPembelajaran.pertanyaanPenuntunPemahaman && desainPembelajaran.pertanyaanPenuntunPemahaman.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Pertanyaan Penuntun Pemahaman:", bold: true })],
      })
    );
    for (const p of desainPembelajaran.pertanyaanPenuntunPemahaman) {
      children.push(new Paragraph({ text: p.replace(/^[0-9]+[\.\)]\s*/, "") }));
    }
    children.push(new Paragraph({ text: "" }));
  }

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

  if (desainPembelajaran.kemitraanPembelajaran) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Kemitraan Pembelajaran: ", bold: true }),
          new TextRun(desainPembelajaran.kemitraanPembelajaran),
        ],
      })
    );
  }

  if (desainPembelajaran.pemanfaatanTeknologi) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Pemanfaatan Teknologi: ", bold: true }),
          new TextRun(desainPembelajaran.pemanfaatanTeknologi),
        ],
      })
    );
  }

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Kriteria Pencapaian TP:", bold: true })],
    })
  );
  for (const k of desainPembelajaran.kriteriaPencapaianTP) {
    children.push(new Paragraph({ text: k.replace(/^[0-9]+[\.\)]\s*/, "") }));
  }
  children.push(new Paragraph({ text: "" }));

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Dimensi Profil Lulusan: ", bold: true }),
        new TextRun(desainPembelajaran.dimensiProfilLulusan),
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
  children.push(new Paragraph({ text: "" }));

  // Pengayaan
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Pengayaan", bold: true })],
    })
  );
  children.push(new Paragraph({ text: asesmen.pengayaan }));
  children.push(new Paragraph({ text: "" }));

  // Remedial
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Remedial", bold: true })],
    })
  );
  children.push(new Paragraph({ text: asesmen.remedial }));
  children.push(new Paragraph({ text: "" }));

  // E. Glosarium
  children.push(
    new Paragraph({
      text: "E. GLOSARIUM",
      heading: HeadingLevel.HEADING_2,
    })
  );
  if (glosarium?.terms) {
    for (const term of glosarium.terms) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${term.istilah}: `, bold: true }),
            new TextRun(term.definisi),
          ],
        })
      );
    }
  }
  children.push(new Paragraph({ text: "" }));

  // F. Pertanyaan Refleksi Guru
  children.push(
    new Paragraph({
      text: "F. PERTANYAAN REFLEKSI GURU",
      heading: HeadingLevel.HEADING_2,
    })
  );
  if (pertanyaanRefleksiGuru?.tujuan) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: pertanyaanRefleksiGuru.tujuan, italics: true }),
        ],
      })
    );
  }
  if (pertanyaanRefleksiGuru?.pertanyaan) {
    for (let i = 0; i < pertanyaanRefleksiGuru.pertanyaan.length; i++) {
      let question = pertanyaanRefleksiGuru.pertanyaan[i];
      question = question.replace(/^\d+\.\s*/, "");
      children.push(new Paragraph({ text: `${i + 1}. ${question}` }));
    }
  }
  children.push(new Paragraph({ text: "" }));

  // F. Lembar Kerja Peserta Didik
  children.push(
    new Paragraph({
      text: "G. LEMBAR KERJA PESERTA DIDIK",
      heading: HeadingLevel.HEADING_2,
    })
  );
  if (lembarKerjaPesertaDidik?.namaLembarKerja) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Nama Lembar Kerja: ", bold: true }),
          new TextRun(lembarKerjaPesertaDidik.namaLembarKerja),
        ],
      })
    );
  }
  if (lembarKerjaPesertaDidik?.instruksi) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Instruksi: ", bold: true }),
          new TextRun(lembarKerjaPesertaDidik.instruksi),
        ],
      })
    );
  }
  if (lembarKerjaPesertaDidik?.tugas) {
    children.push(new Paragraph({ children: [new TextRun({ text: "Tugas:", bold: true })] }));
    for (const tugas of lembarKerjaPesertaDidik.tugas) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${tugas.nomor}. ${tugas.pertanyaan}`, bold: true }),
          ],
        })
      );
      if (tugas.ruangJawaban) {
        children.push(new Paragraph({ text: `   Jawaban: ${tugas.ruangJawaban}` }));
      }
    }
  }

  return new Document({
    sections: [{ children }],
  });
}