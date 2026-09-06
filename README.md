# 🍜 $MBG - Makan Bang Mining Telegram MiniApp

Sistem mining token $MBG yang terintegrasi dengan Telegram WebApp. Siap dideploy ke Vercel.

## ✨ Fitur Utama

- **⛏️ Mining System**: Mining berjalan selama 2 jam, menghasilkan 0.5 MBG per sesi
- **⚡ Boost Upgrade**: Tingkatkan kecepatan mining dengan 12 level upgrade
  - Level 1: 10 MBG
  - Level 2: 15 MBG
  - Level 3: 22.5 MBG
  - ... (kelipatan 1.5x)
  - Level 12: 864.98 MBG
- **🎬 Watch Ads**: Tonton iklan (maks 10x/24 jam WIB) untuk +0.1 MBG per iklan
  - *Integrasi Adsgram akan ditambahkan setelah miniapp jadi*
- **📅 Daily Check-in**: Klaim reward harian dengan sistem streak
- **🏆 Leaderboard**: Lihat peringkat mining pengguna lain
- **💼 Wallet**: Lihat saldo dan estimasi nilai USD
- **👤 Profile**: Menu profil dengan link "About Us" ke dokumentasi
- **💰 Funding Info**: Menampilkan total funding $1,000,000
- **💵 Token Price**: Estimasi harga $0.01 per MBG

## 🚀 Deploy ke Vercel

### Cara 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
cd mbg-miniapp
vercel --prod
```

### Cara 2: Import dari GitHub

1. Push project ini ke repository GitHub
2. Buka [vercel.com](https://vercel.com)
3. Klik "Add New Project"
4. Pilih repository Anda
5. Klik "Deploy" (konfigurasi default sudah cukup)

### Cara 3: Drag & Drop

1. Buka [vercel.com/new](https://vercel.com/new)
2. Drag & drop folder `mbg-miniapp` ke halaman tersebut

## 📁 Struktur Project

```
mbg-miniapp/
├── index.html              # Halaman utama
├── package.json            # Konfigurasi package
├── vercel.json             # Konfigurasi Vercel
├── README.md               # Dokumentasi ini
├── .gitignore              # Git ignore rules
├── asset/
│   ├── logoMbg.svg         # Logo MBG (SVG)
│   └── logoMbg.png         # ⚠️ Ganti dengan logo asli Anda
├── css/
│   └── style.css           # Stylesheet utama
└── js/
    └── app.js              # Logika aplikasi utama
```

## ⚙️ Konfigurasi

### Mengganti Logo

1. Siapkan logo Anda dengan nama `logoMbg.png`
2. Letakkan di folder `asset/`
3. Pastikan ukuran minimal 512x512 piksel

### Integrasi Adsgram

Setelah miniapp siap dan terverifikasi oleh Telegram:

1. Daftar di [Adsgram](https://adsgram.ai/)
2. Dapatkan kode integrasi
3. Modifikasi fungsi `watchAd()` di `js/app.js`
4. Ganti simulasi iklan dengan kode Adsgram asli

### Telegram Bot Setup

1. Buat bot baru di [@BotFather](https://t.me/BotFather)
2. Gunakan perintah `/newapp` untuk membuat WebApp
3. Masukkan URL Vercel deployment Anda
4. Bot siap digunakan!

## 🛠️ Development Lokal

```bash
# Masuk ke folder project
cd mbg-miniapp

# Jalankan server lokal
python3 -m http.server 3000

# Buka di browser
# http://localhost:3000
```

## 📱 Telegram WebApp Testing

Untuk testing di Telegram:

1. Deploy ke Vercel terlebih dahulu
2. Setup WebApp di BotFather
3. Buka bot Telegram Anda
4. Klik tombol WebApp yang sudah disetup

## 🔗 Link Penting

- **About Us / Dokumentasi**: https://mbgdocs.vercel.app/
- **Telegram WebApp SDK**: https://core.telegram.org/bots/webapps
- **Vercel Documentation**: https://vercel.com/docs
- **Adsgram**: https://adsgram.ai/ (untuk integrasi iklan nanti)

## 📊 Sistem Ekonomi Token

| Parameter | Nilai |
|-----------|-------|
| Reward Mining (2 jam) | 0.5 MBG |
| Reward per Iklan | 0.1 MBG |
| Maks Iklan/Hari | 10 |
| Harga Estimasi | $0.01 / MBG |
| Total Funding | $1,000,000 |
| Boost Multiplier | +0.5x per level |
| Max Boost Level | 12 |

## 🤝 Kontribusi

Project ini dikembangkan untuk komunitas $MBG. Silakan berkontribusi!

---

**Dibuat dengan ❤️ untuk komunitas Makan Bang**

*$MBG - Token Masa Depan yang Lezat* 🍜
