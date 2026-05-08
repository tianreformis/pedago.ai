export interface PromesFormData {
  mataPelajaran: string;
  fase: string;
  kelas: string;
  semester: string;
  jpPerMinggu: string;
  namaGuru: string;
  sekolah: string;
  tahunAjaran: string;
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
