export interface RPPInput {
  mataPelajaran: string;
  fase: string;
  cp?: string;
  kelas?: string;
  namaGuru?: string;
  sekolah?: string;
  tahunAjaran?: string;
  semester?: string;
  alokasWaktu?: string;
  bahasa?: "indonesia" | "inggris";
}

export interface RPPOutput {
  karakteristikPembelajar: {
    kesiapanPesertaDidik: string;
    karakteristikMateri: string;
    dimensiProfilLulusan: string[];
  };
  desainPembelajaran: {
    capaianPembelajaran: string;
    lintasDisiplinIlmu?: string;
    tujuanPembelajaran: string[];
    topikPembelajaran: string;
    praktikPedagogis: string;
    kemitraanPembelajaran?: string;
    lingkunganBelajar: string;
    pemanfaatanTeknologi?: string;
    kriteriaPencapaianTP: string[];
    dimensiProfilLulusan: string;
  };
  pengalamanBelajar: {
    awal: {
      prinsip: string;
      orientasi: string;
      apersepsi: string;
      motivasi: string;
      durasi: string;
    };
    inti: {
      memahami: {
        prinsip: string;
        kegiatan: string[];
        durasi: string;
      };
      mengaplikasi: {
        prinsip: string;
        kegiatan: string[];
        durasi: string;
      };
      merefleksi: {
        prinsip: string;
        kegiatan: string[];
        durasi: string;
      };
    };
    penutup: {
      kegiatan: string[];
      durasi: string;
    };
  };
  asesmen: {
    asesmenAwal: {
      teknik: string;
      instrumen: string;
    };
    asesmenFormatif: {
      teknik: string;
      instrumen: string;
    };
    asesmenSumatif: {
      teknik: string;
      instrumen: string;
    };
  };
  pertanyaanRefleksiGuru: {
    pertanyaan: string[];
    tujuan: string;
  };
  glosarium: {
   terms: Array<{ istilah: string; definisi: string }>;
  };
  lembarKerjaPesertaDidik: {
    namaLembarKerja: string;
    instruksi: string;
    tugas: {
      nomor: number;
      pertanyaan: string;
      ruangJawaban: string;
    }[];
  };
}

export interface RPPDocument extends RPPInput, RPPOutput {
  id: string;
  createdAt: Date;
}