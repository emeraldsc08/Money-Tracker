# Money Tracker

Aplikasi web untuk mencatat pemasukan dan pengeluaran harian, melihat laporan realtime, dan rekap bulanan. Dibangun dengan **Nuxt 4**, **Prisma**, dan **SQLite**.

## Fitur

### Transaksi

- **Tampilan harian** — fokus per hari dengan navigasi tanggal (← / →) dan filter URL yang bisa di-bookmark
- **Filter** — tipe (semua / masuk / keluar), sumber, dan tanggal (`?date=YYYY-MM-DD&type=INCOME&source=BCA`)
- **Ringkasan harian** — total masuk, keluar, dan saldo
- **CRUD** — tambah, edit, dan hapus transaksi (income & outcome)
- **Kategori & sumber custom** — searchable combobox dengan tambah/hapus item (disimpan di `localStorage`)

### Laporan

- **Realtime** — satu kartu terpadu dengan filter periode (hari ini / minggu / bulan / custom), filter distribusi (pemasukan/pengeluaran × sumber/kategori), dan grafik pie
- **Bulanan** — daftar rekap per bulan, breakdown kategori, tabel transaksi, **export CSV**

### UX

- **Dark mode** — toggle tema, preferensi tersimpan di `localStorage`
- **Responsif** — sidebar di desktop, bottom navigation di mobile
- **Format Rupiah** — semua nominal konsisten (`Rp 1.234.567`)
- **Timezone** — semua tanggal menggunakan **Asia/Jakarta**

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3) |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma 7 |
| Charts | Chart.js + vue-chartjs |
| Runtime | Node.js |

## Prasyarat

- **Node.js 20+**
- npm (atau pnpm / yarn / bun)

## Instalasi

```bash
git clone <repo-url>
cd money-tracker
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed   # opsional — data contoh
```

## Environment

| Variabel | Deskripsi | Default |
|----------|-----------|---------|
| `DATABASE_URL` | Path file SQLite | `file:./dev.db` |

Contoh `.env`:

```env
DATABASE_URL="file:./dev.db"
```

## Scripts

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Jalankan development server (`http://localhost:3000`) |
| `npm run build` | Build production |
| `npm run preview` | Preview build production |
| `npm run db:migrate` | Jalankan migrasi Prisma |
| `npm run db:seed` | Isi database dengan data contoh |
| `npm run db:studio` | Buka Prisma Studio (GUI database) |
| `npm run db:reset` | Reset database + migrasi ulang |

## Halaman

| Route | Deskripsi |
|-------|-----------|
| `/` | Redirect ke `/transactions` |
| `/transactions` | Daftar transaksi harian + filter |
| `/transactions/add` | Pilih tipe (income / outcome) |
| `/transactions/add/income` | Form tambah pemasukan |
| `/transactions/add/outcome` | Form tambah pengeluaran |
| `/transactions/:id/edit` | Edit / hapus transaksi |
| `/reports/realtime` | Laporan realtime + grafik |
| `/reports/monthly` | Daftar rekap bulanan |
| `/reports/monthly/:year/:month` | Detail bulan + export CSV |

## API

Semua response memakai envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Transaksi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/transactions` | List transaksi (query: `date`, `type`, `source`) |
| `POST` | `/api/transactions` | Buat transaksi |
| `GET` | `/api/transactions/:id` | Detail transaksi |
| `PUT` | `/api/transactions/:id` | Update transaksi |
| `DELETE` | `/api/transactions/:id` | Hapus transaksi |

### Laporan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/reports/realtime` | Laporan realtime (query: `from`, `to` ISO date) |
| `GET` | `/api/reports/monthly` | Daftar rekap bulanan |
| `GET` | `/api/reports/monthly/:year/:month` | Detail laporan bulan |

## Struktur Proyek

```
money-tracker/
├── app/
│   ├── components/       # UI components (transaction, report, ui)
│   ├── composables/      # useColorMode, useToast, kategori/sumber custom
│   ├── layouts/          # default layout (sidebar + bottom nav)
│   ├── middleware/       # default date untuk /transactions
│   ├── pages/            # Route pages
│   ├── plugins/          # color-mode init
│   └── utils/            # format, filters, CSV export, dll.
├── prisma/
│   ├── schema.prisma     # Model Transaction
│   ├── migrations/       # Migrasi database
│   └── seed.ts           # Data contoh
├── server/
│   ├── api/              # REST API handlers
│   └── utils/            # Validasi, serializer, laporan
└── shared/
    ├── constants/        # Kategori & sumber default
    ├── types/            # TypeScript types
    └── utils/            # Jakarta date, report period
```

## Demo ke Client (tanpa deploy)

Untuk membagikan app lokal ke client via internet:

```bash
# Terminal 1
npm run dev

# Terminal 2
cloudflared tunnel --url http://localhost:3000
```

Kirim URL `*.trycloudflare.com` yang muncul ke client. Konfigurasi `allowedHosts` untuk Cloudflare Tunnel sudah diset di `nuxt.config.ts`.

> **Catatan:** Database SQLite ada di laptop kamu. Client hanya melihat data lewat tunnel — laptop harus tetap nyala selama demo.

## Penyimpanan Lokal (Browser)

| Key | Isi |
|-----|-----|
| `money-tracker-color-mode` | `light` / `dark` |
| `money-tracker-custom-categories-income` | Kategori income custom (JSON) |
| `money-tracker-custom-categories-outcome` | Kategori outcome custom (JSON) |
| `money-tracker-custom-sources` | Sumber custom (JSON) |

## Kategori & Sumber Default

**Income:** Gaji, Freelance, Investasi, Lainnya

**Outcome:** Makan, Transport, Tagihan, Belanja, Hiburan, Lainnya

**Sumber:** Uang Tunai, BCA, Mandiri, BRI, OVO, GoPay

## Lisensi

Private project.
