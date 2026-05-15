# PedagoAI — Generator Perangkat Ajar Kurikulum Merdeka

Platform berbasis AI untuk membantu guru Indonesia menyusun perangkat ajar Kurikulum Merdeka secara otomatis: **RPP Pembelajaran Mendalam**, **Program Tahunan (Prota)**, dan **Program Semester (Promes)**.

---

## Fitur

### RPP (Rencana Pembelajaran Mendalam)
- Generate otomatis via AI Mistral sesuai format resmi **Kemendikdasmen**
- Format **Pembelajaran Mendalam** (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)
- Integrasi 8 Dimensi Profil Pelajar Pancasila
- 7 Bagian RPP lengkap:
  - A. Karakteristik Pembelajaran
  - B. Desain Pembelajaran (CP, TP, Kriteria Pencapaian)
  - C. Pengalaman Belajar (Awal → Memahami → Mengaplikasi → Merefleksi → Penutup)
  - D. Asesmen (Awal, Formatif, Sumatif, Pengayaan, Remedial)
  - E. Glosarium
  - F. Pertanyaan Refleksi Guru
  - G. Lembar Kerja Peserta Didik
- Dukungan **dua bahasa**: Indonesia dan **English**
- Export ke **Word** (.docx) dan **Excel** (.xlsx)
- Simpan & kelola di dashboard
- Riwayat generate dengan pagination

### Program Tahunan (Prota)
- Generate otomatis via AI Mistral
- Distribusi Capaian Pembelajaran ke alur pembelajaran satu tahun
- Alokasi JP per semester (Ganjil/Genap)
- Kalender Pendidikan ringkas
- Export ke **Word** (.docx) dan **Excel** (.xlsx)
- Simpan & kelola di dashboard dengan pagination

### Program Semester (Promes)
- Generate otomatis dari data **Prota** — tanpa input ulang
- Pilih semester (Ganjil/Genap) dan konfigurasi minggu efektif per bulan
- Tandai minggu **non-efektif** (STS, SAS, Libur)
- AI mendistribusikan JP secara otomatis ke minggu-minggu efektif
- Validasi otomatis: total JP Promes = total JP Prota
- Kolom **Aktivitas Utama** sebagai gambaran kegiatan pembelajaran
- Export ke **Word** (.docx) dan **Excel** (.xlsx)
- Penanganan sisa JP (cadangan/penguatan materi)
- Simpan & kelola di dashboard

### Manajemen Akun & Admin
- Login/Register dengan JWT
- Edit profil (nama, sekolah) di halaman Settings
- Ganti password
- **Admin dashboard**: kelola user, atur status subscription, toggle admin
- Dark mode / Light mode

### Pembayaran & Subscription
- Integrasi **Midtrans** payment gateway
- Paket gratis (1 generate/hari) dan premium (unlimited)

### UI/UX
- Sidebar responsif dengan navigasi per fitur
- Tampilan dark mode yang optimal
- Konfirmasi hapus modern (custom modal, bukan browser alert)
- Auto-fill nama guru & sekolah dari profil ke form generate
- Loading animation dengan tips bergulir

---

## Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Database** | PostgreSQL + Prisma ORM |
| **AI** | Mistral AI (`mistral-large-latest`) |
| **Styling** | Tailwind CSS v4 |
| **Auth** | JWT (jsonwebtoken) |
| **Payment** | Midtrans (sandbox) |
| **Export Docx** | `docx` library |
| **Export Xlsx** | `exceljs` library |
| **Icons** | Lucide React |

---

## Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Beranda |
| `/login` | Login |
| `/register` | Register |
| `/generate` | Generate RPP |
| `/generate-prota` | Generate Prota |
| `/generate-promes` | Generate Promes (dari data Prota) |
| `/dashboard` | Statistik dashboard |
| `/dashboard/rpp` | Daftar RPP |
| `/dashboard/prota` | Daftar Prota |
| `/dashboard/promes` | Daftar Promes |
| `/dashboard/[id]` | Detail RPP |
| `/dashboard-prota/[id]` | Detail Prota |
| `/dashboard/promes/[id]` | Detail Promes |
| `/settings` | Pengaturan profil & password |
| `/payment` | Subscription / upgrade |
| `/dashboard/user` | (Admin) Manajemen user |

---

## Environment Variables

```env
DATABASE_URL=
DIRECT_URL=
MISTRAL_API_KEY=
JWT_SECRET=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
npx prisma db push

# Seed curriculum data (Mata Pelajaran, Fase, CP)
npm run seed

# Seed admin user (email: admin@rpp-mendalam.id, password: adminRPP2024!)
npx tsx prisma/seed-admin.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Commands

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build production |
| `npm run start` | Jalankan production |
| `npm run lint` | ESLint check |
| `npm run db:push` | Update database schema |
| `npm run seed` | Seed data kurikulum |
| `npx tsx prisma/seed-admin.ts` | Seed admin user |

---

## Backup & Restore PostgreSQL

```bash
# Full backup (all databases + roles/globals) — requires superuser
pg_dumpall -U postgres -h localhost > full-backup-$(date +%Y%m%d).sql
sudo -u postgres pg_dumpall > full-backup-$(date +%Y%m%d).sql

# Restore full backup
psql -U postgres -h localhost -f full-backup-20250513.sql

# Full backup with compression
pg_dumpall -U postgres -h localhost | gzip > full-backup-$(date +%Y%m%d).sql.gz
gunzip -c full-backup-20250513.sql.gz | psql -U postgres -h localhost

# Database-only backup (no roles/globals, use if no superuser access)
pg_dump -U pedago -h localhost pedagodb > backup-$(date +%Y%m%d).sql

# Restore database-only backup
psql -U pedago -h localhost -d pedagodb < backup-20250513.sql
```

---

## Deployment with PM2 (Debian Server)

```bash
# Build production
npm run build

# Start with PM2
pm2 start npm --name "nextjs" -- start

# Restart
pm2 restart nextjs

# Stop
pm2 stop nextjs

# Save process list (so it restarts on server reboot)
pm2 save
pm2 startup

# Monitor logs
pm2 logs nextjs

# Monitor resources
pm2 monit

# List all processes
pm2 status
```

---

## Private Mode

Gratis: **1 generate RPP/Prota/Promes per hari** per akun.  
Premium: unlimited generate, akses semua fitur.
