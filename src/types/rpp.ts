export interface RPPInput {
  mataPelajaran: string;
  fase: string;
  kelas?: string;
  namaGuru?: string;
  sekolah?: string;
  tahunAjaran?: string;
  semester?: string;
  alokasWaktu?: string;
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
}

export interface RPPDocument extends RPPInput, RPPOutput {
  id: string;
  createdAt: Date;
}