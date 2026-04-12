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
