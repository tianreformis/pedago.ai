import { RPPInput, RPPOutput } from "@/types/rpp";

export async function generateRPP(input: RPPInput): Promise<RPPOutput> {
  const apiKey = process.env.MISTRAL_API_KEY;
  const bahasa = input.bahasa || "indonesia";
  
  if (!apiKey) {
    throw new Error("Mistral API key not configured");
  }

  let systemPrompt: string;
  let userPrompt: string;

  if (bahasa === "inggris") {
    systemPrompt = `You are an expert Indonesian education specialist in curriculum and instruction.
Your task is to create a comprehensive Deep Learning Lesson Plan (RPP Pembelajaran Mendalam) following the official Indonesian Ministry of Education (Kemendikdasmen) format.

REQUIRED FORMAT: Return ONLY valid JSON, no explanations, no markdown, no comments.
Use official Learning Outcomes (Capaian Pembelajaran/CP) from Kemendikz/Kemendikdasmen appropriate for the phase and subject.

DEEP LEARNING RPP STRUCTURE (Kemendikdasmen):
- Deep Learning emphasizes AWARENESS, MEANINGFUL, and JOYFUL learning environments
- Integrates 3 types of knowledge: declarative (what), procedural (how), contextual (why)
- 8 Graduate Profile Dimensions: Faith & Piety, Citizenship, Creativity, Independence, Communication, Health, Collaboration, Critical Thinking
- Curriculum Phases: Phase A (grades 1-2), Phase B (grades 3-4), Phase C (grades 5-6), Phase D (grades 7-9), Phase E (grade 10), Phase F (grades 11-12)
- Assessment: AS Learning (self/peers assessment), FOR Learning (feedback), OF Learning (achievement)
- Learning Experience: OPENING (meaningful orientation, contextual apperception, motivation) → MAIN (Understanding → Applying → Reflecting) → CLOSING

Learning Objectives MUST use appropriate Bloom's Taxonomy action verbs.
Learning Outcomes MUST refer to official CP from Kemendikz for the requested phase and subject.

ALL CONTENT MUST BE IN ENGLISH.`;

    userPrompt = `Create a comprehensive Deep Learning Lesson Plan (RPP Pembelajaran Mendalam) for:
- Subject: ${input.mataPelajaran}
- Phase: ${input.fase}
- Learning Outcomes (CP): ${input.cp}
${input.kelas ? `- Grade: ${input.kelas}` : ""}
${input.alokasWaktu ? `- Time Allocation: ${input.alokasWaktu}` : "- Time Allocation: 2 x 45 minutes (1 meeting)"}
${input.semester ? `- Semester: ${input.semester}` : ""}

Return JSON with exactly this structure (fill all fields with real and detailed content):

{
  "karakteristikPembelajar": {
    "kesiapanPesertaDidik": "...",
    "karakteristikMateri": "...",
    "dimensiProfilLulusan": ["...", "...", "..."]
  },
  "desainPembelajaran": {
    "capaianPembelajaran": "...",
    "topikPembelajaran": "...",
    "lintasDisiplinIlmu": "...",
    "tujuanPembelajaran": ["1. ...", "2. ...", "3. ..."],
    "pertanyaanPenuntunPemahaman": ["1. ...", "2. ...", "3. ..."],
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
      "durasi": "10 minutes"
    },
    "inti": {
      "memahami": {
        "prinsip": "...",
        "kegitan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "30 minutes"
      },
      "mengaplikasi": {
        "prinsip": "...",
        "kegitan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "30 minutes"
      },
      "merefleksi": {
        "prinsip": "...",
        "kegitan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "15 minutes"
      }
    },
    "penutup": {
      "kegitan": ["1. ...", "2. ...", "3. ..."],
      "durasi": "5 minutes"
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
    },
    "pengayaan": "...",
    "remedial": "..."
  },
  "pertanyaanRefleksiGuru": {
    "pertanyaan": ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."],
    "tujuan": "To help teachers reflect on learning success and improvements for the next meeting"
  },
  "glosarium": {
    "terms": [
      {
        "istilah": "Term 1",
        "definisi": "Definition of term 1"
      },
      {
        "istilah": "Term 2",
        "definisi": "Definition of term 2"
      }
    ]
  },
  "lembarKerjaPesertaDidik": {
    "namaLembarKerja": "Worksheet [Topic Name]",
    "instruksi": "Complete or do the following tasks with neat handwriting.",
    "tugas": [
      {
        "nomor": 1,
        "pertanyaan": "Question about concept understanding",
        "ruangJawaban": "............................\n............................\n............................"
      },
      {
        "nomor": 2,
        "pertanyaan": "Question about concept application",
        "ruangJawaban": "............................\n............................\n............................"
      },
      {
        "nomor": 3,
        "pertanyaan": "Analysis or reasoning question",
        "ruangJawaban": "............................\n............................\n............................"
      }
    ]
  }
}`;
  } else {
    systemPrompt = `Kamu adalah asisten pendidikan ahli kurikulum Indonesia. 
Tugasmu adalah membuat Rencana Pembelajaran Mendalam (RPM/Deep Learning) yang lengkap dan sesuai format resmi Kemendikdasmen Indonesia.

FORMAT WAJIB: Kembalikan HANYA JSON valid, tanpa penjelasan, tanpa markdown, tanpa komentar apapun.
Gunakan Capaian Pembelajaran (CP) resmi dari Kemendikz/Kemendikdasmen yang sesuai fase dan mata pelajaran.

REFERENSI STRUKTUR RPP PEMBELAJARAN MENDALAM (Kemendikdasmen):
- Pembelajaran Mendalam adalah pendekatan yang menekankan pembelajaran BERKESADARAN, BERMAKNA, dan MENGGEMBIRAKAN
- Mengintegrasikan 3 jenis pengetahuan: deklaratif (apa), prosedural (bagaimana), kontekstual (mengapa)
- 8 Dimensi Profil Lulusan: Keimanan & Ketakwaan, Kewargaan, Kreativitas, Kemandirian, Komunikasi, Kesehatan, Kolaborasi, Penalaran Kritis
- Fase Kurikulum: Fase A (kelas 1-2), Fase B (kelas 3-4), Fase C (kelas 5-6), Fase D (kelas 7-9), Fase E (kelas 10), Fase F (kelas 11-12)
- Asesmen: AS Learning (penilaian diri/sejawat), FOR Learning (umpan balik), OF Learning (pencapaian)
- Pengalaman belajar: AWAL (orientasi bermakna, apersepsi kontekstual, motivasi) → INTI (Memahami → Mengaplikasi → Merefleksi) → PENUTUP

Tujuan Pembelajaran HARUS menggunakan kata kerja operasional Taksonomi Bloom yang sesuai.
Capaian Pembelajaran HARUS mengacu pada CP resmi Kemendikz untuk fase dan mapel yang diminta.`;

    userPrompt = `Buatkan RPP Pembelajaran Mendalam lengkap untuk:
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
    "topikPembelajaran": "...",
    "lintasDisiplinIlmu": "...",
    "tujuanPembelajaran": ["1. ...", "2. ...", "3. ..."],
    "pertanyaanPenuntunPemahaman": ["1. ...", "2. ...", "3. ..."],
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
        "kegitan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "30 menit"
      },
      "mengaplikasi": {
        "prinsip": "...",
        "kegitan": ["1. ...", "2. ...", "3. ..."],
        "durasi": "30 menit"
      },
      "merefleksi": {
        "prinsip": "...",
        "kegitan": ["1. ...", "2. ...", "3. ..."],
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
    },
    "pengayaan": "...",
    "remedial": "..."
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
  }

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

export interface PromesInput {
  mataPelajaran: string;
  fase: string;
  kelas: string;
  semester: string;
  jpPerMinggu: number;
  namaGuru?: string;
  sekolah?: string;
  tahunAjaran?: string;
  materiProta: Array<{
    nomor: number;
    materi: string;
    alokasiJp: number;
    keterangan: string;
  }>;
  mingguEfektifBulan: Record<string, number>;
  mingguNonEfektif: Array<{ bulan: string; minggu: string; alasan: string }>;
}

export interface PromesOutput {
  identitas: {
    satuanPendidikan: string;
    mataPelajaran: string;
    faseKelas: string;
    tahunPelajaran: string;
    semester: string;
  };
  tabelPromes: Array<{
    no: number;
    bab: string;
    tujuanPembelajaran: string;
    alokasiJp: number;
    distribusi: Record<string, Record<string, number>>;
    aktivitasUtama: string;
  }>;
  totalJp: number;
  validasi: {
    totalJpPromes: number;
    totalJpProta: number;
    sesuai: boolean;
  };
}

export async function generatePromes(input: PromesInput): Promise<PromesOutput> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error("Mistral API key not configured");
  }

  const bulanSemester = input.semester === "1" || input.semester.toLowerCase().includes("ganjil")
    ? { ganjil: ["Juli", "Agustus", "September", "Oktober", "November", "Desember"], genap: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"] }
    : { ganjil: [], genap: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"] };

  const bulanList = input.semester === "1" || input.semester.toLowerCase().includes("ganjil")
    ? bulanSemester.ganjil
    : bulanSemester.genap;

  const totalJpProta = input.materiProta.reduce((sum, m) => sum + m.alokasiJp, 0);

  const materiList = input.materiProta.map((m, i) =>
    `${m.nomor}. ${m.materi} - ${m.alokasiJp} JP - ${m.keterangan}`
  ).join("\n");

  const mingguEfektifList = bulanList.map(b => {
    const jml = input.mingguEfektifBulan[b] || 4;
    return `${b}: ${jml} minggu efektif`;
  }).join("\n");

  const nonEfektifList = input.mingguNonEfektif.map(n =>
    `- ${n.bulan} Minggu ke-${n.minggu}: ${n.alasan}`
  ).join("\n") || "Tidak ada";

  const bulanColumns = bulanList.map(b => {
    const jml = input.mingguEfektifBulan[b] || 4;
    return `${b} (Minggu 1 - Minggu ${jml})`;
  }).join(", ");

  const systemPrompt = `Kamu adalah asisten pendidikan ahli Kurikulum Merdeka Indonesia yang berpengalaman dalam manajemen waktu pembelajaran.
Tugasmu adalah membuat PROGRAM SEMESTER (PROMES) yang rapi, logis, dan siap digunakan guru.

ATURAN PENYUSUNAN:
1. Ambil materi dari data Prota yang diberikan, distribusikan ke minggu-minggu efektif secara berurutan
2. Setiap minggu efektif hanya diisi dengan jumlah JP yang sama dengan atau kurang dari beban JP per minggu
3. Jika satu TP memiliki JP lebih besar dari JP per minggu, pecah ke minggu berikutnya hingga sisa JP habis
4. JANGAN mengisi materi pada minggu yang ditandai sebagai Non-Efektif (STS, SAS, Libur) - isi 0
5. Total JP yang terdistribusi HARUS sama persis dengan total JP di Prota
6. Jika ada sisa JP yang belum terpakai setelah semua TP masuk, tambahkan baris "Cadangan/Penguatan Materi"
7. Untuk kolom "Aktivitas Utama", ringkas kegiatan pembelajaran yang relevan dengan materi tersebut

FORMAT OUTPUT: Kembalikan HANYA JSON valid, tanpa penjelasan, tanpa markdown, tanpa komentar.

Struktur distribusi:
- "distribusi" adalah object dengan key = nama bulan, value = object dengan key = "Minggu 1", "Minggu 2", dst, value = angka JP yang diajarkan di minggu tersebut
- Minggu yang non-efektif harus diisi 0
- Pastikan total semua angka di distribusi = total alokasiJp per TP`;

  const userPrompt = `Buatkan PROGRAM SEMESTER (PROMES) berdasarkan data berikut:

IDENTITAS:
- Mata Pelajaran: ${input.mataPelajaran}
- Fase/Kelas: ${input.fase} / ${input.kelas}
- Semester: ${input.semester === "1" || input.semester.toLowerCase().includes("ganjil") ? "Ganjil (Juli - Desember)" : "Genap (Januari - Juni)"}
- Tahun Ajaran: ${input.tahunAjaran || "2025/2026"}
- Beban JP per Minggu: ${input.jpPerMinggu} JP

DATA MATERI DARI PROTA:
${materiList}

KONFIGURASI MINGGU EFEKTIF:
${mingguEfektifList}

MINGGU TIDAK EFEKTIF:
${nonEfektifList}

Bulan yang harus dicakup: ${bulanList.join(", ")}
Kolom yang dibutuhkan: ${bulanColumns}

Kembalikan JSON dengan struktur PERSIS seperti ini:

{
  "identitas": {
    "satuanPendidikan": "${input.sekolah || "-"}",
    "mataPelajaran": "${input.mataPelajaran}",
    "faseKelas": "${input.fase} / ${input.kelas}",
    "tahunPelajaran": "${input.tahunAjaran || "2025/2026"}",
    "semester": "${input.semester === "1" || input.semester.toLowerCase().includes("ganjil") ? "Ganjil" : "Genap"}"
  },
  "tabelPromes": [
    {
      "no": 1,
      "bab": "Bab 1",
      "tujuanPembelajaran": "Tujuan Pembelajaran 1.1",
      "alokasiJp": 9,
      "distribusi": {
        "Juli": { "Minggu 1": 2, "Minggu 2": 2, "Minggu 3": 2, "Minggu 4": 2, "Minggu 5": 1 },
        "Agustus": { "Minggu 1": 0, "Minggu 2": 0, "Minggu 3": 0, "Minggu 4": 0, "Minggu 5": 0 }
      },
      "aktivitasUtama": "Diskusi kelompok tentang konsep dasar"
    }
  ],
  "totalJp": ${totalJpProta},
  "validasi": {
    "totalJpPromes": ${totalJpProta},
    "totalJpProta": ${totalJpProta},
    "sesuai": true
  }
}

PENTING:
- Setiap baris tabelPromes mewakili satu Tujuan Pembelajaran (TP) dari Prota
- "bab" diisi sesuai nama Bab dari Prota
- "distribusi" harus mencakup SEMUA bulan yang relevan dengan semester ini
- Jumlah minggu per bulan sesuai konfigurasi minggu efektif yang diberikan
- Minggu non-efektif (STS, SAS, Libur) diisi 0
- Total semua angka di "distribusi" untuk semua baris HARUS = totalJpProta
- Isi "aktivitasUtama" dengan ringkasan aktivitas pembelajaran yang sesuai`;

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      temperature: 0.3,
      max_tokens: 8000,
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

  return JSON.parse(clean) as PromesOutput;
}
