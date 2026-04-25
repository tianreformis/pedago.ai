import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_DATA = [
  {
    nama: "Bahasa Indonesia",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Menyimak", deskripsi: "Peserta didik mampu bersikap menjadi pendengar yang penuh perhatian dan memahami pesan lisan" },
          { nama: "Membaca dan Memirsa", deskripsi: "Peserta didik mampu membaca kata-kata sehari-hari dengan fasih dan memahami informasi" },
          { nama: "Berbicara dan Mempresentasikan", deskripsi: "Peserta mampu berbicara dengan santun menggunakan kosakata yang dikenal" },
          { nama: "Menulis", deskripsi: "Peserta mampu menulis permulaan yang benar dengan huruf tegak bersusun" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Menyimak", deskripsi: "Peserta didik mampu memahami ide pokok pesan lisan dan informasi dari media audio" },
          { nama: "Membaca dan Memirsa", deskripsi: "Peserta mampu membaca kata-kata baru dengan pola kombinasi huruf dan memaknai kosakata" },
          { nama: "Berbicara dan Mempresentasikan", deskripsi: "Peserta mampu berbicara dengan pilihan kata dan intonasi yang tepat" },
          { nama: "Menulis", deskripsi: "Peserta mampu menulis berbagai jenis teks pendek dengan huruf tegak bersusun" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Menyimak", deskripsi: "Peserta didik mampu menganalisis informasi, mengidentifikasi ciri objek, urutan proses, dan nilai-nilai dalam teks" },
          { nama: "Membaca dan Memirsa", deskripsi: "Peserta mampu membaca dengan fasih indah dan memahami makna denotatif, konotatif, dan kiasan" },
          { nama: "Berbicara dan Mempresentasikan", deskripsi: "Peserta mampu menyampaikan informasi untuk menghibur dan meyakinkan sesuai kaidah" },
          { nama: "Menulis", deskripsi: "Peserta mampu menulis teks deskripsi, narasi, dan argumentasi dengan kaidah kebahasaan" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Menyimak", deskripsi: "Peserta mampu menganalisis informasi kritis dari berbagai jenis teks lisan dan audio" },
          { nama: "Membaca dan Memirsa", deskripsi: "Peserta mampu memahami teks sastra dan nonsastra dengan analisis mendalam" },
          { nama: "Berbicara dan Mempresentasikan", deskripsi: "Peserta mampu berdiskusi dan berdebat dengan argumen yang logis" },
          { nama: "Menulis", deskripsi: "Peserta mampu menulis esai dan laporan penelitian dengan acuan aturan karya ilmiah" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Menyimak", deskripsi: "Peserta mampu menilai posisi, sudut pandang, dan bukti dalam teks listening" },
          { nama: "Membaca dan Memirsa", deskripsi: "Peserta mampu menginterpretasikan teks sastra kompleks dan analisis kritis" },
          { nama: "Berbicara dan Mempresentasikan", deskripsi: "Peserta mampu presentasi formal dengan retorika yang efektif" },
          { nama: "Menulis", deskripsi: "Peserta mampu menulis paper ilmiah dengan metodologi dan sitasi yang benar" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Menyimak", deskripsi: "Peserta mampu evaluasi mendalam terhadap teks akademis dan media massa" },
          { nama: "Membaca dan Memirsa", deskripsi: "Peserta mampu kritik sastra dan analisis multimodal" },
          { nama: "Berbicara dan Mempresentasikan", deskripsi: "Peserta mampu pidato dan debat dengan kepribadian yang kuat" },
          { nama: "Menulis", deskripsi: "Peserta mampu penulisan kreatif dan akademis tingkat lanjut" },
        ],
      },
    ],
  },
  {
    nama: "Matematika",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Bilangan", deskripsi: "Peserta dapat membaca, menulis, dan menghitung bilangan cacah 0-20" },
          { nama: "Penjumlahan Pengurangan", deskripsi: "Peserta dapat melakukan penjumlahan dan pengurangan bilangan cacah" },
          { nama: "Pengukuran", deskripsi: "Peserta dapat mengukur panjang, berat, dan waktu dengan satuan tidak baku" },
          { nama: "Bangun Ruang", deskripsi: "Peserta dapat mengenal dan membedakan bangun ruang sederhana" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Bilangan", deskripsi: "Peserta dapat membaca, menulis, dan operasi hitung bilangan cacah sampai 1000" },
          { nama: "Perkalian Pembagian", deskripsi: "Peserta dapat memahami konsep perkalian sebagai penjumlahan berulang" },
          { nama: "Pecahan", deskripsi: "Peserta dapat mengenal pecahan sederhana 1/2, 1/4" },
          { nama: "Bangun Datar", deskripsi: "Peserta dapat mengidentifikasi dan menggambar bangun datar" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Bilangan Bulat", deskripsi: "Peserta dapat operasi hitung bilangan bulat positif dan negatif" },
          { nama: "Pecahan Desimal", deskripsi: "Peserta dapat mengubah dan operasi hitung pecahan desimal" },
          { nama: "Persen", deskripsi: "Peserta dapat menghitung persentase dan penggunaannya dalam konteks" },
          { nama: "Statistika", deskripsi: "Peserta dapat mengumpulkan, menyajikan, dan menafsirkan data" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Aljabar", deskripsi: "Peserta dapat memahami variabel dan persamaan linear satu variabel" },
          { nama: "Perbandingan", deskripsi: "Peserta dapat menyelesaikan masalah perbandingan dan skala" },
          { nama: "Peluang", deskripsi: "Peserta dapat memahami dan menghitung peluang kejadian sederhana" },
          { nama: "Geometri", deskripsi: "Peserta dapat memahami kesebangunan dan kekongruenan bangun datar" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Aljabar", deskripsi: "Peserta dapat persamaan kuadrat, fungsi kuadrat, dan grafiknya" },
          { nama: "Trigonometri", deskripsi: "Peserta dapat perbandingan trigonometri dan penggunaannya" },
          { nama: "Statistik Inferensial", deskripsi: "Peserta dapat memahami distribusi normal dan probabilitas" },
          { nama: "Kalkulus", deskripsi: "Peserta dapat memahami konsep limit, turunan, dan integral sederhana" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Aljabar Linear", deskripsi: "Peserta dapat operasi matriks dan determinan" },
          { nama: "Vektor", deskripsi: "Peserta dapat operasi vektor di bidang dan ruang" },
          { nama: "Kalkulus Lanjut", deskripsi: "Peserta dapat turunan parsial dan integral ganda" },
          { nama: "Logika Matematika", deskripsi: "Peserta dapat penalaran logika dan pembuktian matematis" },
        ],
      },
    ],
  },
  {
    nama: "IPA",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Makhluk Hidup", deskripsi: "Peserta dapat mengidentifikasi ciri-ciri dan kebutuhan makhluk hidup" },
          { nama: "Lingkungan", deskripsi: "Peserta dapat menjaga kebersihan dan kelestarian lingkungan" },
          { nama: "Energi", deskripsi: "Peserta dapat mengenal berbagai bentuk energi dalam kehidupan sehari-hari" },
          { nama: "Sistem Tubuh", deskripsi: "Peserta dapat mengenal bagian-bagian tubuh dan fungsinya" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Makhluk Hidup", deskripsi: "Peserta dapat mengklasifikasikan makhluk hidup berdasarkan ciri" },
          { nama: "Sistem Organ", deskripsi: "Peserta dapat memahami organ dan fungsinya dalam tubuh" },
          { nama: "Suhu dan Kalor", deskripsi: "Peserta dapat memahami perpindahan panas" },
          { nama: "Gaya dan Gerak", deskripsi: "Peserta dapat memahami konsep gaya dan percepatan" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Sistem Kehidupan", deskripsi: "Peserta dapat memahami ekosistem dan interaksi antarorganisme" },
          { nama: "Bunyi", deskripsi: "Peserta dapat memahami karakteristik bunyi dan penyebarannya" },
          { nama: "Listrik", deskripsi: "Peserta dapat memahami arus listrik dan rangkaian" },
          { nama: "Zat Aditif", deskripsi: "Peserta dapat memahami dampak zat aditif dalam makanan" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Sel dan Jaringan", deskripsi: "Peserta dapat memahami struktur sel dan jaringan pada makhluk hidup" },
          { nama: "Usaha dan Energi", deskripsi: "Peserta dapat menghitung usaha dan energi dalam fisika" },
          { nama: "Partikel", deskripsi: "Peserta dapat memahami struktur atom dan tabel periodik" },
          { nama: "Zat Aditif", deskripsi: "Peserta dapat memahami dampak zat aditif dalam makanan" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Bioteknologi", deskripsi: "Peserta dapat memahami aplikasi bioteknologi dalam kehidupan" },
          { nama: "Elektromagnetik", deskripsi: "Peserta dapat memahami induksi elektromagnetik dan aplikasinya" },
          { nama: "Reaksi Redoks", deskripsi: "Peserta dapat memahami reaksi redoks dan elektrokimia" },
          { nama: "Evolusi", deskripsi: "Peserta dapat memahami teori evolusi dan perubahan spesies" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Genetika", deskripsi: "Peserta dapat memahami pewarisan sifat dan mutasi gen" },
          { nama: "Kimia Organik", deskripsi: "Peserta dapat memahami senyawa organik dan reaksi mereka" },
          { nama: "Fisika Modern", deskripsi: "Peserta dapat memahami relativitas dan fisika kuantum" },
          { nama: "Ekologi Kuantitatif", deskripsi: "Peserta dapat analisis populasi dan komunitas dengan model" },
        ],
      },
    ],
  },
  {
    nama: "IPS",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Lingkungan", deskripsi: "Peserta dapat mengenal lingkungan alam dan sosial sekitar" },
          { nama: "Waktu", deskripsi: "Peserta dapat memahami konsep waktu, hari, bulan, tahun" },
          { nama: "Tempat", deskripsi: "Peserta dapat memahami letak rumah, sekolah, dan lingkungan sekitar" },
          { nama: "Perubahan", deskripsi: "Peserta dapat mengidentifikasi perubahan yang terjadi dalam kehidupan" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Sejarah Lokal", deskripsi: "Peserta dapat memahami peristiwa sejarah yang terjadi di lingkungan" },
          { nama: "Geografi Lokal", deskripsi: "Peserta dapat memahami kondisi geografis wilayah sekitar" },
          { nama: "Ekonomi Sederhana", deskripsi: "Peserta dapat memahami konsep tetangga dan pertukaran" },
          { nama: "Kota Desa", deskripsi: "Peserta dapat membedakan ciri kota dan desa" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Sejarah Indonesia", deskripsi: "Peserta dapat memahami peristiwa penting dalam sejarah Indonesia" },
          { nama: "Peta", deskripsi: "Peserta dapat membaca dan interpretasi peta Indonesia" },
          { nama: "Sumber Daya", deskripsi: "Peserta dapat memahami sumber daya alam dan penggunaannya" },
          { nama: "Masyarakat Multikultural", deskripsi: "Peserta dapat memahami keragaman masyarakat Indonesia" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Sejarah Nasional", deskripsi: "Peserta dapat menganalisis peristiwa sejarah nasional dan pengaruhnya" },
          { nama: "Geografi Indonesia", deskripsi: "Peserta dapat memahami geografi fisik dan sosial Indonesia" },
          { nama: "Ekonomi", deskripsi: "Peserta dapat memahami sistem ekonomi dan pasar" },
          { nama: "Kewargaan", deskripsi: "Peserta dapat memahami hak dan kewajiban warga negara" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Sejarah Asia Tenggara", deskripsi: "Peserta dapat memahami dinamika sejarah Asia Tenggara" },
          { nama: "Geografi Dunia", deskripsi: "Peserta dapat memahami geografi global dan regional" },
          { nama: "Ekonomi Pembangunan", deskripsi: "Peserta dapat memahami pembangunan ekonomi" },
          { nama: "Hukum Internasional", deskripsi: "Peserta dapat memahami hukum internasional dasar" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Sejarah Kontemporer", deskripsi: "Peserta dapat memahami isu-isu sejarah kontemporer" },
          { nama: "Geografi Politik", deskripsi: "Peserta dapat memahami geopolitik dan batas negara" },
          { nama: "Ekonomi Global", deskripsi: "Peserta dapat memahami ekonomi dunia" },
          { nama: "Pendidikan Politik", deskripsi: "Peserta dapat civic engagement dan partisipasi politik" },
        ],
      },
    ],
  },
  {
    nama: "PKN / PPKN",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Pancasila", deskripsi: "Peserta didik mampu mengenal simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila" },
          { nama: "UUD NRI 1945", deskripsi: "Peserta dapat mengenal aturan di lingkungan keluarga dan sekolah" },
          { nama: "Bhinneka Tunggal Ika", deskripsi: "Peserta dapat menyebutkan identitas diri, keluarga, dan teman" },
          { nama: "NKRI", deskripsi: "Peserta dapat mengenal karakteristik lingkungan tempat tinggal sebagai bagian NKRI" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Pancasila", deskripsi: "Peserta dapat mempraktikkan nilai-nilai Pancasila di lingkungan sekolah" },
          { nama: "UUD NRI 1945", deskripsi: "Peserta dapat mengidentifikasi hak dan kewajiban sebagai anggota keluarga" },
          { nama: "Bhinneka Tunggal Ika", deskripsi: "Peserta dapat menghargai keberagaman suku bangsa dan sosial" },
          { nama: "NKRI", deskripsi: "Peserta dapat menjelaskan makna NKRI" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Pancasila", deskripsi: "Peserta dapat meneladani sikap para perumus Pancasila" },
          { nama: "UUD NRI 1945", deskripsi: "Peserta dapat melaksanakan aturan bersama dan norma yang berlaku" },
          { nama: "Bhinneka Tunggal Ika", deskripsi: "Peserta dapat mempromosikan nilai-nilai toleransi dan persatuan" },
          { nama: "NKRI", deskripsi: "Peserta dapat memahami organisasi pemerintahan tingkat desa hingga kabupaten/kota" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Pancasila", deskripsi: "Peserta dapat menganalisis kronologi lahirnya Pancasila sebagai dasar negara" },
          { nama: "UUD NRI 1945", deskripsi: "Peserta dapat memahami periodesasi pemberlakuan konstitusi Indonesia" },
          { nama: "Bhinneka Tunggal Ika", deskripsi: "Peserta dapat mengidentifikasi faktor penyebab keberagaman" },
          { nama: "NKRI", deskripsi: "Peserta dapat menunjukkan komitmen kebangsaan dalam menjaga kedaulatan" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Pancasila", deskripsi: "Peserta dapat menganalisis cara pandang para pendiri negara tentang rumusan Pancasila" },
          { nama: "UUD NRI 1945", deskripsi: "Peserta dapat mengevaluasi produk perundang-undangan" },
          { nama: "Bhinneka Tunggal Ika", deskripsi: "Peserta dapat mempromosikan budaya Indonesia ke kancah internasional" },
          { nama: "NKRI", deskripsi: "Peserta dapat menganalisis sengketa batas wilayah dan peran Indonesia dalam perdamaian dunia" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Pancasila", deskripsi: "Peserta dapat memvalidasi penerapan nilai-nilai Pancasila dalam kebijakan publik" },
          { nama: "UUD NRI 1945", deskripsi: "Peserta dapat menganalisis sistem hukum dan peradilan di Indonesia" },
          { nama: "Bhinneka Tunggal Ika", deskripsi: "Peserta dapat merancang solusi atas permasalahan keberagaman" },
          { nama: "NKRI", deskripsi: "Peserta dapat mengevaluasi peran aktif Indonesia dalam organisasi internasional" },
        ],
      },
    ],
  },
  {
    nama: "Bahasa Inggris",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Menyimak - Berbicara", deskripsi: "Peserta mampu menggunakan bahasa Inggris lisan sederhana untuk berinteraksi" },
          { nama: "Membaca - Memirsa", deskripsi: "Peserta mampu merespons teks visual sederhana dan mengenali kata-kata" },
          { nama: "Menulis - Presentasi", deskripsi: "Peserta dapat mengenal bentuk huruf dan kata dalam konteks visual" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Menyimak - Berbicara", deskripsi: "Peserta mampu menggunakan kalimat dengan pola tertentu untuk berinteraksi" },
          { nama: "Membaca - Memirsa", deskripsi: "Peserta mampu memahami kata-kata yang sering digunakan sehari-hari" },
          { nama: "Menulis - Presentasi", deskripsi: "Peserta mampu menyusun teks prosedur dan deskripsi pendek" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Menyimak - Berbicara", deskripsi: "Peserta mampu menggunakan bahasa Inggris untuk berinteraksi di kelas" },
          { nama: "Membaca - Memirsa", deskripsi: "Peserta mampu memahami teks narasi dan informatif sederhana" },
          { nama: "Menulis - Presentasi", deskripsi: "Peserta mampu menulis teks pendek dalam bentuk cetak atau digital" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Menyimak - Berbicara", deskripsi: "Peserta mampu menggunakan bahasa Inggris untuk bertukar opini" },
          { nama: "Membaca - Memirsa", deskripsi: "Peserta mampu memahami dan menyimpulkan ide pokok dari teks" },
          { nama: "Menulis - Presentasi", deskripsi: "Peserta mampu menulis berbagai jenis teks dengan struktur organisasi yang jelas" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Menyimak - Berbicara", deskripsi: "Peserta mampu menggunakan bahasa Inggris secara mandiri untuk berkomunikasi" },
          { nama: "Membaca - Memirsa", deskripsi: "Peserta mampu menganalisis makna tersirat dari teks autentik" },
          { nama: "Menulis - Presentasi", deskripsi: "Peserta mampu menghasilkan teks orisinal yang menunjukkan pemahaman tentang audiens" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Menyimak - Berbicara", deskripsi: "Peserta mampu menggunakan bahasa Inggris dengan fasih untuk beradu argumen" },
          { nama: "Membaca - Memirsa", deskripsi: "Peserta mampu memahami teks sastra dan profesional yang kompleks" },
          { nama: "Menulis - Presentasi", deskripsi: "Peserta mampu menulis karya tulis ilmiah atau kreatif" },
        ],
      },
    ],
  },
  {
    nama: "Informatika",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Berpikir Komputasional", deskripsi: "Peserta mampu mengenali pola sederhana dan mengurutkan langkah-langkah instruksi" },
          { nama: "TIK", deskripsi: "Peserta mampu mengenali perangkat teknologi di sekitarnya" },
          { nama: "Sistem Komputer", deskripsi: "Peserta mampu menyebutkan bagian-bagian dasar perangkat keras komputer" },
          { nama: "Analisis Data", deskripsi: "Peserta mampu mengelompokkan benda berdasarkan ciri-ciri tertentu" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Berpikir Komputasional", deskripsi: "Peserta mampu menerapkan dekomposisi dan pengenalan pola" },
          { nama: "TIK", deskripsi: "Peserta mampu memanfaatkan perangkat TIK untuk berkomunikasi" },
          { nama: "Sistem Komputer", deskripsi: "Peserta mampu memahami fungsi perangkat keras dan sistem operasi" },
          { nama: "Algoritma dan Pemrograman", deskripsi: "Peserta mampu memahami instruksi terstruktur untuk mencapai tujuan tertentu" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Berpikir Komputasional", deskripsi: "Peserta mampu menyusun algoritma sederhana" },
          { nama: "TIK", deskripsi: "Peserta mampu mengolah dokumen teks dan presentasi secara kreatif" },
          { nama: "Analisis Data", deskripsi: "Peserta mampu mengumpulkan dan mengolah data dalam bentuk tabel" },
          { nama: "Dampak Sosial Informatika", deskripsi: "Peserta mampu memahami keamanan data dan etika dalam berinternet" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Berpikir Komputasional", deskripsi: "Peserta mampu menerapkan logika proposisional dan algoritma" },
          { nama: "TIK", deskripsi: "Peserta mampu mengintegrasikan konten antaraplikasi perkantoran" },
          { nama: "Sistem Komputer", deskripsi: "Peserta mampu memahami interaksi perangkat keras, lunak, dan pengguna" },
          { nama: "Algoritma dan Pemrograman", deskripsi: "Peserta mampu membuat program visual sederhana" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Berpikir Komputasional", deskripsi: "Peserta mampu memecahkan persoalan kompleks dengan strategi algoritmik" },
          { nama: "TIK", deskripsi: "Peserta mampu memanfaatkan fitur lanjut aplikasi perkantoran" },
          { nama: "Sistem Komputer", deskripsi: "Peserta mampu memahami mekanisme kerja CPU dan memori" },
          { nama: "Algoritma dan Pemrograman", deskripsi: "Peserta mampu merancang dan mengimplementasikan program prosedural" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Berpikir Komputasional", deskripsi: "Peserta mampu menganalisis persoalan kompleks menggunakan teknik pemrograman dinamis" },
          { nama: "Jaringan Komputer dan Internet", deskripsi: "Peserta mampu memahami arsitektur jaringan dan protokol" },
          { nama: "Analisis Data", deskripsi: "Peserta mampu melakukan penambangan data dan visualisasi data" },
          { nama: "Algoritma dan Pemrograman", deskripsi: "Peserta mampu mengembangkan aplikasi berbasis objek atau berbasis web" },
        ],
      },
    ],
  },
  {
    nama: "Pendidikan Agama Islam",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Aqidah", deskripsi: "Peserta dapat mengenal kepercayaan ketuhanan (Tauhid)" },
          { nama: "Syariat", deskripsi: "Peserta dapat memahami perintah dan larangan dalam Islam" },
          { nama: "Akhlak", deskripsi: "Peserta dapat meneladani perilaku terpuji" },
          { nama: "Ibadah", deskripsi: "Peserta dapat mengenal salat dan doa harian" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Aqidah", deskripsi: "Peserta dapat memahami rukun Iman" },
          { nama: "Syariat", deskripsi: "Peserta dapat memahami halal dan haram" },
          { nama: "Akhlak", deskripsi: "Peserta dapat meneladan akhlakul karimah" },
          { nama: "Ibadah", deskripsi: "Peserta dapat melaksanakan salat fardhu" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Aqidah", deskripsi: "Peserta dapat memahami Asmaul Husna dan sifat-sifat Allah" },
          { nama: "Syariat", deskripsi: "Peserta dapat memahami fiqih ibadah sesuai madzhab" },
          { nama: "Akhlak", deskripsi: "Peserta dapat mandiri dalam berakhlakul karimah" },
          { nama: "Ibadah", deskripsi: "Peserta dapat melaksanakan ibadah dengan tartib" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        catatanPembelajarans: [
          { nama: "Tarikh", deskripsi: "Peserta dapat memahami Sejarah Islam periode klasik" },
          { nama: "Tafsir", deskripsi: "Peserta dapat memahami dasar-dasar tafsir Al-Quran" },
          { nama: "Hadits", deskripsi: "Peserta dapat memahami klasifikasi hadits" },
          { nama: "Fikih", deskripsi: "Peserta dapat memahami fikih muamalah" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Kalam", deskripsi: "Peserta dapat memahami akidah dalam Islam" },
          { nama: "Tafsir", deskripsi: "Peserta dapat menafsirkan surat-surat pilihan" },
          { nama: "Hadits", deskripsi: "Peserta dapat menganalisis hadits shahih" },
          { nama: "Fikih", deskripsi: "Peserta dapat memahami fikih munakahat dan jinayah" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Ilmu Kalam", deskripsi: "Peserta dapat memahami perdebatan teologi dalam Islam" },
          { nama: "Ulumul Quran", deskripsi: "Peserta dapat memahami ilmu Qiraat dan Tajwid" },
          { nama: "Ilmu Hadits", deskripsi: "Peserta dapat memahami ilmu jarh wa ta'dil" },
          { nama: "Fikih Ushul", deskripsi: "Peserta dapat memahami ushul fiqh dan istinbath" },
        ],
      },
    ],
  },
  {
    nama: "Seni Budaya",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          { nama: "Mengalami", deskripsi: "Peserta mampu mengamati dan mengenal unsur-unsur seni di lingkungan sekitar" },
          { nama: "Menciptakan", deskripsi: "Peserta mampu mengeksplorasi alat dan bahan untuk membuat karya seni" },
          { nama: "Merefleksikan", deskripsi: "Peserta mampu mengenali dan menceritakan karya seni yang dibuatnya sendiri" },
          { nama: "Berpikir dan Bekerja Artistik", deskripsi: "Peserta dapat menunjukkan antusiasme dalam melakukan kegiatan seni" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Mengalami", deskripsi: "Peserta dapat mengidentifikasi unsur-unsur seni dalam karya" },
          { nama: "Menciptakan", deskripsi: "Peserta dapat membuat karya seni berdasarkan instruksi" },
          { nama: "Merefleksikan", deskripsi: "Peserta dapat membandingkan karya seni sendiri dengan karya orang lain" },
          { nama: "Berpikir dan Bekerja Artistik", deskripsi: "Peserta dapat bekerja secara mandiri atau berkelompok" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Mengalami", deskripsi: "Peserta dapat menganalisis keterkaitan antar unsur seni" },
          { nama: "Menciptakan", deskripsi: "Peserta dapat menciptakan karya seni yang menunjukkan ekspresi diri" },
          { nama: "Merefleksikan", deskripsi: "Peserta dapat memberikan pendapat kritis tentang nilai estetis" },
          { nama: "Dampak", deskripsi: "Peserta dapat menghasilkan karya seni yang memberikan dampak positif" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Mengalami", deskripsi: "Peserta dapat mengeksplorasi dan merekam referensi seni dari berbagai sumber" },
          { nama: "Menciptakan", deskripsi: "Peserta dapat menciptakan karya seni yang menunjukkan orisinalitas" },
          { nama: "Merefleksikan", deskripsi: "Peserta dapat mengevaluasi karya seni berdasarkan efektivitas pesan" },
          { nama: "Berpikir dan Bekerja Artistik", deskripsi: "Peserta dapat merancang proses kreatif dari perencanaan hingga penyelesaian" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Mengalami", deskripsi: "Peserta dapat mengamati dan menganalisis karya seni berdasarkan konteks" },
          { nama: "Menciptakan", deskripsi: "Peserta dapat menciptakan karya seni yang menunjukkan kematangan konsep" },
          { nama: "Merefleksikan", deskripsi: "Peserta dapat mempresentasikan analisis karya seni dengan istilah teknis" },
          { nama: "Dampak", deskripsi: "Peserta dapat memilih dan menerapkan gaya seni yang relevan" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Mengalami", deskripsi: "Peserta dapat menganalisis keterkaitan seni dengan disiplin ilmu lain" },
          { nama: "Menciptakan", deskripsi: "Peserta dapat memproduksi karya seni profesional atau eksperimental" },
          { nama: "Merefleksikan", deskripsi: "Peserta dapat memberikan kritik seni yang komprehensif" },
          { nama: "Berpikir dan Bekerja Artistik", deskripsi: "Peserta dapat mengelola proyek seni atau pameran secara mandiri" },
        ],
      },
    ],
  },
  {
    nama: "Pendidikan Jasmani (PJOK)",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        catatanPembelajarans: [
          { nama: "Keterampilan Gerak", deskripsi: "Peserta dapat mempraktikkan gerak dasar lokomotor dan non-lokomotor" },
          { nama: "Pengetahuan Gerak", deskripsi: "Peserta dapat mengenali berbagai aktivitas jasmani dan konsep gerak" },
          { nama: "Pemanfaatan Gerak", deskripsi: "Peserta dapat mengenali bagian-bagian tubuh dan cara menjaga kebersihan" },
          { nama: "Karakter", deskripsi: "Peserta dapat menunjukkan perilaku hormat dan menerima arahan" },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          { nama: "Keterampilan Gerak", deskripsi: "Peserta dapat mempraktikkan variasi gerak dasar dalam permainan" },
          { nama: "Pengetahuan Gerak", deskripsi: "Peserta dapat memahami prosedur variasi pola gerak dasar" },
          { nama: "Pemanfaatan Gerak", deskripsi: "Peserta dapat memahami pola makan sehat dan istirahat" },
          { nama: "Karakter", deskripsi: "Peserta dapat menunjukkan sikap bekerja sama dan berbagi" },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          { nama: "Keterampilan Gerak", deskripsi: "Peserta dapat mempraktikkan kombinasi gerak dasar dalam olahraga beregu dan perorangan" },
          { nama: "Pengetahuan Gerak", deskripsi: "Peserta dapat menganalisis kombinasi gerak dasar" },
          { nama: "Pemanfaatan Gerak", deskripsi: "Peserta dapat memahami bahaya merokok dan narkoba" },
          { nama: "Karakter", deskripsi: "Peserta dapat menunjukkan etika yang baik dan sikap sportif" },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          { nama: "Keterampilan Gerak", deskripsi: "Peserta dapat mempraktikkan gerak spesifik dalam berbagai permainan" },
          { nama: "Pengetahuan Gerak", deskripsi: "Peserta dapat menganalisis fakta, konsep, dan prosedur" },
          { nama: "Pemanfaatan Gerak", deskripsi: "Peserta dapat merancang program latihan kebugaran jasmani" },
          { nama: "Karakter", deskripsi: "Peserta dapat menginisiasi kerja sama tim dan tanggung jawab" },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Keterampilan Gerak", deskripsi: "Peserta dapat mempraktikkan hasil evaluasi keterampilan gerak" },
          { nama: "Pengetahuan Gerak", deskripsi: "Peserta dapat mengevaluasi strategi permainan" },
          { nama: "Pemanfaatan Gerak", deskripsi: "Peserta dapat menganalisis dampak aktivitas fisik terhadap kesehatan" },
          { nama: "Karakter", deskripsi: "Peserta dapat menunjukkan kepemimpinan dan manajemen konflik" },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/SMK/MA",
        capaianPembelajarans: [
          { nama: "Terampil Bergerak", deskripsi: "Peserta dapat merancang, menerapkan, dan mengevaluasi keterampilan gerak" },
          { nama: "Belajar Melalui Gerak", deskripsi: "Peserta dapat mengadaptasi strategi dan fair play" },
          { nama: "Bergaya Hidup Aktif", deskripsi: "Peserta dapat berpartisipasi dalam aktivitas kebugaran" },
          { nama: "Memilih Hidup yang Menyehatkan", deskripsi: "Peserta dapat mengadvokasi gaya hidup aktif dan sehat" },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  for (const mapelData of SEED_DATA) {
    const mapel = await prisma.mataPelajaran.upsert({
      where: { nama: mapelData.nama },
      update: {},
      create: { nama: mapelData.nama },
    });

    console.log(`✓ Created Mata Pelajaran: ${mapel.nama}`);

    for (const faseData of mapelData.fases) {
      const fase = await prisma.fase.upsert({
        where: {
          mataPelajaranId_nama: {
            mataPelajaranId: mapel.id,
            nama: faseData.nama,
          },
        },
        update: {},
        create: {
          nama: faseData.nama,
          keterangan: faseData.keterangan,
          mataPelajaranId: mapel.id,
        },
      });

      console.log(`  ✓ Created Fase: ${fase.nama}`);

      for (const cpData of faseData.capaianPembelajarans || []) {
        await prisma.capaianPembelajaran.upsert({
          where: {
            faseId_nama: {
              faseId: fase.id,
              nama: cpData.nama,
            },
          },
          update: {},
          create: {
            nama: cpData.nama,
            deskripsi: cpData.deskripsi,
            faseId: fase.id,
          },
        });
      }

      console.log(`  ✓ Created ${faseData.capaianPembelajarans?.length || 0} CP for ${fase.nama}`);
    }
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });