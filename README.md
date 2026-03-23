# 🍔 Aplikasi Self-Ordering Restoran (Desktop & Mobile)

Aplikasi pemesanan makanan layaknya aplikasi populer khusus meja restoran, di mana pelanggan bisa langsung melihat katalog digital, memilih menu, keranjang, dan melakukan pembayaran instan secara mandiri melalui *smartphone* mereka tanpa perlu memanggil pelayan.

## 🔥 Fitur Unggulan
- **UI/UX Premium (Desain Ala ShopeeFood)**: Bersih, elegan, responsif (`Mobile-First`), dominan putih dengan aksen warna "Oranye Cerah" yang menggugah selera.
- **Keranjang Reaktif (Zustand)**: Pilihan menu dan perhitungan harga langsung difilter tanpa ada proses memuat ulang *(loading/refresh)* halaman.
- **Integrasi Pembayaran "White-Label" (Midtrans Core API)**:
  - Pelanggan tidak akan dilempar ke situs web bank / Midtrans (Tanpa Pop-Up/Snap iframe).
  - Melayani pembayaran **GoPay, DANA, OVO**, **QRIS (Otomatis)**, dan **Transfer Virtual Account**.
  - **Tampilan Sendiri (Native UX)**: QR Code dari dompet digital langsung digambar *(rendered)* menyatu ke dalam desain resi/struk digital (E-Receipt) buatan kita sendiri.

## 💻 Teknologi yang Digunakan
- **Framework Utama**: [Next.js (App Router)](https://nextjs.org/)
- **Desain & Styling**: Tailwind CSS, CSS Modules
- **State Management**: Zustand
- **Komponen Ekstra**: Shadcn UI (Radix), Lucide React Icons
- **Payment Gateway**: Midtrans (Jalur Core API / REST Fetch)

---

## 🚀 Panduan Instalasi (Mulai dari Nol)

Ikuti langkah-langkah di bawah ini untuk menghidupkan proyek ini di komputer lokal Anda:

### 1. Persiapan Awal Sistem
Pastikan Anda sudah menginstal **Node.js** (Direkomendasikan versi 18 ke atas / LTS) di komputer Anda. Anda dapat mengeceknya dengan mengetik `node -v` dan `npm -v` di Terminal.

### 2. Buka Folder Proyek
Buka VS Code atau Terminal pilihan Anda, dan pastikan Anda sudah berada di dalam folder proyek ini:
```bash
cd resto-order-app
```

### 3. Instalasi `node_modules` (NPM Install)
Karena folder `node_modules` biasanya tidak diikutkan saat memindahkan *file*, Anda wajib mengunduh paket pendukung pihak ketiganya secara otomatis:
```bash
npm install
```
*(Tunggu beberapa saat hingga proses pengunduhan framework Tailwind, Next.js, Zustand, dll selesai 100%).*

### 4. Konfigurasi Kunci Pembayaran (Environment Midtrans)
Agar fitur *Checkout* & QRIS bisa menyala:
1. Cari berkas bernama `.env.example` di dalam folder utama proyek.
2. Silakan *Copy & Paste* atau Ubah Nama *(Rename)* file tersebut menjadi **`.env.local`**.
3. Buka file `.env.local`, lalu isi dengan *Server Key* milik Anda yang didapatkan dari Dasbor Midtrans:

```env
# Dapat dari Dashboard Midtrans -> Settings -> Access Keys
MIDTRANS_SERVER_KEY=SB-Mid-server-KODE_ANDA_DISINI
MIDTRANS_CLIENT_KEY=SB-Mid-client-KODE_ANDA_DISINI

# Ganti menjadi true jika sudah menggunakan API Key live/asli
MIDTRANS_IS_PRODUCTION=false

# Sesuaikan dengan domain website Anda nanti
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Jalankan Server Pengembangan (Dev Server)
Apabila paket NPM sudah terinstal dan file rahasia `.env.local` sudah dibuat beserta isinya, ketik perintah pamungkas ini:
```bash
npm run dev
```

### 6. Uji Coba Transaksi
Tunggu sekitar 1 detik, lalu buka *browser* Anda dan ketikkan alamat berikut di kolom URL Pencarian:
👉 **[http://localhost:3000](http://localhost:3000)**

Selamat, Restoran Digital Anda dan fitur QRIS Native Canggihnya siap digunakan dan dioprek lebih lanjut! 🎉
