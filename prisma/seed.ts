import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * SEED DATA - Capaian Pembelajaran Kurikulum Merdeka
 * Referensi: Keputusan Kepala BSKAP Nomor 046/H/KR/2025
 * (memperbarui BSKAP 032/H/KR/2024)
 *
 * Catatan struktur resmi:
 * - Fase A : Kelas 1–2 SD/MI
 * - Fase B : Kelas 3–4 SD/MI
 * - Fase C : Kelas 5–6 SD/MI
 * - Fase D : Kelas 7–9 SMP/MTs
 * - Fase E : Kelas 10 SMA/MA/SMK
 * - Fase F : Kelas 11–12 SMA/MA/SMK
 *
 * Di jenjang SD, IPA dan IPS DIGABUNG menjadi IPAS (Ilmu Pengetahuan Alam dan Sosial).
 * IPA dan IPS terpisah mulai Fase D (SMP).
 * Elemen CP dalam kurikulum merdeka bersifat naratif per elemen/domain.
 */

const SEED_DATA = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. BAHASA INDONESIA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Bahasa Indonesia",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu bersikap menjadi pendengar yang penuh perhatian. Peserta didik menunjukkan minat dan antusias dalam menyimak cerita atau lagu. Peserta didik memahami informasi berupa pesan lisan atau instruksi lisan dari orang tua, pendidik, dan orang dewasa di sekitarnya.",
          },
          {
            nama: "Membaca dan Memirsa",
            deskripsi:
              "Peserta didik mampu bersikap menjadi pembaca dan pemirsa yang menunjukkan minat terhadap teks yang dibaca atau dipirsa. Peserta didik mampu membaca kata-kata yang dikenalinya sehari-hari dengan fasih. Peserta didik mampu memahami informasi dari bacaan dan tayangan yang dipirsa tentang diri dan lingkungan.",
          },
          {
            nama: "Berbicara dan Mempresentasikan",
            deskripsi:
              "Peserta didik mampu berbicara dengan santun tentang beragam topik yang dikenali menggunakan volume dan intonasi yang tepat. Peserta didik mampu merespons dengan bertanya tentang sesuatu, menjawab, dan menanggapi komentar orang lain (teman, guru, dan orang dewasa) dengan baik dan santun.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menunjukkan keterampilan menulis permulaan dengan benar (cara memegang alat tulis, jarak mata dan buku, menebalkan garis/huruf, dan sebagainya) di atas kertas dan/atau melalui media digital. Peserta didik mengembangkan tulisan tangan yang semakin baik. Peserta didik mampu menulis teks deskripsi dengan beberapa kalimat tunggal.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu memahami pesan lisan dan informasi dari media audio, teks aural (teks yang dibacakan dan/atau didengar), instruksi lisan, dan percakapan yang berkaitan dengan tujuan berkomunikasi. Peserta didik mampu memahami dan memaknai teks narasi yang dibacakan atau dari media audio.",
          },
          {
            nama: "Membaca dan Memirsa",
            deskripsi:
              "Peserta didik mampu memahami pesan dan informasi tentang kehidupan sehari-hari, teks narasi, dan puisi anak dalam bentuk cetak atau elektronik. Peserta didik mampu membaca dengan fasih dan indah, serta memahami informasi dalam teks paparan tentang topik yang beragam.",
          },
          {
            nama: "Berbicara dan Mempresentasikan",
            deskripsi:
              "Peserta didik mampu berbicara dengan pilihan kata dan sikap tubuh/gestur yang santun. Peserta didik mampu menceritakan kembali suatu informasi yang dibaca atau didengar, dan menyampaikan perasaan sesuai dengan konteks. Peserta didik berpartisipasi aktif dalam diskusi, bertanya, dan menanggapi berdasarkan informasi ilmiah yang didapatkan.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis teks narasi, teks deskripsi, teks rekon, teks prosedur, dan teks eksposisi dengan rangkaian kalimat yang beragam serta informasi yang rinci dan akurat. Peserta didik semakin terampil menulis tegak bersambung.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu menganalisis informasi berupa fakta, prosedur dengan mengidentifikasi ciri objek dan urutan proses kejadian menggunakan berbagai sumber. Peserta didik mampu memaknai instruksi kompleks berupa rangkaian kegiatan yang disertai hubungan kausalitas.",
          },
          {
            nama: "Membaca dan Memirsa",
            deskripsi:
              "Peserta didik mampu membaca dengan fasih dan indah, serta memahami informasi dan kosakata baru yang memiliki makna denotatif, konotatif, dan kiasan untuk mengidentifikasi objek, fenomena, dan karakter. Peserta didik mampu mengidentifikasi informasi dari berbagai tipe teks (fiksi dan informasional).",
          },
          {
            nama: "Berbicara dan Mempresentasikan",
            deskripsi:
              "Peserta didik mampu menyampaikan informasi secara lisan untuk tujuan menghibur dan meyakinkan pendengar menggunakan aspek kebahasaan dan struktur yang tepat. Peserta didik mampu mendiskusikan informasi, mengajukan dan menanggapi pertanyaan dalam diskusi.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis teks eksplanasi, laporan, dan eksposisi persuasif dari gagasan, hasil pengamatan, pengalaman, dan imajinasi. Peserta didik mampu menggunakan kaidah kebahasaan dan format yang sesuai serta menyampaikan pendirian dalam teks argumentatif.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu menganalisis dan memaknai informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari berbagai jenis teks (nonfiksi dan fiksi) audiovisual dan aural. Peserta didik mampu mengeksplorasi dan mengevaluasi berbagai informasi dari topik aktual yang didengar.",
          },
          {
            nama: "Membaca dan Memirsa",
            deskripsi:
              "Peserta didik memahami informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari teks deskripsi, narasi, puisi, eksplanasi dan eksposisi dari teks visual dan audiovisual untuk menemukan makna yang tersurat dan tersirat. Peserta didik menginterpretasikan informasi untuk mengungkapkan simpati, kepedulian, empati, atau pendapat pro dan kontra dari teks visual dan audiovisual.",
          },
          {
            nama: "Berbicara dan Mempresentasikan",
            deskripsi:
              "Peserta didik mampu menyampaikan gagasan, pikiran, pandangan, arahan atau pesan untuk tujuan pengajuan usul, pemecahan masalah, dan pemberian solusi secara lisan dalam bentuk monolog dan dialog logis, kritis, dan kreatif. Peserta didik mampu menggunakan dan mengembangkan kosakata baru yang memiliki makna denotatif, konotatif, dan kiasan.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis gagasan, pikiran, pandangan, arahan atau pesan tertulis untuk berbagai tujuan secara logis, kritis, dan kreatif dalam bentuk teks informasional dan/atau fiksi. Peserta didik mampu menyampaikan ungkapan rasa simpati, empati, peduli, dan pendapat pro/kontra dalam teks persuasif dan teks tanggapan secara etis.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu mengevaluasi dan mengkreasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari menyimak berbagai jenis teks (nonfiksi dan fiksi) dalam bentuk monolog, dialog, dan gelar wicara.",
          },
          {
            nama: "Membaca dan Memirsa",
            deskripsi:
              "Peserta didik mampu mengevaluasi informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari berbagai jenis teks, misalnya deskripsi, laporan, narasi, rekon, eksplanasi, eksposisi, dan diskusi dari teks visual dan audiovisual untuk menemukan makna yang tersurat dan tersirat.",
          },
          {
            nama: "Berbicara dan Mempresentasikan",
            deskripsi:
              "Peserta didik mampu mengolah dan menyajikan gagasan, pikiran, pandangan, arahan atau pesan untuk tujuan pengajuan usul, pemecahan masalah, dan pemberian solusi secara lisan dalam bentuk monolog dan dialog logis, kritis, dan kreatif.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis gagasan, pikiran, pandangan, arahan atau pesan tertulis untuk berbagai tujuan secara logis, kritis, dan kreatif dalam bentuk teks informasional dan/atau fiksi. Peserta didik mampu menulis teks eksposisi hasil penelitian dan teks fungsional dunia kerja.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu mengevaluasi dan mengkreasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari menyimak berbagai jenis teks dalam bentuk monolog, dialog, dan gelar wicara secara kritis dan reflektif.",
          },
          {
            nama: "Membaca dan Memirsa",
            deskripsi:
              "Peserta didik mampu mengevaluasi dan mengkreasi teks sastra dan nonsastra dari berbagai sudut pandang, termasuk teks multimodal. Peserta didik mampu mengkritisi ideologi dalam teks untuk mewujudkan karakter Profil Pelajar Pancasila.",
          },
          {
            nama: "Berbicara dan Mempresentasikan",
            deskripsi:
              "Peserta didik mampu mengolah dan menyajikan gagasan, pikiran, pandangan secara lisan dalam bentuk diskusi kelompok, debat, dan presentasi ilmiah dengan bahasa yang fasih, efektif, dan bertanggung jawab.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis karya ilmiah, artikel, laporan, dan karya sastra secara kritis, kreatif, dan reflektif. Peserta didik mampu menghasilkan teks yang menunjukkan kemampuan berpikir tingkat tinggi.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MATEMATIKA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Matematika",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Bilangan",
            deskripsi:
              "Peserta didik menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100, mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi (menyusun) dan dekomposisi (mengurai) bilangan. Peserta didik dapat melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai 20.",
          },
          {
            nama: "Aljabar",
            deskripsi:
              "Peserta didik dapat mengenali, meniru, dan melanjutkan pola bukan bilangan (misalnya pola gambar, warna, suara).",
          },
          {
            nama: "Pengukuran",
            deskripsi:
              "Peserta didik dapat membandingkan panjang dan berat benda secara langsung, dan membandingkan durasi waktu. Mereka dapat mengukur dan mengestimasi panjang benda menggunakan satuan tidak baku.",
          },
          {
            nama: "Geometri",
            deskripsi:
              "Peserta didik dapat mengidentifikasi, meniru, dan menggambar berbagai bentuk dua dimensi (segitiga, segiempat, segilima, segienam, dan lingkaran) dan bentuk tiga dimensi (balok, kubus, kerucut, dan bola).",
          },
          {
            nama: "Analisis Data dan Peluang",
            deskripsi:
              "Peserta didik dapat mengurutkan, membandingkan, dan menyajikan data menggunakan turus dan piktogram.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Bilangan",
            deskripsi:
              "Peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 10.000. Mereka dapat melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai 1000, dapat melakukan operasi perkalian dan pembagian bilangan cacah, memahami pecahan dan dapat membandingkan pecahan berpenyebut sama.",
          },
          {
            nama: "Aljabar",
            deskripsi:
              "Peserta didik dapat mengenali, meniru, melanjutkan, dan membuat pola gambar atau obyek sederhana dan pola bilangan membesar dan mengecil.",
          },
          {
            nama: "Pengukuran",
            deskripsi:
              "Peserta didik dapat mengukur panjang dan berat benda menggunakan satuan baku, dan dapat menentukan hubungan antar satuan baku panjang. Peserta didik dapat menentukan keliling dan luas berbagai bentuk bangun datar (persegi, persegipanjang, dan segitiga).",
          },
          {
            nama: "Geometri",
            deskripsi:
              "Peserta didik dapat mengidentifikasi, mendeskripsikan, dan mengklasifikasi berbagai bentuk dua dimensi menggunakan ciri-cirinya.",
          },
          {
            nama: "Analisis Data dan Peluang",
            deskripsi:
              "Peserta didik dapat mengurutkan, membandingkan, menyajikan, dan menganalisis data dalam bentuk tabel, diagram batang, dan piktogram.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Bilangan",
            deskripsi:
              "Peserta didik dapat menunjukkan pemahaman dan intuisi bilangan pada bilangan cacah sampai 1.000.000. Mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, melakukan komposisi dan dekomposisi bilangan cacah maupun desimal, serta melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 100.000 dan bilangan desimal.",
          },
          {
            nama: "Aljabar",
            deskripsi:
              "Peserta didik dapat mengidentifikasi, menduplikasi, dan mengembangkan pola bilangan membesar dan mengecil yang melibatkan perkalian dan pembagian. Peserta didik dapat bernalar mengenai hubungan dua besaran dengan menggunakan tabel dan grafik.",
          },
          {
            nama: "Pengukuran",
            deskripsi:
              "Peserta didik dapat menentukan keliling dan luas berbagai bentuk bangun datar (segitiga, persegi, persegi panjang, jajaran genjang, trapesium, layang-layang, dan belah ketupat).",
          },
          {
            nama: "Geometri",
            deskripsi:
              "Peserta didik dapat mengidentifikasi, mendeskripsikan, dan mengklasifikasi bangun datar dan bangun ruang berdasarkan ciri-cirinya. Peserta didik dapat menentukan luas permukaan dan volume bangun ruang sederhana.",
          },
          {
            nama: "Analisis Data dan Peluang",
            deskripsi:
              "Peserta didik dapat mengurutkan, membandingkan, menyajikan, dan menganalisis data banyak benda dan data hasil pengukuran dalam bentuk tabel, diagram batang, dan diagram lingkaran untuk memecahkan masalah.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Bilangan",
            deskripsi:
              "Peserta didik dapat membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional dan irasional, bilangan desimal, bilangan berpangkat bulat dan akar, bilangan dalam notasi ilmiah. Peserta didik dapat menerapkan operasi aritmetika pada bilangan real, dan memberikan estimasi/perkiraan dalam menyelesaikan masalah.",
          },
          {
            nama: "Aljabar",
            deskripsi:
              "Peserta didik dapat mengenali, memprediksi, dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan. Peserta didik dapat menyatakan suatu situasi ke dalam bentuk aljabar, memanipulasi aljabar, dan menyederhanakan persamaan dan pertidaksamaan linear satu variabel.",
          },
          {
            nama: "Pengukuran",
            deskripsi:
              "Peserta didik dapat menjelaskan cara untuk menentukan luas lingkaran dan menyelesaikan masalah yang berkaitan. Peserta didik dapat menjelaskan cara untuk menentukan luas permukaan dan volume bangun ruang (prisma, tabung, limas, kerucut, dan bola) dan menyelesaikan masalah yang berkaitan.",
          },
          {
            nama: "Geometri",
            deskripsi:
              "Peserta didik dapat mendefinisikan transformasi geometri dan sifat-sifatnya (refleksi, translasi, rotasi, dan dilatasi). Peserta didik dapat membuktikan teorema Pythagoras dan menggunakannya dalam menyelesaikan masalah.",
          },
          {
            nama: "Analisis Data dan Peluang",
            deskripsi:
              "Peserta didik dapat merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data untuk menjawab pertanyaan. Peserta didik dapat menggunakan diagram batang dan diagram lingkaran untuk menyajikan dan menginterpretasi data. Peserta didik dapat memahami dan menghitung peluang empiris dan teoretis dari suatu kejadian sederhana.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Bilangan",
            deskripsi:
              "Peserta didik dapat menggeneralisasi sifat-sifat bilangan berpangkat (termasuk bilangan pangkat pecahan). Peserta didik dapat menerapkan barisan dan deret aritmetika dan geometri, termasuk masalah yang terkait bunga tunggal dan bunga majemuk.",
          },
          {
            nama: "Aljabar dan Fungsi",
            deskripsi:
              "Peserta didik dapat menginterpretasikan ekspresi eksponensial. Peserta didik dapat menyelesaikan sistem persamaan linear tiga variabel, sistem pertidaksamaan linear dua variabel, persamaan dan fungsi kuadrat, fungsi eksponensial dan logaritma.",
          },
          {
            nama: "Trigonometri",
            deskripsi:
              "Peserta didik dapat menjelaskan rasio trigonometri (sinus, cosinus, tangen, cosecan, secan, dan cotangen) pada segitiga siku-siku dan menyelesaikan masalah yang melibatkan segitiga siku-siku.",
          },
          {
            nama: "Analisis Data dan Peluang",
            deskripsi:
              "Peserta didik dapat merepresentasikan dan menginterpretasi data dengan menentukan jangkauan kuartil dan interkuartil. Peserta didik dapat membuat dan menginterpretasi diagram box plot dan menggunakannya untuk membandingkan himpunan data. Peserta didik dapat menjelaskan dan menggunakan distribusi peluang teoretis dan eksperimental.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Aljabar dan Fungsi",
            deskripsi:
              "Peserta didik dapat menentukan fungsi invers, komposisi fungsi, dan transformasi fungsi untuk memodelkan situasi dunia nyata. Peserta didik dapat memahami sifat-sifat polinomial, menerapkan teorema faktor, dan menemukan akar rasional.",
          },
          {
            nama: "Kalkulus",
            deskripsi:
              "Peserta didik dapat memahami konsep limit fungsi, menghitung turunan fungsi aljabar dan trigonometri, serta menerapkannya untuk menentukan nilai ekstrem dan masalah optimasi. Peserta didik dapat menghitung integral tentu dan tak tentu serta menerapkannya untuk menghitung luas daerah.",
          },
          {
            nama: "Geometri dan Trigonometri",
            deskripsi:
              "Peserta didik dapat menerapkan aturan sinus dan cosinus untuk menyelesaikan masalah. Peserta didik dapat menentukan persamaan lingkaran dan memahami geometri analitik.",
          },
          {
            nama: "Analisis Data dan Peluang",
            deskripsi:
              "Peserta didik dapat memodelkan pinjaman dan investasi dengan bunga majemuk dan anuitas. Peserta didik dapat memahami konsep distribusi binomial dan normal, serta melakukan uji hipotesis sederhana.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. IPAS (Ilmu Pengetahuan Alam dan Sosial) — SD Fase A, B, C
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "IPAS",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Pemahaman IPAS",
            deskripsi:
              "Peserta didik mengenal ciri-ciri dan kebutuhan makhluk hidup, serta dapat membedakan makhluk hidup dan benda tak hidup. Peserta didik mengidentifikasi pengaruh kondisi lingkungan terhadap kesehatan dan kehidupan sehari-hari. Peserta didik mengenal anggota tubuh dan fungsinya, serta pentingnya menjaga kesehatan. Peserta didik mengenal lingkungan keluarga, rumah, dan sekolah, serta mendeskripsikan kejadian di sekitar.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik mengamati fenomena dan peristiwa secara sederhana menggunakan pancaindra. Peserta didik menceritakan dan mendokumentasikan hasil observasi menggunakan gambar atau tulisan sederhana.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Pemahaman IPAS",
            deskripsi:
              "Peserta didik memahami wujud dan sifat benda, perubahan wujud benda, dan hubungannya dengan panas (suhu dan kalor). Peserta didik memahami siklus hidup makhluk hidup dan kondisi lingkungan yang memengaruhinya. Peserta didik memahami bentuk-bentuk energi, sumber energi, dan transformasi energi dalam kehidupan sehari-hari. Peserta didik mendeskripsikan kondisi geografis wilayah Indonesia dan kehidupan sosial masyarakat sekitar.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik mengamati fenomena dan peristiwa secara sederhana menggunakan pancaindra dan dapat menggunakan alat bantu pengukuran. Peserta didik menggunakan data hasil pengamatan untuk membuat prediksi sederhana dan mengomunikasikan temuannya.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Pemahaman IPAS",
            deskripsi:
              "Peserta didik melakukan simulasi tentang sistem organ tubuh manusia (sistem pernapasan, pencernaan, peredaran darah) dan menjelaskan cara menjaga kesehatannya. Peserta didik menyelidiki bagaimana hubungan saling ketergantungan antar komponen biotik-abiotik dalam ekosistem. Peserta didik mendemonstrasikan penerapan konsep gelombang (bunyi dan cahaya) dalam kehidupan. Peserta didik mengusulkan upaya pelestarian sumber daya alam dan lingkungan. Peserta didik memahami peristiwa penting dalam sejarah Indonesia, keberagaman budaya, dan kondisi geografis NKRI.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik merencanakan dan melakukan penyelidikan ilmiah sederhana. Peserta didik mengidentifikasi variabel dan merumuskan hipotesis, kemudian menganalisis hasil serta mempresentasikan temuan menggunakan data yang mendukung.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ILMU PENGETAHUAN ALAM (IPA) — SMP Fase D
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Ilmu Pengetahuan Alam",
    fases: [
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Pemahaman IPA",
            deskripsi:
              "Peserta didik mampu melakukan klasifikasi makhluk hidup dan benda berdasarkan karakteristik yang diamati. Peserta didik memahami sel sebagai unit dasar kehidupan, struktur dan fungsi jaringan dan organ pada manusia dan tumbuhan. Peserta didik memahami gaya, gerak, usaha, dan energi serta penerapannya. Peserta didik memahami sifat dan perubahan zat, reaksi kimia, asam-basa, dan larutan. Peserta didik memahami bumi dan alam semesta termasuk lapisan bumi, perubahan iklim, dan tata surya.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik dapat melakukan penyelidikan ilmiah dengan tahapan yang sistematis: mengajukan pertanyaan, merumuskan hipotesis, merancang percobaan, mengumpulkan data, menganalisis, dan mengomunikasikan hasil. Peserta didik mampu menggunakan berbagai alat ukur dan instrumen laboratorium secara tepat dan aman.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman IPA",
            deskripsi:
              "Peserta didik memahami hakikat ilmu sains dan metode ilmiah. Di bidang biologi, peserta didik memahami keanekaragaman hayati dan klasifikasi, ekosistem dan interaksi, virus dan bakteri, serta bioteknologi dasar. Di bidang fisika, peserta didik memahami gerak lurus, gerak melingkar, hukum Newton, dan keterampilan proses sains. Di bidang kimia, peserta didik memahami stuktur atom, tabel periodik, ikatan kimia, dan stoikiometri.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik dapat melakukan penyelidikan ilmiah yang kompleks dengan mempertimbangkan keselamatan kerja dan etika sains. Peserta didik dapat menyajikan laporan penelitian menggunakan grafik, tabel, dan analisis statistik sederhana.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman IPA",
            deskripsi:
              "Peserta didik memahami konsep-konsep lanjutan: di biologi mencakup sistem organ manusia, reproduksi, genetika, evolusi, dan bioteknologi modern; di fisika mencakup dinamika rotasi, termodinamika, gelombang, optik, listrik, magnet, fisika modern, dan fisika inti; di kimia mencakup kimia karbon, polimer, koloid, reaksi redoks, elektrokimia, dan kimia lingkungan.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik dapat merancang dan melaksanakan proyek penelitian sains secara mandiri, menganalisis data secara kuantitatif dan kualitatif, serta mempresentasikan temuan dalam format ilmiah.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. ILMU PENGETAHUAN SOSIAL (IPS) — SMP Fase D
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Ilmu Pengetahuan Sosial",
    fases: [
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep",
            deskripsi:
              "Peserta didik mampu memahami dan memiliki kesadaran akan keberadaan diri serta mampu berinteraksi dengan lingkungan terdekatnya. Peserta didik dapat menganalisis hubungan antara kondisi geografis daerah dengan karakteristik masyarakat dan cara mereka beraktivitas ekonomi. Peserta didik memahami sejarah dan perkembangan Indonesia sejak masa praaksara hingga kemerdekaan.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik memahami dan menerapkan keterampilan inkuiri sosial untuk mengidentifikasi masalah, mengumpulkan informasi dari berbagai sumber, menganalisis data, dan mengomunikasikan hasil kajian. Peserta didik mampu mengembangkan pemikiran kritis tentang isu-isu sosial di lingkungannya.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep",
            deskripsi:
              "Peserta didik mampu memahami dan mengaplikasikan pengetahuan tentang ruang dan interaksi antar ruang, waktu, keberlanjutan dan perubahan, koneksi antar konsep IPS dalam memahami kehidupan masyarakat secara komprehensif.",
          },
          {
            nama: "Keterampilan Proses",
            deskripsi:
              "Peserta didik mampu melakukan penelitian sosial sederhana menggunakan metode kualitatif dan kuantitatif, menganalisis dan mempresentasikan temuan secara argumentatif.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. PENDIDIKAN PANCASILA (PPKn / Pendidikan Pancasila)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Pendidikan Pancasila",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Pancasila",
            deskripsi:
              "Peserta didik mampu mengenal dan menceritakan simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila. Peserta didik mampu mengidentifikasi dan menjelaskan hubungan antara simbol dan sila dalam lambang negara Garuda Pancasila.",
          },
          {
            nama: "Undang-Undang Dasar NRI 1945",
            deskripsi:
              "Peserta didik mampu mengenal aturan di lingkungan keluarga dan sekolah. Peserta didik mampu menceritakan contoh sikap mematuhi dan menyimpang dari aturan yang berlaku di keluarga dan sekolah.",
          },
          {
            nama: "Bhinneka Tunggal Ika",
            deskripsi:
              "Peserta didik mampu menyebutkan identitas dirinya sesuai dengan jenis kelamin, ciri-ciri fisik, dan hobinya. Peserta didik mampu menyebutkan identitas diri (fisik dan non fisik) orang di lingkungan sekitarnya.",
          },
          {
            nama: "Negara Kesatuan Republik Indonesia",
            deskripsi:
              "Peserta didik mampu mengenal karakteristik lingkungan tempat tinggalnya dan lingkungan sekitarnya. Peserta didik mampu menyebutkan contoh kegiatan berbagi di lingkungan sekitar.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Pancasila",
            deskripsi:
              "Peserta didik mampu memahami dan menceritakan makna sila-sila Pancasila. Peserta didik mampu mengidentifikasi dan menerapkan nilai-nilai Pancasila dalam kesehariannya.",
          },
          {
            nama: "Undang-Undang Dasar NRI 1945",
            deskripsi:
              "Peserta didik mampu mengidentifikasi aturan di rumah, sekolah, dan lingkungan sekitar. Peserta didik mampu menceritakan hak dan kewajibannya sebagai anggota keluarga dan warga sekolah.",
          },
          {
            nama: "Bhinneka Tunggal Ika",
            deskripsi:
              "Peserta didik mampu mendeskripsikan identitas diri, keluarga, dan teman-temannya sesuai budaya, minat, dan perilakunya. Peserta didik mampu menghargai perbedaan suku bangsa, bahasa, agama, dan sosial-budaya.",
          },
          {
            nama: "Negara Kesatuan Republik Indonesia",
            deskripsi:
              "Peserta didik mampu mengenal wilayah Indonesia di peta dan memahami makna NKRI sebagai satu kesatuan. Peserta didik mampu menjelaskan simbol-simbol negara dan arti pentingnya.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Pancasila",
            deskripsi:
              "Peserta didik mampu meneladani sikap para perumus dan pemersatu bangsa dalam mewujudkan nilai-nilai Pancasila. Peserta didik mampu memahami sejarah lahirnya Pancasila.",
          },
          {
            nama: "Undang-Undang Dasar NRI 1945",
            deskripsi:
              "Peserta didik mampu memahami isi dan kedudukan peraturan perundang-undangan dalam kehidupan bermasyarakat. Peserta didik mampu melaksanakan aturan bersama dan norma yang berlaku di masyarakat.",
          },
          {
            nama: "Bhinneka Tunggal Ika",
            deskripsi:
              "Peserta didik mampu memahami keberagaman budaya, agama, suku bangsa Indonesia, dan mempromosikan nilai toleransi serta menghargai keberagaman sebagai kekayaan bangsa.",
          },
          {
            nama: "Negara Kesatuan Republik Indonesia",
            deskripsi:
              "Peserta didik mampu memahami pemerintahan tingkat desa/kelurahan, kecamatan, dan kabupaten/kota, serta mengenal hak dan kewajibannya sebagai warga negara.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Pancasila",
            deskripsi:
              "Peserta didik mampu menganalisis kronologi, konteks, dan hasil yang dicapai dari perumusan Pancasila. Peserta didik memahami Pancasila sebagai dasar negara dan pandangan hidup bangsa.",
          },
          {
            nama: "Undang-Undang Dasar NRI 1945",
            deskripsi:
              "Peserta didik mampu menganalisis norma-norma yang berlaku dalam kehidupan bermasyarakat dan bernegara. Peserta didik memahami periodesasi pemberlakuan konstitusi dan kedudukan UUD NRI 1945.",
          },
          {
            nama: "Bhinneka Tunggal Ika",
            deskripsi:
              "Peserta didik mampu mengidentifikasi faktor-faktor yang menyebabkan keberagaman Indonesia. Peserta didik mampu membangun harmoni sosial dalam keberagaman.",
          },
          {
            nama: "Negara Kesatuan Republik Indonesia",
            deskripsi:
              "Peserta didik mampu memahami bentuk dan sistem pemerintahan Indonesia serta lembaga negara. Peserta didik mampu menunjukkan komitmen kebangsaan dalam menjaga persatuan dan kedaulatan NKRI.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Pancasila",
            deskripsi:
              "Peserta didik mampu menganalisis cara pandang para pendiri negara tentang rumusan Pancasila sebagai dasar negara. Peserta didik mampu menerapkan nilai-nilai Pancasila dalam kehidupan bermasyarakat dan bernegara.",
          },
          {
            nama: "Undang-Undang Dasar NRI 1945",
            deskripsi:
              "Peserta didik mampu mengevaluasi berbagai produk perundang-undangan yang berlaku dan mengkritisi isi berbagai perundang-undangan yang tidak sesuai dengan kondisi masyarakat.",
          },
          {
            nama: "Bhinneka Tunggal Ika",
            deskripsi:
              "Peserta didik mampu menganalisis potensi konflik dan strategi penyelesaiannya dalam kerangka Bhinneka Tunggal Ika. Peserta didik mampu mempromosikan keberagaman budaya Indonesia di kancah global.",
          },
          {
            nama: "Negara Kesatuan Republik Indonesia",
            deskripsi:
              "Peserta didik mampu menganalisis ancaman terhadap kedaulatan NKRI dan upaya penyelesaiannya. Peserta didik memahami peran Indonesia dalam perdamaian dunia dan kerja sama internasional.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Pancasila",
            deskripsi:
              "Peserta didik mampu memvalidasi penerapan nilai-nilai Pancasila dalam kebijakan publik dan kehidupan berbangsa dan bernegara. Peserta didik mampu berkontribusi dalam penguatan nilai Pancasila.",
          },
          {
            nama: "Undang-Undang Dasar NRI 1945",
            deskripsi:
              "Peserta didik mampu menganalisis sistem hukum dan peradilan di Indonesia, serta mengevaluasi penerapan hak asasi manusia.",
          },
          {
            nama: "Bhinneka Tunggal Ika",
            deskripsi:
              "Peserta didik mampu merancang solusi inovatif atas permasalahan keberagaman dalam kehidupan bermasyarakat, berbangsa, dan bernegara.",
          },
          {
            nama: "Negara Kesatuan Republik Indonesia",
            deskripsi:
              "Peserta didik mampu mengevaluasi peran aktif Indonesia dalam organisasi internasional dan kontribusinya pada tatanan dunia yang berkeadilan.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. BAHASA INGGRIS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Bahasa Inggris",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak - Berbicara",
            deskripsi:
              "Peserta didik menggunakan bahasa Inggris sederhana untuk berinteraksi dalam situasi sosial dan kelas seperti berkenalan, memberikan informasi diri, mengucapkan salam dan perpisahan. Peserta didik mengidentifikasi informasi dalam teks lisan dan audiovisual tentang topik yang dekat dengan kehidupan sehari-hari.",
          },
          {
            nama: "Membaca - Memirsa",
            deskripsi:
              "Peserta didik merespons instruksi lisan sederhana dan memahami teks visual. Peserta didik mengidentifikasi huruf dalam alfabet Bahasa Inggris dan memahami bahwa teks tertulis mewakili bunyi bahasa.",
          },
          {
            nama: "Menulis - Mempresentasikan",
            deskripsi:
              "Peserta didik mengomunikasikan informasi sederhana menggunakan gambar dan beberapa patah kata. Peserta didik dapat menyalin atau menebalkan kata-kata dalam bahasa Inggris.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak - Berbicara",
            deskripsi:
              "Peserta didik menggunakan kalimat dengan pola yang sederhana dalam bahasa Inggris untuk berinteraksi dalam situasi sosial dan belajar. Peserta didik mengidentifikasi topik dan informasi kunci dari teks yang didengar atau ditonton.",
          },
          {
            nama: "Membaca - Memirsa",
            deskripsi:
              "Peserta didik memahami kata-kata yang sering digunakan sehari-hari (high frequency words) dan kosakata tematik. Peserta didik membaca dan memahami teks sederhana berbentuk deskripsi dan prosedur.",
          },
          {
            nama: "Menulis - Mempresentasikan",
            deskripsi:
              "Peserta didik menyusun teks prosedur sangat sederhana dan teks deskripsi pendek menggunakan kata-kata yang sudah dikenal dengan bantuan gambar dan templat.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak - Berbicara",
            deskripsi:
              "Peserta didik menggunakan bahasa Inggris untuk berinteraksi dan berkomunikasi dalam konteks kelas dan sekolah. Peserta didik mendiskusikan topik-topik yang dekat dengan keseharian menggunakan kosakata yang lebih luas.",
          },
          {
            nama: "Membaca - Memirsa",
            deskripsi:
              "Peserta didik membaca dan memahami teks naratif dan informatif sederhana. Peserta didik mengidentifikasi ide pokok dan informasi kunci dari teks yang dibaca.",
          },
          {
            nama: "Menulis - Mempresentasikan",
            deskripsi:
              "Peserta didik menulis teks pendek dalam berbagai bentuk (deskripsi, narasi, prosedur) menggunakan struktur kalimat yang tepat dan kosakata yang sesuai.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Menyimak - Berbicara",
            deskripsi:
              "Peserta didik menggunakan bahasa Inggris untuk berkomunikasi dengan guru dan teman dalam berbagai macam situasi dan topik. Peserta didik mampu bertukar opini, mendiskusikan permasalahan sehari-hari, dan menyampaikan pemikiran secara lisan.",
          },
          {
            nama: "Membaca - Memirsa",
            deskripsi:
              "Peserta didik membaca dan merespons teks dalam berbagai bentuk (naratif, deskriptif, rekon, prosedur, laporan, dan eksposisi). Peserta didik mampu menyimpulkan ide pokok dan pesan tersurat dan tersirat dari teks.",
          },
          {
            nama: "Menulis - Mempresentasikan",
            deskripsi:
              "Peserta didik menulis berbagai jenis teks tentang orang, binatang, benda, lokasi, gejala alam, dan fenomena sosial dengan menggunakan struktur organisasi dan unsur kebahasaan yang jelas.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Menyimak - Berbicara",
            deskripsi:
              "Peserta didik menggunakan bahasa Inggris untuk berkomunikasi secara mandiri dalam berbagai situasi dan tujuan komunikasi. Peserta didik mampu menyampaikan opini, berargumentasi, dan mendiskusikan isu-isu global.",
          },
          {
            nama: "Membaca - Memirsa",
            deskripsi:
              "Peserta didik membaca dan merespons berbagai jenis teks otentik secara kritis. Peserta didik mampu menganalisis makna tersurat dan tersirat serta mengevaluasi keandalan sumber informasi.",
          },
          {
            nama: "Menulis - Mempresentasikan",
            deskripsi:
              "Peserta didik menghasilkan teks orisinal dalam berbagai format untuk pembaca yang beragam. Peserta didik mampu menulis teks akademis dan profesional sederhana.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Menyimak - Berbicara",
            deskripsi:
              "Peserta didik menggunakan bahasa Inggris dengan fasih dan efektif untuk berbagai tujuan akademis dan profesional. Peserta didik mampu beradu argumen, berpresentasi, dan bernegosiasi secara efektif.",
          },
          {
            nama: "Membaca - Memirsa",
            deskripsi:
              "Peserta didik membaca dan memahami teks sastra dan profesional yang kompleks. Peserta didik mampu melakukan analisis kritis dan mengevaluasi perspektif yang beragam.",
          },
          {
            nama: "Menulis - Mempresentasikan",
            deskripsi:
              "Peserta didik menghasilkan tulisan akademik atau kreatif yang efektif untuk berbagai tujuan, termasuk esai argumentatif, laporan penelitian, dan karya sastra sederhana.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Pendidikan Agama Islam dan Budi Pekerti",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Al-Qur'an dan Hadis",
            deskripsi:
              "Peserta didik dapat melafalkan huruf hijaiyah bersambung, hafal beberapa surah pendek Al-Qur'an, dan memahami pesan hadis tentang kebersihan dan kasih sayang.",
          },
          {
            nama: "Akidah",
            deskripsi:
              "Peserta didik mengenal rukun iman kepada Allah, malaikat, rasul, dan kitab-kitab-Nya secara sederhana. Peserta didik mengenal asmaul husna Al-Ahad dan As-Shamad.",
          },
          {
            nama: "Akhlak",
            deskripsi:
              "Peserta didik mengenal adab bersuci, berdoa, dan menuntut ilmu. Peserta didik memahami kisah keteladanan Nabi Muhammad saw. dan dapat mempraktikkan perilaku jujur dan santun.",
          },
          {
            nama: "Fikih",
            deskripsi:
              "Peserta didik mengenal tata cara bersuci (taharah), salat fardu, dan doa sehari-hari. Peserta didik dapat mempraktikkan gerakan dan bacaan salat dengan benar.",
          },
          {
            nama: "Sejarah Peradaban Islam",
            deskripsi:
              "Peserta didik mengenal kisah Nabi Muhammad saw. pada masa kanak-kanak dan silsilah keluarganya.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Al-Qur'an dan Hadis",
            deskripsi:
              "Peserta didik membaca Al-Qur'an dengan tartil, memahami surah-surah pilihan, dan menghafal beberapa hadis tentang akhlak, serta memahami hubungannya dengan kehidupan sehari-hari.",
          },
          {
            nama: "Akidah",
            deskripsi:
              "Peserta didik memahami rukun iman, iman kepada hari akhir, dan qadar. Peserta didik memahami beberapa asmaul husna dan menerapkannya dalam kehidupan.",
          },
          {
            nama: "Akhlak",
            deskripsi:
              "Peserta didik memahami akhlak terhadap sesama, tetangga, non muslim, hewan, dan tumbuhan. Peserta didik meneladani kisah-kisah keteladanan nabi dan sahabat.",
          },
          {
            nama: "Fikih",
            deskripsi:
              "Peserta didik memahami ketentuan puasa, zakat, infak, sedekah, dan makanan serta minuman halal dan haram. Peserta didik dapat melaksanakan salat fardu dan salat Jumat.",
          },
          {
            nama: "Sejarah Peradaban Islam",
            deskripsi:
              "Peserta didik memahami kisah Nabi Muhammad saw. periode sebelum kenabian dan awal-awal dakwah Islam.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Al-Qur'an dan Hadis",
            deskripsi:
              "Peserta didik membaca Al-Qur'an dengan tartil berdasarkan kaidah tajwid, menghafal surah-surah pendek pilihan, dan memahami isi kandungannya serta mengaitkan dengan kehidupan.",
          },
          {
            nama: "Akidah",
            deskripsi:
              "Peserta didik memahami makna iman kepada rasul-rasul Allah, iman kepada hari akhir secara lebih mendalam, serta memahami asmaul husna yang lebih banyak.",
          },
          {
            nama: "Akhlak",
            deskripsi:
              "Peserta didik memahami akhlak terhadap Allah dengan bertawakal dan bersyukur, dan akhlak mulia dalam kehidupan sosial. Peserta didik dapat menghindari perilaku tercela.",
          },
          {
            nama: "Fikih",
            deskripsi:
              "Peserta didik memahami ketentuan shalat berjamaah, shalat sunnah, dan tata cara ibadah haji secara sederhana. Peserta didik memahami hukum-hukum fikih dalam keseharian.",
          },
          {
            nama: "Sejarah Peradaban Islam",
            deskripsi:
              "Peserta didik memahami kisah Nabi Muhammad saw. periode Madinah dan khulafaurasyidin, serta dapat meneladani nilai-nilai perjuangan mereka.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Al-Qur'an dan Hadis",
            deskripsi:
              "Peserta didik membaca Al-Qur'an dengan tartil, memahami beberapa ayat Al-Qur'an terkait akidah, akhlak, dan ketentuan syariat, serta memahami dan mengaplikasikan hadis dalam kehidupan.",
          },
          {
            nama: "Akidah",
            deskripsi:
              "Peserta didik memahami rukun iman secara mendalam, termasuk iman kepada qada dan qadar, serta implikasinya dalam perilaku. Peserta didik memahami sifat-sifat Allah yang wajib, mustahil, dan jaiz.",
          },
          {
            nama: "Akhlak",
            deskripsi:
              "Peserta didik memahami akhlak terhadap Allah, rasul, sesama, dan lingkungan secara lebih komprehensif. Peserta didik dapat menganalisis dan menghindari perilaku tercela.",
          },
          {
            nama: "Fikih",
            deskripsi:
              "Peserta didik memahami ketentuan ibadah, penyembelihan hewan, dan fikih muamalah dasar. Peserta didik memahami konsep halal-haram dalam berbagai aspek kehidupan.",
          },
          {
            nama: "Sejarah Peradaban Islam",
            deskripsi:
              "Peserta didik memahami peradaban Islam pasca khulafaurasyidin, dinasti-dinasti Islam, serta perkembangan ilmu pengetahuan di dunia Islam.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Al-Qur'an dan Hadis",
            deskripsi:
              "Peserta didik menganalisis ayat-ayat Al-Qur'an dan hadis terkait isu-isu kontemporer. Peserta didik memahami ilmu tafsir dan ulumul Quran secara dasar serta dapat mengkontekstualisasikan ayat Al-Qur'an.",
          },
          {
            nama: "Akidah",
            deskripsi:
              "Peserta didik memahami perkembangan pemikiran akidah Islam (ilmu kalam) dan mampu menganalisis berbagai aliran dalam Islam serta menyikapinya secara kritis.",
          },
          {
            nama: "Akhlak",
            deskripsi:
              "Peserta didik memahami dan mengembangkan akhlak Islam secara komprehensif dalam kehidupan pribadi, keluarga, masyarakat, dan bernegara. Peserta didik menghindari akhlak tercela.",
          },
          {
            nama: "Fikih",
            deskripsi:
              "Peserta didik memahami fikih munakahat (pernikahan), muamalah, dan jinayah. Peserta didik dapat menganalisis permasalahan fikih kontemporer.",
          },
          {
            nama: "Sejarah Peradaban Islam",
            deskripsi:
              "Peserta didik memahami perkembangan peradaban Islam di masa modern dan kontribusi ilmuwan Muslim, serta nilai-nilai yang dapat diteladani.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Al-Qur'an dan Hadis",
            deskripsi:
              "Peserta didik memahami ilmu tafsir mendalam dan mampu menafsirkan ayat-ayat pilihan secara kontekstual. Peserta didik memahami ilmu hadis (mustalah hadis) dan dapat melakukan kritik matan dan sanad.",
          },
          {
            nama: "Akidah",
            deskripsi:
              "Peserta didik mampu menganalisis dan mengevaluasi berbagai isu aqidah kontemporer seperti sekularisme, pluralisme agama, dan liberalisme berdasarkan Al-Qur'an dan Hadis.",
          },
          {
            nama: "Akhlak",
            deskripsi:
              "Peserta didik mampu menerapkan nilai-nilai Islam dalam kehidupan bermasyarakat, berbangsa, dan bernegara. Peserta didik berperan aktif dalam dakwah bil hal.",
          },
          {
            nama: "Fikih",
            deskripsi:
              "Peserta didik memahami ushul fikih, kaidah-kaidah fikih, dan ijtihad untuk memecahkan masalah fikih kontemporer. Peserta didik memahami ekonomi syariah.",
          },
          {
            nama: "Sejarah Peradaban Islam",
            deskripsi:
              "Peserta didik mampu menganalisis perkembangan Islam di Indonesia dan dunia, serta merespons isu-isu peradaban Islam kontemporer secara kritis.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. PENDIDIKAN JASMANI, OLAHRAGA, DAN KESEHATAN (PJOK)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Keterampilan Gerak",
            deskripsi:
              "Peserta didik dapat menunjukkan berbagai aktivitas pola gerak dasar (lokomotor, non-lokomotor, dan manipulatif) melalui permainan dan aktivitas jasmani.",
          },
          {
            nama: "Pengetahuan Gerak",
            deskripsi:
              "Peserta didik memahami prosedur pola gerak dasar (lokomotor, non-lokomotor, dan manipulatif) dan kaitannya dengan aktivitas jasmani sehari-hari.",
          },
          {
            nama: "Pemanfaatan Gerak",
            deskripsi:
              "Peserta didik menunjukkan perilaku bertanggung jawab dalam menjaga kebersihan tubuh dan mengenal anggota tubuh serta cara merawatnya.",
          },
          {
            nama: "Pengembangan Karakter",
            deskripsi:
              "Peserta didik menunjukkan perilaku hormat, jujur, bekerja keras, disiplin, dan menerima arahan dalam aktivitas jasmani.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Keterampilan Gerak",
            deskripsi:
              "Peserta didik menunjukkan berbagai aktivitas variasi dan kombinasi pola gerak dasar melalui permainan dan olahraga.",
          },
          {
            nama: "Pengetahuan Gerak",
            deskripsi:
              "Peserta didik memahami prosedur variasi dan kombinasi pola gerak dasar dan cara menerapkannya dalam permainan.",
          },
          {
            nama: "Pemanfaatan Gerak",
            deskripsi:
              "Peserta didik memahami pola makan sehat, bergizi, dan seimbang, serta dampak aktivitas fisik terhadap kesehatan.",
          },
          {
            nama: "Pengembangan Karakter",
            deskripsi:
              "Peserta didik menunjukkan sikap sportif, bekerja sama, berbagi, dan bertanggung jawab dalam aktivitas jasmani.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Keterampilan Gerak",
            deskripsi:
              "Peserta didik menunjukkan berbagai aktivitas kombinasi dan pengembangan pola gerak dasar dalam permainan beregu, senam, aktivitas berirama, dan olahraga perorangan.",
          },
          {
            nama: "Pengetahuan Gerak",
            deskripsi:
              "Peserta didik menganalisis prosedur kombinasi gerak dasar dan strategi dalam berbagai aktivitas permainan.",
          },
          {
            nama: "Pemanfaatan Gerak",
            deskripsi:
              "Peserta didik memahami bahaya merokok, minuman keras, narkoba, dan dampak pergaulan bebas terhadap kesehatan.",
          },
          {
            nama: "Pengembangan Karakter",
            deskripsi:
              "Peserta didik menunjukkan etika yang baik, sikap sportif, dan menghargai perbedaan dalam aktivitas jasmani.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Keterampilan Gerak",
            deskripsi:
              "Peserta didik dapat menunjukkan berbagai keterampilan gerak spesifik dan fungsional dalam berbagai permainan bola besar, bola kecil, bela diri, atletik, senam, aktivitas berirama, dan olahraga air.",
          },
          {
            nama: "Pengetahuan Gerak",
            deskripsi:
              "Peserta didik memahami konsep dan prinsip gerak yang efisien dan efektif, serta strategi dalam berbagai aktivitas permainan.",
          },
          {
            nama: "Pemanfaatan Gerak",
            deskripsi:
              "Peserta didik dapat merancang program latihan untuk meningkatkan kebugaran jasmani secara mandiri.",
          },
          {
            nama: "Pengembangan Karakter",
            deskripsi:
              "Peserta didik menginisiasi kerja sama, kepemimpinan, dan tanggung jawab dalam kegiatan jasmani.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Keterampilan Gerak",
            deskripsi:
              "Peserta didik menunjukkan kemampuan dalam berbagai keterampilan gerak (permainan, atletik, beladiri, senam, dll) dan dapat mengevaluasi efektivitas teknik yang digunakan.",
          },
          {
            nama: "Pengetahuan Gerak",
            deskripsi:
              "Peserta didik dapat mengevaluasi fakta, konsep, prinsip, dan prosedur dalam berbagai aktivitas jasmani dan olahraga.",
          },
          {
            nama: "Pemanfaatan Gerak",
            deskripsi:
              "Peserta didik menganalisis dampak aktivitas fisik terhadap kesehatan fisik dan mental, serta merancang program kebugaran yang komprehensif.",
          },
          {
            nama: "Pengembangan Karakter",
            deskripsi:
              "Peserta didik menunjukkan kemampuan kepemimpinan, manajemen konflik, dan etika dalam olahraga.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Keterampilan Gerak",
            deskripsi:
              "Peserta didik dapat merancang, menerapkan, dan mengevaluasi berbagai keterampilan gerak untuk peningkatan penampilan dalam olahraga pilihan.",
          },
          {
            nama: "Pengetahuan Gerak",
            deskripsi:
              "Peserta didik mengadaptasi dan mengembangkan strategi, taktik, dan teknik dalam aktivitas jasmani kompetitif maupun rekreatif.",
          },
          {
            nama: "Pemanfaatan Gerak",
            deskripsi:
              "Peserta didik berpartisipasi aktif dalam program kebugaran jangka panjang dan memahami pentingnya gaya hidup aktif sepanjang hayat.",
          },
          {
            nama: "Pengembangan Karakter",
            deskripsi:
              "Peserta didik mengadvokasi gaya hidup aktif dan sehat kepada lingkungannya, serta menjadi teladan dalam fair play dan sportivitas.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. SENI BUDAYA (mencakup Seni Rupa, Musik, Tari, Teater)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Seni Budaya",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Mengalami",
            deskripsi:
              "Peserta didik mampu mengamati unsur-unsur seni rupa, bunyi dan gerak di lingkungan sekitarnya. Peserta didik dapat mengenal dan menerapkan elemen seni dalam berkarya.",
          },
          {
            nama: "Menciptakan",
            deskripsi:
              "Peserta didik mampu mengeksplorasi alat, bahan, teknik, prosedur, dan media dalam karya seni rupa dua dan tiga dimensi, menyanyikan lagu, dan bergerak mengikuti bunyi.",
          },
          {
            nama: "Merefleksikan",
            deskripsi:
              "Peserta didik mampu mengenali dan menceritakan kembali karya seni yang dibuatnya dan karya orang lain.",
          },
          {
            nama: "Berpikir dan Bekerja Artistik",
            deskripsi:
              "Peserta didik mampu menunjukkan antusiasme dan kebanggaan dalam melakukan kegiatan seni. Peserta didik mengenal berbagai profesi dan aktivitas seni.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Mengalami",
            deskripsi:
              "Peserta didik mampu mengamati, mengenal, dan mengidentifikasi unsur-unsur seni (rupa, musik, tari, teater) dalam karya dan pertunjukan.",
          },
          {
            nama: "Menciptakan",
            deskripsi:
              "Peserta didik mampu membuat karya seni sesuai instruksi dengan menggunakan berbagai media dan teknik dasar, serta berpartisipasi dalam kegiatan musik, tari, atau teater sederhana.",
          },
          {
            nama: "Merefleksikan",
            deskripsi:
              "Peserta didik mampu membandingkan karyanya dengan karya orang lain, serta menceritakan perasaan dan pendapatnya tentang karya seni.",
          },
          {
            nama: "Berpikir dan Bekerja Artistik",
            deskripsi:
              "Peserta didik mampu bekerja secara mandiri maupun berkelompok, menghargai proses berkarya, dan mengenal seni budaya daerah setempat.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Mengalami",
            deskripsi:
              "Peserta didik mampu menganalisis hubungan keterkaitan antar elemen seni dalam sebuah karya dan pertunjukan seni budaya.",
          },
          {
            nama: "Menciptakan",
            deskripsi:
              "Peserta didik mampu menciptakan karya seni yang menunjukkan ekspresi diri dan identitas budaya dengan menggunakan teknik yang tepat.",
          },
          {
            nama: "Merefleksikan",
            deskripsi:
              "Peserta didik mampu memberikan pendapat tentang kualitas estetis dan fungsi karya seni, serta mengapresiasi keberagaman seni budaya daerah.",
          },
          {
            nama: "Berdampak",
            deskripsi:
              "Peserta didik menghasilkan karya seni yang memberikan dampak positif bagi diri sendiri dan lingkungan sekitarnya.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Mengalami",
            deskripsi:
              "Peserta didik mampu mengeksplorasi dan mengembangkan kepekaan rasa estetis, minat berkesenian, dan kemampuan mengekspresikan pikiran dan/atau perasaannya melalui berbagai bidang seni (seni rupa, musik, tari, teater).",
          },
          {
            nama: "Menciptakan",
            deskripsi:
              "Peserta didik mampu menciptakan karya seni yang menunjukkan orisinalitas dan identitasnya, berdasarkan eksplorasi dan imajinasi.",
          },
          {
            nama: "Merefleksikan",
            deskripsi:
              "Peserta didik mampu mengevaluasi karya seni berdasarkan efektivitas pesan yang disampaikan dan kualitas estetisnya.",
          },
          {
            nama: "Berpikir dan Bekerja Artistik",
            deskripsi:
              "Peserta didik mampu merancang proses kreatif dari perencanaan, penerapan, hingga penyelesaian dan pameran/pertunjukan karya.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Mengalami",
            deskripsi:
              "Peserta didik mampu mengamati, mengenal, dan menggunakan istilah teknis dalam menganalisis karya seni berdasarkan konteks historis dan budaya.",
          },
          {
            nama: "Menciptakan",
            deskripsi:
              "Peserta didik mampu menciptakan karya seni yang menunjukkan kematangan konsep, keahlian teknis, dan kreativitas yang tinggi.",
          },
          {
            nama: "Merefleksikan",
            deskripsi:
              "Peserta didik mampu mempresentasikan dan mempertanggungjawabkan karya seni yang dibuatnya menggunakan istilah teknis yang tepat.",
          },
          {
            nama: "Berdampak",
            deskripsi:
              "Peserta didik mampu berkontribusi dalam kehidupan berbudaya di sekolah dan masyarakat melalui berkesenian.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Mengalami",
            deskripsi:
              "Peserta didik mampu menganalisis dan menghubungkan berbagai karya seni dengan disiplin ilmu lain, konteks sosial-budaya, dan isu global.",
          },
          {
            nama: "Menciptakan",
            deskripsi:
              "Peserta didik mampu memproduksi karya seni yang profesional dan/atau eksperimental dengan konsep yang matang.",
          },
          {
            nama: "Merefleksikan",
            deskripsi:
              "Peserta didik mampu memberikan kritik seni secara komprehensif dan mengembangkan sudut pandang estetis yang personal.",
          },
          {
            nama: "Berpikir dan Bekerja Artistik",
            deskripsi:
              "Peserta didik mampu mengelola proyek seni atau pameran/pertunjukan secara mandiri, profesional, dan kolaboratif.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. INFORMATIKA (Fase B–F, dimulai dari Kelas 3)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Informatika",
    fases: [
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Berpikir Komputasional",
            deskripsi:
              "Peserta didik mampu menerapkan berpikir komputasional dalam menyelesaikan persoalan yang mengandung dekomposisi, pengenalan pola, abstraksi, dan algoritma, khususnya dalam memecahkan persoalan-persoalan sederhana.",
          },
          {
            nama: "Teknologi Informasi dan Komunikasi",
            deskripsi:
              "Peserta didik mampu menggunakan antarmuka berbasis grafis dari sebuah perangkat TIK, dengan panduan untuk menjalankan aplikasi, menyimpan berkas dan mencari berkas, dan terampil menggunakan perangkat TIK untuk berkomunikasi.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 SD/MI",
        capaianPembelajarans: [
          {
            nama: "Berpikir Komputasional",
            deskripsi:
              "Peserta didik mampu menerapkan berpikir komputasional dalam menyelesaikan persoalan-persoalan yang lebih kompleks yang mengandung dekomposisi, pengenalan pola, abstraksi, dan formulasi algoritma.",
          },
          {
            nama: "Teknologi Informasi dan Komunikasi",
            deskripsi:
              "Peserta didik mampu menggunakan surel untuk berkomunikasi, menggunakan berbagai perangkat lunak untuk berkreasi, dan mengetahui cara mengakses, mengelola, mengintegrasikan, mengevaluasi, membuat, dan berkomunikasi menggunakan informasi.",
          },
          {
            nama: "Analisis Data",
            deskripsi:
              "Peserta didik mampu mengumpulkan dan mengolah data ke dalam tabel, melakukan perhitungan statistika sederhana, dan menyajikannya dalam bentuk diagram.",
          },
          {
            nama: "Dampak Sosial Informatika",
            deskripsi:
              "Peserta didik memahami aspek privasi, keamanan data, dan etika dalam menggunakan teknologi informasi.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Berpikir Komputasional",
            deskripsi:
              "Peserta didik mampu menerapkan berpikir komputasional untuk menghasilkan beberapa solusi dari persoalan dengan data diskrit bervolume kecil dan mendisposisikan berpikir komputasional dalam bidang lain.",
          },
          {
            nama: "Teknologi Informasi dan Komunikasi",
            deskripsi:
              "Peserta didik mampu memanfaatkan aplikasi surel dalam berkomunikasi, aplikasi peramban dalam pencarian informasi, serta mengintegrasikan konten dari berbagai aplikasi perkantoran.",
          },
          {
            nama: "Sistem Komputer",
            deskripsi:
              "Peserta didik mampu memahami interaksi antara perangkat keras, perangkat lunak, dan pengguna, mengetahui cara kerja sistem operasi, dan memahami fungsi jaringan komputer.",
          },
          {
            nama: "Algoritma dan Pemrograman",
            deskripsi:
              "Peserta didik mampu memahami konsep algoritma, struktur kontrol (percabangan dan perulangan), dan mengimplementasikannya dalam bahasa pemrograman visual/blok.",
          },
          {
            nama: "Dampak Sosial Informatika",
            deskripsi:
              "Peserta didik memahami sejarah perkembangan komputer, dampak positif dan negatif teknologi informasi, serta isu etika dan hukum dalam dunia digital.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Berpikir Komputasional",
            deskripsi:
              "Peserta didik mampu menerapkan strategi algoritmik standar pada berbagai persoalan dan memahami kompleksitas algoritma sederhana.",
          },
          {
            nama: "Teknologi Informasi dan Komunikasi",
            deskripsi:
              "Peserta didik memanfaatkan berbagai aplikasi secara bersamaan dan optimal untuk berkomunikasi, mencari sumber data, mengelola data, dan membuat laporan.",
          },
          {
            nama: "Sistem Komputer",
            deskripsi:
              "Peserta didik memahami mekanisme internal perangkat keras komputer (CPU, memori, I/O), sistem operasi, dan jaringan komputer.",
          },
          {
            nama: "Algoritma dan Pemrograman",
            deskripsi:
              "Peserta didik mampu merancang, mengimplementasikan, dan menguji algoritma menggunakan pemrograman prosedural, termasuk penggunaan fungsi dan rekursi.",
          },
          {
            nama: "Dampak Sosial Informatika",
            deskripsi:
              "Peserta didik memahami dan mengevaluasi dampak sosial teknologi digital, termasuk privasi, keamanan siber, kekayaan intelektual, dan isu media sosial.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Berpikir Komputasional",
            deskripsi:
              "Peserta didik mampu menganalisis persoalan yang lebih kompleks menggunakan teknik rekursi, pemrograman dinamis, dan struktur data lanjutan.",
          },
          {
            nama: "Jaringan Komputer dan Internet",
            deskripsi:
              "Peserta didik memahami arsitektur jaringan komputer, protokol jaringan (TCP/IP), dan keamanan jaringan.",
          },
          {
            nama: "Analisis Data",
            deskripsi:
              "Peserta didik mampu melakukan eksplorasi data (data mining sederhana), visualisasi data lanjutan, dan memahami konsep dasar kecerdasan buatan.",
          },
          {
            nama: "Algoritma dan Pemrograman",
            deskripsi:
              "Peserta didik mampu mengembangkan aplikasi sederhana berbasis pemrograman berorientasi objek atau berbasis web dengan memperhatikan prinsip-prinsip rekayasa perangkat lunak.",
          },
          {
            nama: "Dampak Sosial Informatika",
            deskripsi:
              "Peserta didik mampu mengevaluasi tren teknologi terkini dan dampaknya terhadap kehidupan sosial, ekonomi, dan budaya secara global.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. KODING DAN KECERDASAN ARTIFISIAL (KKA) — Baru di CP 046/2025
  //     Mata pelajaran pilihan, Fase D–F
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Koding dan Kecerdasan Artifisial",
    fases: [
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Koding",
            deskripsi:
              "Peserta didik mampu memahami konsep dasar pemrograman, menerapkan logika kondisional dan perulangan, serta membuat program sederhana berbasis blok atau teks untuk memecahkan masalah sehari-hari.",
          },
          {
            nama: "Kecerdasan Artifisial",
            deskripsi:
              "Peserta didik mampu mengenal konsep dasar kecerdasan artifisial (AI), memahami cara kerja AI dalam aplikasi sehari-hari (rekomendasi, pengenalan gambar, asisten virtual), dan merefleksikan dampak etis penggunaan AI.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Koding",
            deskripsi:
              "Peserta didik mampu merancang dan mengimplementasikan program menggunakan bahasa pemrograman teks, menerapkan struktur data dasar (array, list, dictionary), dan membuat proyek perangkat lunak sederhana.",
          },
          {
            nama: "Kecerdasan Artifisial",
            deskripsi:
              "Peserta didik memahami konsep machine learning, supervised dan unsupervised learning, serta dapat menggunakan platform AI sederhana untuk melakukan klasifikasi atau prediksi data.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA/SMK",
        capaianPembelajarans: [
          {
            nama: "Koding",
            deskripsi:
              "Peserta didik mampu mengembangkan aplikasi yang mengintegrasikan komponen UI, logika bisnis, dan basis data, serta menerapkan prinsip-prinsip pengembangan perangkat lunak kolaboratif.",
          },
          {
            nama: "Kecerdasan Artifisial",
            deskripsi:
              "Peserta didik mampu merancang dan mengimplementasikan proyek AI sederhana menggunakan library/framework yang tersedia, serta mengevaluasi performa model dan mempertimbangkan aspek etika AI.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. PRAKARYA (SMP Fase D)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Prakarya",
    fases: [
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 SMP/MTs",
        capaianPembelajarans: [
          {
            nama: "Kerajinan",
            deskripsi:
              "Peserta didik mampu mengeksplorasi dan mengembangkan ide kreatif dalam membuat kerajinan dari berbagai bahan dan teknik. Peserta didik dapat merancang, membuat, dan mengevaluasi produk kerajinan dengan mempertimbangkan fungsi, estetika, dan nilai ekonomi.",
          },
          {
            nama: "Rekayasa",
            deskripsi:
              "Peserta didik mampu merancang dan membuat produk rekayasa sederhana untuk memecahkan masalah di lingkungan sekitarnya dengan menggunakan prinsip-prinsip teknologi.",
          },
          {
            nama: "Budidaya",
            deskripsi:
              "Peserta didik memahami prinsip-prinsip budidaya tanaman dan hewan, serta mampu menerapkannya dalam skala kecil secara berkelanjutan.",
          },
          {
            nama: "Pengolahan",
            deskripsi:
              "Peserta didik mampu mengidentifikasi dan mengolah hasil pertanian, perikanan, dan produk pangan lokal menjadi produk siap konsumsi dengan mempertimbangkan nilai gizi dan keamanan pangan.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. BAHASA ARAB (Fase A–F, umumnya di MI/MTs/MA)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Bahasa Arab",
    fases: [
      {
        nama: "Fase A",
        keterangan: "Kelas 1 & 2 MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu mengidentifikasi bunyi huruf hijaiyah dan kata-kata sederhana dalam bahasa Arab yang didengar.",
          },
          {
            nama: "Berbicara",
            deskripsi:
              "Peserta didik mampu melafalkan bunyi huruf hijaiyah secara terpisah maupun bersambung, dan mengucapkan kata-kata sederhana tentang perkenalan diri dan benda-benda sekitar.",
          },
          {
            nama: "Membaca",
            deskripsi:
              "Peserta didik mampu membaca huruf dan kata dalam bahasa Arab secara sederhana.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menyalin huruf-huruf hijaiyah dan kata-kata sederhana dalam bahasa Arab.",
          },
        ],
      },
      {
        nama: "Fase B",
        keterangan: "Kelas 3 & 4 MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu memahami informasi sederhana dari teks lisan berbahasa Arab tentang topik sehari-hari.",
          },
          {
            nama: "Berbicara",
            deskripsi:
              "Peserta didik mampu berinteraksi menggunakan kalimat-kalimat pendek dan sederhana dalam bahasa Arab untuk menyampaikan informasi tentang diri dan lingkungan sekitar.",
          },
          {
            nama: "Membaca",
            deskripsi:
              "Peserta didik mampu membaca teks sederhana dalam bahasa Arab dengan lafal dan intonasi yang benar.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis kata dan kalimat sederhana dalam bahasa Arab dengan benar.",
          },
        ],
      },
      {
        nama: "Fase C",
        keterangan: "Kelas 5 & 6 MI",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu memahami ide pokok dan informasi tertentu dari berbagai teks lisan berbahasa Arab.",
          },
          {
            nama: "Berbicara",
            deskripsi:
              "Peserta didik mampu bercakap-cakap tentang berbagai topik menggunakan bahasa Arab dengan kosakata yang memadai.",
          },
          {
            nama: "Membaca",
            deskripsi:
              "Peserta didik mampu membaca dan memahami berbagai teks bahasa Arab serta mengidentifikasi informasi dari teks tersebut.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis teks pendek dan sederhana dalam bahasa Arab sesuai kaidah imlak.",
          },
        ],
      },
      {
        nama: "Fase D",
        keterangan: "Kelas 7, 8 & 9 MTs",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu memahami informasi dan pesan dari berbagai teks lisan berbahasa Arab tentang topik yang lebih beragam.",
          },
          {
            nama: "Berbicara",
            deskripsi:
              "Peserta didik mampu mengekspresikan diri, mendiskusikan, dan mempresentasikan berbagai topik menggunakan bahasa Arab dengan struktur kalimat yang benar.",
          },
          {
            nama: "Membaca",
            deskripsi:
              "Peserta didik mampu membaca dan menganalisis teks berbahasa Arab (naratif, deskriptif, informatif) dengan memahami unsur kebahasaan dan makna.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis berbagai jenis teks dalam bahasa Arab dengan memperhatikan kaidah nahwu dan sharaf.",
          },
        ],
      },
      {
        nama: "Fase E",
        keterangan: "Kelas 10 MA/MAK",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu menganalisis dan mengevaluasi informasi dari teks lisan bahasa Arab yang kompleks, termasuk teks akademis dan keagamaan.",
          },
          {
            nama: "Berbicara",
            deskripsi:
              "Peserta didik mampu mengekspresikan pendapat, berargumentasi, dan berdiskusi tentang berbagai isu menggunakan bahasa Arab yang fasih.",
          },
          {
            nama: "Membaca",
            deskripsi:
              "Peserta didik mampu membaca dan memahami teks berbahasa Arab yang autentik, termasuk teks keagamaan dan akademis.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menulis karya ilmiah sederhana dan teks argumentatif dalam bahasa Arab.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 MA/MAK",
        capaianPembelajarans: [
          {
            nama: "Menyimak",
            deskripsi:
              "Peserta didik mampu mengevaluasi secara kritis berbagai wacana lisan berbahasa Arab dari berbagai sumber.",
          },
          {
            nama: "Berbicara",
            deskripsi:
              "Peserta didik mampu berdebat, berdiplomasi, dan berkomunikasi secara profesional menggunakan bahasa Arab.",
          },
          {
            nama: "Membaca",
            deskripsi:
              "Peserta didik mampu mengkritisi dan menganalisis teks sastra dan ilmiah berbahasa Arab secara mendalam.",
          },
          {
            nama: "Menulis",
            deskripsi:
              "Peserta didik mampu menghasilkan karya tulis ilmiah dan sastra dalam bahasa Arab dengan kaidah yang benar.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. SEJARAH (SMA Fase E–F)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Sejarah",
    fases: [
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Sejarah",
            deskripsi:
              "Peserta didik mampu memahami konsep dasar ilmu sejarah meliputi pengertian sejarah, sumber dan penelitian sejarah, metode sejarah, dan historiografi. Peserta didik memahami sejarah manusia praaksara dan periodisasinya.",
          },
          {
            nama: "Keterampilan Sejarah",
            deskripsi:
              "Peserta didik mampu menggunakan keterampilan berpikir sejarah (diakronis dan sinkronis), menganalisis sumber sejarah, serta menyajikan hasil analisis sejarah dalam berbagai format.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Sejarah",
            deskripsi:
              "Peserta didik memahami perjalanan sejarah Indonesia dari masa kerajaan Hindu-Buddha, Islam, kolonialisme, kebangkitan nasional, proklamasi, hingga masa kontemporer. Peserta didik mampu menganalisis pengaruh sejarah dunia terhadap Indonesia.",
          },
          {
            nama: "Keterampilan Sejarah",
            deskripsi:
              "Peserta didik mampu melakukan penelitian sejarah sederhana, menganalisis kausalitas dalam sejarah, mengevaluasi berbagai interpretasi sejarah, dan mengembangkan kesadaran historis.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 16. GEOGRAFI (SMA Fase E–F)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Geografi",
    fases: [
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Geografi",
            deskripsi:
              "Peserta didik memahami hakikat ilmu geografi, konsep esensial geografi, pendekatan geografi, dan prinsip geografi dalam mengkaji fenomena geosfer. Peserta didik memahami Bumi sebagai ruang kehidupan serta dinamika litosfer, atmosfer, dan hidrosfer.",
          },
          {
            nama: "Keterampilan Geografi",
            deskripsi:
              "Peserta didik mampu membaca dan menganalisis peta, citra penginderaan jauh, dan Sistem Informasi Geografis (SIG) sederhana. Peserta didik melakukan observasi fenomena geografi di lingkungan sekitar.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Geografi",
            deskripsi:
              "Peserta didik memahami dinamika biosfer dan antroposfer, persebaran sumber daya alam, ketahanan pangan, potensi wilayah Indonesia dan dunia, kerjasama internasional, serta pola keruangan desa dan kota.",
          },
          {
            nama: "Keterampilan Geografi",
            deskripsi:
              "Peserta didik mampu melakukan penelitian geografi, menggunakan SIG untuk menganalisis isu-isu lingkungan dan kewilayahan, serta mengembangkan kesadaran geografi dan wawasan kelingkungan.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 17. EKONOMI (SMA Fase E–F)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Ekonomi",
    fases: [
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Ekonomi",
            deskripsi:
              "Peserta didik memahami konsep dasar ilmu ekonomi, kelangkaan dan kebutuhan, sistem ekonomi, perilaku konsumen dan produsen, pasar dan harga, serta pendapatan nasional. Peserta didik memahami lembaga keuangan dan OJK.",
          },
          {
            nama: "Keterampilan Ekonomi",
            deskripsi:
              "Peserta didik dapat mengidentifikasi masalah ekonomi dalam kehidupan sehari-hari, menganalisis data ekonomi sederhana, dan menyajikan solusi atas masalah ekonomi dengan argumen yang terstruktur.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Ekonomi",
            deskripsi:
              "Peserta didik memahami konsep ketenagakerjaan, pembangunan ekonomi, APBN/APBD, perpajakan, kerjasama ekonomi internasional, dan prinsip-prinsip akuntansi dasar. Peserta didik memahami konsep ekonomi syariah.",
          },
          {
            nama: "Keterampilan Ekonomi",
            deskripsi:
              "Peserta didik mampu menganalisis kebijakan fiskal dan moneter, membuat siklus akuntansi sederhana, serta mengevaluasi isu-isu ekonomi global dan dampaknya terhadap Indonesia.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 18. SOSIOLOGI (SMA Fase E–F)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    nama: "Sosiologi",
    fases: [
      {
        nama: "Fase E",
        keterangan: "Kelas 10 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Sosiologi",
            deskripsi:
              "Peserta didik memahami sosiologi sebagai ilmu sosial, fungsi sosiologi dalam kehidupan masyarakat, nilai dan norma sosial, interaksi sosial, lembaga sosial, dan proses sosialisasi.",
          },
          {
            nama: "Keterampilan Sosiologi",
            deskripsi:
              "Peserta didik mampu mengobservasi gejala sosial di lingkungan sekitar, menganalisis dampak masalah sosial, dan menyajikan temuannya menggunakan konsep-konsep sosiologi.",
          },
        ],
      },
      {
        nama: "Fase F",
        keterangan: "Kelas 11 & 12 SMA/MA",
        capaianPembelajarans: [
          {
            nama: "Pemahaman Konsep Sosiologi",
            deskripsi:
              "Peserta didik memahami struktur sosial, stratifikasi sosial, mobilitas sosial, konflik sosial, integrasi sosial, perubahan sosial, dan lembaga sosial yang lebih kompleks dalam masyarakat multikultural.",
          },
          {
            nama: "Keterampilan Sosiologi",
            deskripsi:
              "Peserta didik mampu melakukan penelitian sosial (observasi, wawancara, angket, studi dokumentasi), menganalisis data sosial, dan mengembangkan solusi atas masalah sosial berdasarkan pendekatan sosiologis.",
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Starting seed — CP Kurikulum Merdeka (BSKAP 046/2025)...\n");

  for (const mapelData of SEED_DATA) {
    // Upsert mata pelajaran
    const mapel = await prisma.mataPelajaran.upsert({
      where: { nama: mapelData.nama },
      update: {},
      create: { nama: mapelData.nama },
    });

    console.log(`📚 Mata Pelajaran: ${mapel.nama}`);

    for (const faseData of mapelData.fases) {
      // Upsert fase
      const existingFase = await prisma.fase.findFirst({
        where: {
          mataPelajaranId: mapel.id,
          nama: faseData.nama,
        },
      });

      let fase;
      if (existingFase) {
        fase = await prisma.fase.update({
          where: { id: existingFase.id },
          data: { keterangan: faseData.keterangan },
        });
      } else {
        fase = await prisma.fase.create({
          data: {
            nama: faseData.nama,
            keterangan: faseData.keterangan,
            mataPelajaranId: mapel.id,
          },
        });
      }

      console.log(`  📋 Fase: ${fase.nama} (${fase.keterangan})`);

      // Upsert capaian pembelajaran
      for (const cpData of faseData.capaianPembelajarans || []) {
        const existingCp = await prisma.capaianPembelajaran.findFirst({
          where: {
            faseId: fase.id,
            nama: cpData.nama,
          },
        });

        if (existingCp) {
          await prisma.capaianPembelajaran.update({
            where: { id: existingCp.id },
            data: { deskripsi: cpData.deskripsi },
          });
        } else {
          await prisma.capaianPembelajaran.create({
            data: {
              nama: cpData.nama,
              deskripsi: cpData.deskripsi,
              faseId: fase.id,
            },
          });
        }
      }

      console.log(
        `     ✓ ${faseData.capaianPembelajarans?.length || 0} CP di-seed`
      );
    }

    console.log();
  }

  // Summary
  const totalMapel = await prisma.mataPelajaran.count();
  const totalFase = await prisma.fase.count();
  const totalCp = await prisma.capaianPembelajaran.count();

  console.log("─────────────────────────────────────────────");
  console.log(`✅ Seed selesai!`);
  console.log(`   📚 Total Mata Pelajaran : ${totalMapel}`);
  console.log(`   📋 Total Fase           : ${totalFase}`);
  console.log(`   🎯 Total CP             : ${totalCp}`);
  console.log("─────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });