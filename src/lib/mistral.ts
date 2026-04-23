import { RPPInput, RPPOutput } from "@/types/rpp";

export async function generateRPP(input: RPPInput): Promise<RPPOutput> {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    throw new Error("Mistral API key not configured");
  }

  const systemPrompt = `Kamu adalah asisten pendidikan ahli kurikulum Indonesia. 
Tugasmu adalah membuat Rencana Pembelajaran Mendalam (RPM/Deep Learning) yang lengkap dan sesuai format resmi Kemendikdasmen Indonesia.

FORMAT WAJIB: Kembalikan HANYA JSON valid, tanpa penjelasan, tanpa markdown, tanpa komentar apapun.
Gunakan Capaian Pembelajaran (CP) resmi dari Kemendikbud/Kemendikdasmen yang sesuai fase dan mata pelajaran.

REFERENSI STRUKTUR RPP PEMBELAJARAN MENDALAM (Kemendikdasmen):
- Pembelajaran Mendalam adalah pendekatan yang menekankan suasana belajar BERKESADARAN, BERMAKNA, dan MENGGEMBIRAKAN
- Mengintegrasikan 3 jenis pengetahuan: deklaratif (apa), prosedural (bagaimana), kontekstual (mengapa)
- 8 Dimensi Profil Lulusan: Keimanan & Ketakwaan, Kewargaan, Kreativitas, Kemandirian, Komunikasi, Kesehatan, Kolaborasi, Penalaran Kritis
- Fase Kurikulum: Fase A (kelas 1-2), Fase B (kelas 3-4), Fase C (kelas 5-6), Fase D (kelas 7-9), Fase E (kelas 10), Fase F (kelas 11-12)
- Asesmen: AS Learning (penilaian diri/sejawat), FOR Learning (umpan balik), OF Learning (pencapaian)
- Pengalaman belajar: AWAL (orientasi bermakna, apersepsi kontekstual, motivasi) → INTI (Memahami → Mengaplikasi → Merefleksi) → PENUTUP

Tujuan Pembelajaran HARUS menggunakan kata kerja operasional Taksonomi Bloom yang sesuai.
Capaian Pembelajaran HARUS mengacu pada CP resmi Kemendikbud untuk fase dan mapel yang diminta.`;

  const userPrompt = `Buatkan RPP Pembelajaran Mendalam lengkap untuk:
- Mata Pelajaran: ${input.mataPelajaran}
- Fase: ${input.fase}
- Capaian Pembelajaran (CP): ${input.cp}
${input.kelas ? `- Kelas: ${input.kelas}` : ""}
${input.alokasWaktu ? `- Alokasi Waktu: ${input.alokasWaktu}` : "- Alokasi Waktu: 2 x 45 menit (1 pertemuan)"}
${input.semester ? `- Semester: ${input.semester}` : ""}

Kembalikan JSON dengan struktur PERSIS seperti ini (isi semua field dengan konten nyata dan detail):

{
  "karakteristikPembelajar": {
    "kesiapanPesertaDidik": "...",
    "karakteristikMateri": "...",
    "dimensiProfilLulusan": ["...", "...", "..."]
  },
  "desainPembelajaran": {
    "capaianPembelajaran": "...",
    "lintasDisiplinIlmu": "...",
    "tujuanPembelajaran": ["1. ...", "2. ...", "3. ..."],
    "topikPembelajaran": "...",
    "praktikPedagogis": "...",
    "kemitraanPembelajaran": "...",
    "lingkunganBelajar": "...",
    "pemanfaatanTeknologi": "...",
    "kriteriaPencapaianTP": ["...", "...", "..."],
    "dimensiProfilLulusan": "..."
  },
  "pengalamanBelajar": {
    "awal": {
      "prinsip": "...",
      "orientasi": "...",
      "apersepsi": "...",
      "motivasi": "...",
      "durasi": "10 menit"
    },
    "inti": {
      "memahami": {
        "prinsip": "...",
        "kegiatan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "30 menit"
      },
      "mengaplikasi": {
        "prinsip": "...",
        "kegiatan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "30 menit"
      },
      "merefleksi": {
        "prinsip": "...",
        "kegiatan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "15 menit"
      }
    },
    "penutup": {
      "kegitan": ["1. ...", "2. ...", "3. ..."],
      "durasi": "5 menit"
    }
  },
  "asesmen": {
    "asesmenAwal": {
      "teknik": "...",
      "instrumen": "..."
    },
    "asesmenFormatif": {
      "teknik": "...",
      "instrumen": "..."
    },
    "asesmenSumatif": {
      "teknik": "...",
      "instrumen": "..."
    }
  },
  "pertanyaanRefleksiGuru": {
    "pertanyaan": ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."],
    "tujuan": "Membantu guru merefleksikan keberhasilan pembelajaran dan perbaikan untuk pertemuan berikutnya"
  },
  "lembarKerjaPesertaDidik": {
    "namaLembarKerja": "Lembar Kerja [Nama Materi]",
    "instruksi": "Isilah atau kerjakan tugas berikut dengan tulisan tangan yang rapi.",
    "tugas": [
      {
        "nomor": 1,
        "pertanyaan": "Pertanyaan tentang pemahaman konsep",
        "ruangJawaban": "............................\n............................\n............................"
      },
      {
        "nomor": 2,
        "pertanyaan": "Pertanyaan tentang aplikasi konsep",
        "ruangJawaban": "............................\n............................\n............................"
      },
      {
        "nomor": 3,
        "pertanyaan": "Pertanyaan analisis atau penalaran",
        "ruangJawaban": "............................\n............................\n............................"
      }
    ]
  }
}`;

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  const clean = (typeof text === "string" ? text : "")
    .replace(/```json\n?|\n?```/g, "")
    .trim();

  return JSON.parse(clean) as RPPOutput;
}

export interface ProtaInput {
  mataPelajaran: string;
  fase: string;
  kelas: string[];
  namaGuru?: string;
  sekolah?: string;
  tahunAjaran?: string;
}

export interface ProtaOutput {
  informasiUmum: {
    mataPelajaran: string;
    fase: string;
    kelas: string[];
    tahunAjaran: string;
    namaGuru: string;
    sekolah: string;
  };
  alurPembelajaran: Array<{
    semester: string;
    mingguan: Array<{
      minggu: number;
      topik: string;
      cp: string;
      tujuanPembelajaran: string[];
      alokasWaktu: string;
    }>;
  }>;
  rekapitulasi: {
    totalJam: string;
    totalMinggu: number;
    distribusiTopik: Record<string, number>;
  };
}

export async function generateProta(input: ProtaInput): Promise<ProtaOutput> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error("Mistral API key not configured");
  }

  const systemPrompt = `Kamu adalah asisten pendidikan ahli kurikulum Indonesia.
Tugasmu adalah membuat Program Tahunan (Prota) yang lengkap dan sesuai format resmi Kemendikdasmen Indonesia.

FORMAT WAJIB: Kembalikan HANYA JSON valid, tanpa penjelasan, tanpa markdown, tanpa komentar apapun.
Gunakan Capaian Pembelajaran (CP) resmi dari Kemendikdasmen yang sesuai fase dan mata pelajaran.

PROGRAM TAHUNAN (PROTA):
- Prota adalah rencana프로그램 pembelajaran yang menjabarkan alur pembelajaran selama satu tahun ajaran
- Mencakup distribusi CP/tujuan pembelajaran ke dalam mingguan/bulanan
- Memperhatikan alokasi waktu dan urutan topik
- Memperhatikan keterkaitan antar topik dan kesinambungan pembelajaran`;

  const userPrompt = `Buatkan Program Tahunan (Prota) lengkap untuk:
- Mata Pelajaran: ${input.mataPelajaran}
- Fase: ${input.fase}
- Kelas: ${input.kelas.join(", ")}
${input.tahunAjaran ? `- Tahun Ajaran: ${input.tahunAjaran}` : "- Tahun Ajaran: 2025/2026"}
${input.namaGuru ? `- Nama Guru: ${input.namaGuru}` : ""}
${input.sekolah ? `- Sekolah: ${input.sekolah}` : ""}

Kembalikan JSON dengan struktur PERSIS seperti ini (isi semua field dengan konten nyata dan detail):

{
  "informasiUmum": {
    "mataPelajaran": "${input.mataPelajaran}",
    "fase": "${input.fase}",
    "kelas": [${input.kelas.map(k => `"${k}"`).join(", ")}],
    "tahunAjaran": "${input.tahunAjaran || "2025/2026"}",
    "namaGuru": "${input.namaGuru || ""}",
    "sekolah": "${input.sekolah || ""}"
  },
  "alurPembelajaran": [
    {
      "semester": "Semester 1 (Ganjil)",
      "mingguan": [
        {
          "minggu": 1,
          "topik": "Topik pembelajaran minggu 1",
          "cp": "Capaian pembelajaran yang dibahas",
          "tujuanPembelajaran": ["1. Tujuan pembelajaran 1", "2. Tujuan pembelajaran 2"],
          "alokasWaktu": "4 x 45 menit"
        },
        {
          "minggu": 2,
          "topik": "Topik pembelajaran minggu 2",
          "cp": "Capaian pembelajaran yang dibahas",
          "tujuanPembelajaran": ["1. Tujuan pembelajaran 1", "2. Tujuan pembelajaran 2"],
          "alokasWaktu": "4 x 45 menit"
        }
      ]
    },
    {
      "semester": "Semester 2 (Genap)",
      "mingguan": [
        {
          "minggu": 1,
          "topik": "Topik pembelajaran minggu 1 semester 2",
          "cp": "Capaian pembelajaran yang dibahas",
          "tujuanPembelajaran": ["1. Tujuan pembelajaran 1", "2. Tujuan pembelajaran 2"],
          "alokasWaktu": "4 x 45 menit"
        }
      ]
    }
  ],
  "rekapitulasi": {
    "totalJam": "Total jam pelajaran dalam setahun",
    "totalMinggu": 34,
    "distribusiTopik": {
      "Topik 1": 4,
      "Topik 2": 6,
      "Topik 3": 4
    }
  }
}`;

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      temperature: 0.3,
      max_tokens: 6000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  const clean = (typeof text === "string" ? text : "")
    .replace(/```json\n?|\n?```/g, "")
    .trim();

  return JSON.parse(clean) as ProtaOutput;
}
