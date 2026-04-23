"use client";

import { ProtaOutput } from "@/lib/mistral";
import { Download } from "lucide-react";

interface ProtaExportButtonProps {
  input: any;
  output: ProtaOutput;
}

export default function ProtaExportButton({ input, output }: ProtaExportButtonProps) {
  const handleExport = () => {
    const { informasiUmum, alurPembelajaran, rekapitulasi } = output;

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Program Tahunan - ${informasiUmum.mataPelajaran}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { text-align: center; color: #059669; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f0fdf4; }
    .header-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
    .info-item { padding: 10px; background: #f9fafb; border-radius: 8px; }
    .info-label { font-size: 12px; color: #6b7280; }
    .info-value { font-weight: bold; }
    .semester-header { background: #d1fae5; padding: 10px 15px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>PROGRAM TAHUNAN (PROTA)</h1>
  
  <div class="header-info">
    <div class="info-item">
      <div class="info-label">Mata Pelajaran</div>
      <div class="info-value">${informasiUmum.mataPelajaran}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Fase</div>
      <div class="info-value">${informasiUmum.fase}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Tahun Ajaran</div>
      <div class="info-value">${informasiUmum.tahunAjaran}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Kelas</div>
      <div class="info-value">${informasiUmum.kelas.join(", ")}</div>
    </div>
    ${informasiUmum.namaGuru ? `
    <div class="info-item">
      <div class="info-label">Guru</div>
      <div class="info-value">${informasiUmum.namaGuru}</div>
    </div>
    ` : ""}
    ${informasiUmum.sekolah ? `
    <div class="info-item">
      <div class="info-label">Sekolah</div>
      <div class="info-value">${informasiUmum.sekolah}</div>
    </div>
    ` : ""}
  </div>
`;

    alurPembelajaran.forEach((semester) => {
      html += `
  <div class="semester-header">${semester.semester}</div>
  <table>
    <thead>
      <tr>
        <th>Minggu</th>
        <th>Topik</th>
        <th>Capaian Pembelajaran</th>
        <th>Alokasi</th>
      </tr>
    </thead>
    <tbody>
`;
      semester.mingguan.forEach((week) => {
        html += `
      <tr>
        <td>${week.minggu}</td>
        <td>${week.topik}</td>
        <td>${week.cp}</td>
        <td>${week.alokasWaktu}</td>
      </tr>
`;
      });
      html += `
    </tbody>
  </table>
`;
    });

    if (rekapitulasi) {
      html += `
  <h3>Rekapitulasi</h3>
  <table>
    <tr><td><strong>Total Minggu</strong></td><td>${rekapitulasi.totalMinggu} minggu</td></tr>
    <tr><td><strong>Total Jam</strong></td><td>${rekapitulasi.totalJam}</td></tr>
  </table>
`;
    }

    html += `
</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prota_${informasiUmum.mataPelajaran.replace(/\s+/g, "_")}_${informasiUmum.tahunAjaran}.html`;
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