"use client";

import { ProtaOutput } from "@/lib/mistral";
import { Download } from "lucide-react";

interface ProtaExportButtonProps {
  input: any;
  output: ProtaOutput;
}

export default function ProtaExportButton({ input, output }: ProtaExportButtonProps) {
  const handleExport = () => {
    const { identitas, capaianPembelajaran, alokasiWaktu, distribusiMateri, kalenderPendidikan, catatan } = output;

    let markdown = `# PROGRAM TAHUNAN (PROTA)

## Identitas
- **Satuan Pendidikan:** ${identitas.satuanPendidikan}
- **Mata Pelajaran:** ${identitas.mataPelajaran}
- **Fase/Kelas:** ${identitas.faseKelas}
- **Tahun Pelajaran:** ${identitas.tahunPelajaran}

## Capaian Pembelajaran
${capaianPembelajaran.map((cp, i) => `${i + 1}. ${cp}`).join("\n")}

## Alokasi Waktu
- **Jumlah Minggu Efektif:** ${alokasiWaktu.mingguEfektif} minggu
- **JP per Minggu:** ${alokasiWaktu.jpPerMinggu} JP
- **Total JP per Tahun:** ${alokasiWaktu.totalJpPertahun} JP

## Distribusi Materi / Tujuan Pembelajaran

| No | Materi / Tujuan Pembelajaran | Semester | Alokasi JP | Keterangan |
|----|----------------------------|----------|-----------|-----------|------------|
${distribusiMateri.map(item => `| ${item.nomor} | ${item.materi} | ${item.semester} | ${item.alokasiJp} JP | ${item.keterangan} |`).join("\n")}

## Kalender Pendidikan (Ringkas)
- **Awal Tahun Ajaran:** ${kalenderPendidikan.awalTahunAjaran}
- **Pembagian Semester:** ${kalenderPendidikan.pembagianSemester}
- **Perkiraan Asesmen:** ${kalenderPendidikan.perkiraanAsesmen}

## Catatan
${catatan.map((cat, i) => `- ${cat}`).join("\n")}
`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prota_${identitas.mataPelajaran.replace(/\s+/g, "_")}_${identitas.tahunPelajaran}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      <Download size={18} />
      Export
    </button>
  );
}