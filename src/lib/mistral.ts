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
  "glosarium": {
    "terms": [
      {
        "istilah": "Istilah 1",
        "definisi": "Definisi dari istilah 1"
      },
      {
        "istilah": "Istilah 2",
        "definisi": "Definisi dari istilah 2"
      }
    ]
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
  jpPerMinggu?: number;
  mingguEfektif?: number;
  cp?: string;
  materi?: string;
}

export interface ProtaOutput {
  identitas: {
    satuanPendidikan: string;
    mataPelajaran: string;
    faseKelas: string;
    tahunPelajaran: string;
  };
  capaianPembelajaran: string[];
  alokasiWaktu: {
    mingguEfektif: number;
    jpPerMinggu: number;
    totalJpPertahun: number;
  };
  distribusiMateri: Array<{
    nomor: number;
    materi: string;
    semester: string;
    alokasiJp: number;
    keterangan: string;
  }>;
  kalenderPendidikan: {
    awalTahunAjaran: string;
    pembagianSemester: string;
    perkiraanAsesmen: string;
  };
  catatan: string[];
}

export async function generateProta(input: ProtaInput): Promise<ProtaOutput> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error("Mistral API key not configured");
  }

  const mingguEfektif = input.mingguEfektif || 34;
  const jpPerMinggu = input.jpPerMinggu || 4;
  const totalJp = mingguEfektif * jpPerMinggu;

  const systemPrompt = `Kamu adalah asisten pendidikan ahli Kurikulum Merdeka Indonesia.
Tugasmu adalah membuat dokumen PROGRAM TAHUNAN (PROTA) yang formal, rapi, dan siap digunakan guru.

FORMAT WAJIB: 
- Kembalikan HANYA JSON valid, tanpa penjelasan, tanpa markdown, tanpa komentar apapun
- Gunakan bahasa Indonesia baku
- Gunakan format tabel dan struktur yang rapi
- Jangan mengarang Capaian Pembelajaran spesifik jika tidak tersedia, gunakan format umum yang relevan

OUTPUT FORMAT BARU:

# PROGRAM TAHUNAN (PROTA)

## Identitas
- Satuan Pendidikan: [nama sekolah]
- Mata Pelajaran: [mata pelajaran]
- Fase/Kelas: [fase dan kelas]
- Tahun Pelajaran: [tahun ajaran]

## Capaian Pembelajaran
(Tulis CP sesuai Kurikulum Merdeka, ringkas dan relevan - max 4-6 poin)

## Alokasi Waktu
- Jumlah Minggu Efektif: [34 minggu]
- JP per Minggu: [4 JP]
- Total JP per Tahun: [136 JP] (hitung otomatis)

## Distribusi Materi / Tujuan Pembelajaran

Buat tabel dengan pembagian logis antara semester ganjil (~50%) dan genap (~50%)

| No | Materi / Tujuan Pembelajaran | Semester | Alokasi Waktu (JP) | Keterangan |
|----|-----------------------------|----------|--------------------|------------|
| 1  | [materi 1]                  | Ganjil   | [JP]               | [keterangan]|

ATURAN PEMBAGIAN:
- Semester ganjil ~50%, Semester genap ~50%
- Sesuaikan dengan tingkat kesulitan materi
- Materi prasyarat diawal semester, materi pengayaan di akhir

## Kalender Pendidikan (Ringkas)
- Awal tahun ajaran: Juli
- Pembagian semester: Ganjil (Juli-Desember), Genap (Januari-Juni)
- Perkiraan asesmen: Tengah semester & Akhir semester

## Catatan
- Fleksibilitas pembelajaran disesuaikan kondisi peserta didi
- Integrasi Projek P5 jika relevan
- Remedial dan pengayaan sesuai kebutuhan`;

  const userPrompt = `Buatkan PROGRAM TAHUNAN (PROTA) berdasarkan input berikut:

INPUT:
- Nama Sekolah: ${input.sekolah || "-"}
- Mata Pelajaran: ${input.mataPelajaran}
- Fase/Kelas: ${input.fase} (${input.kelas.join(", ")})
- Tahun Pelajaran: ${input.tahunAjaran || "2025/2026"}
- Jumlah JP per Minggu: ${jpPerMinggu}
- Total Minggu Efektif: ${mingguEfektif}
- Total JP per Tahun: ${totalJp}
${input.cp ? `- Capaian Pembelajaran: ${input.cp}` : ""}
${input.materi ? `- Daftar Materi: ${input.materi}` : ""}

Kembalikan JSON dengan struktur PERSIS seperti ini:

{
  "identitas": {
    "satuanPendidikan": "${input.sekolah || "-"}",
    "mataPelajaran": "${input.mataPelajaran}",
    "faseKelas": "${input.fase} (${input.kelas.join(", ")})",
    "tahunPelajaran": "${input.tahunAjaran || "2025/2026"}"
  },
  "capaianPembelajaran": [
    "CP 1 ringkas",
    "CP 2 ringkas",
    "CP 3 ringkas"
  ],
  "alokasiWaktu": {
    "mingguEfektif": ${mingguEfektif},
    "jpPerMinggu": ${jpPerMinggu},
    "totalJpPertahun": ${totalJp}
  },
  "distribusiMateri": [
    {
      "nomor": 1,
      "materi": "Nama materi pembelajaran",
      "semester": "Ganjil",
      "alokasiJp": 8,
      "keterangan": "Pengenalan dan pemahaman dasar"
    }
  ],
  "kalenderPendidikan": {
    "awalTahunAjaran": "Juli",
    "pembagianSemester": "Ganjil: Juli-Desember, Genap: Januari-Juni",
    "perkiraanAsesmen": "Tengah semester (Oktober, Maret), Akhir semester (Desember, Juni)"
  },
  "catatan": [
    "Fleksibilitas pembelajaran disesuaikan kondisi peserta",
    "Integrasi Projek P5 jika relevan",
    "Remedial dan pengayaan sesuai kebutuhan"
  ]
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
