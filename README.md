# Generator RPP & Program Tahunan Pembelajaran Mendalam

Generator RPP (Rencana Pembelajaran Pembelajaran) dan Prota (Program Tahunan) berbasis AI sesuai format resmi Kemendikdasmen Indonesia.

## Fitur

### RPP (Rencana Pembelajaran Pembelajaran)
- Generate RPP otomatis via AI Mistral
- Format resmi Kemendikdasmen Indonesia
- Pembelajaran Mendalam (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)
- Integrasi 8 Dimensi Profil Pelajar Pancasila
- Asesmen AS, FOR, dan OF Learning
- Lembar Kerja Peserta Didik
- Export ke Word/HTML

### Program Tahunan (Prota)
- Generate Program Tahunan otomatis via AI
- Distribusi CP ke alur pembelajaran mingguan
- Rekapitulasi total jam dan distribusi topik
- Export ke HTML
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

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/generate` | Generate RPP |
| `/generate-prota` | Generate Prota |
| `/dashboard` | Dashboard RPP |
| `/dashboard-prota` | Dashboard Prota |
| `/login` | Login |
| `/register` | Register |
| `/payment` | Subscription |

## Environment Variables

```env
DATABASE_URL=
DIRECT_URL=
MISTRAL_API_KEY=
JWT_SECRET=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
```