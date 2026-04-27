# Generator RPP & Program Tahunan Pembelajaran Mendalam

Generator RPP (Rencana Pembelajaran Pembelajaran) dan Prota (Program Tahunan) berbasis AI sesuai format resmi Kemendikdasmen Indonesia.

## Fitur

### RPP (Rencana Pembelajaran Pembelajaran)
- Generate RPP otomatis via AI Mistral
- Format resmi Kemendikdasmen Indonesia
- Pembelajaran Mendalam (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)
- Integrasi 8 Dimensi Profil Pelajar Pancasila
- 7 Bagian RPP:
  - A. Karakteristik Pembelajaran
  - B. Desain Pembelajaran (Tujuan Pembelajaran, Kriteria Pencapaian TP)
  - C. Pengalaman Belajar (Awal, Inti, Penutup)
  - D. Asesmen Pembelajaran (Awal, Formatif, Sumatif)
  - E. Glosarium (istilah dan definisi)
  - F. Pertanyaan Refleksi Guru
  - G. Lembar Kerja Peserta Didik
- Export ke Word dengan nomor yang benar (tidak ada duplikasi)
- Lembar Kerja Peserta Didik

### Program Tahunan (Prota)
- Generate Program Tahunan otomatis via AI
- Distribusi CP ke alur pembelajaran mingguan
- Rekapitulasi total jam dan distribusi topik
- Export ke Word/PDF
- Kelola di dashboard

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma
- **AI**: Mistral AI
- **Styling**: Tailwind CSS v4
- **Auth**: JWT
- **Payment**: Midtrans

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
npx prisma db push

# Seed data curriculum (Mata Pelajaran, Fase, CP)
npm run seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

|Route|Description|
|-----|-------------|
|`/`|Home|
|`/generate`|Generate RPP|
|`/generate-prota`|Generate Prota|
|`/dashboard`|Dashboard RPP|
|`/dashboard-prota`|Dashboard Prota|
|`/login`|Login|
|`/register`|Register|
|`/payment`|Subscription|
|`/admin/mata-pelajaran`|Kelola Data Kurikulum|

## Environment Variables

```env
DATABASE_URL=
DIRECT_URL=
MISTRAL_API_KEY=
JWT_SECRET=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
```

## Commands

```bash
# Update database schema
npm run db:push

# Seed curriculum data
npm run seed
```