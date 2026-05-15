export function jenjangKelasToFaseNames(jenjang: string, kelas: string): string[] {
  const k = parseInt(kelas, 10);
  if (jenjang === "SD") {
    if (k <= 2) return ["Fase A"];
    if (k <= 4) return ["Fase B"];
    if (k <= 6) return ["Fase C"];
    return [];
  }
  if (jenjang === "SMP") return ["Fase D"];
  if (jenjang === "SMA" || jenjang === "SMK") {
    if (k === 10) return ["Fase E"];
    if (k >= 11) return ["Fase F"];
    return [];
  }
  return [];
}

export function getKelasOptions(jenjang: string): string[] {
  if (jenjang === "SD") return ["1", "2", "3", "4", "5", "6"];
  if (jenjang === "SMP") return ["7", "8", "9"];
  if (jenjang === "SMA" || jenjang === "SMK") return ["10", "11", "12"];
  return [];
}

export const JENJANG_OPTIONS = ["SD", "SMP", "SMA", "SMK"];
