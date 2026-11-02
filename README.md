
# Roti Teh Sari - Landing Page Toko Roti Premium
## Order via WhatsApp + Keranjang + Status Ready/Habis

**Demo Live:** https://landing-page-roti-teh-sari.vercel.app
**Tech Stack:** TanStack Start (React) + Tailwind CSS + TypeScript + Lucide Icons

### Fitur Lengkap
- Hero section dengan branding roti rumahan
- Katalog produk dengan badge Ready / Habis Hari Ini
- Bottom Sheet detail produk + stepper jumlah
- Keranjang belanja slide
- Checkout: Nama, No WA (validasi), Kecamatan, Alamat, Catatan
- Metode: Ambil di Toko / Antar GoSend (ongkir otomatis)
- Total + Subtotal + Ongkir otomatis
- Simulasi pembayaran QRIS + handling gagal bayar
- Halaman sukses + tombol WA otomatis dengan format pesan:
  "Halo Teh Sari, saya ... sudah bayar pesanan #Roti123"
- Testimoni pelanggan
- Map lokasi + jam buka

### Cara Edit Super Gampang (Tanpa Ngoding Banyak)
Semua data toko ada di 1 file: `src/lib/roti-data.ts` atau `src/lib/roti-data.tsx`

Cari file tersebut dan edit:
```ts
export const WA_NUMBER = "628xxxxxxxxxx" // ganti no WA kamu
export const ONGKIR_GOSEND = 12000
export const PRODUCTS = [
  { id: "donat-coklat", name: "Donat Coklat", price: 15000, ready: true, ... },
]
export const KECAMATAN = ["Antapani", "Cikutra", ...]
```

Ganti gambar di folder `src/assets/`

### Cara Install & Jalanin Lokal
```bash
npm install
npm run dev
```
Buka http://localhost:3000

### Cara Deploy Gratis ke Vercel (2 menit)
1. Push ke GitHub
2. Login vercel.com -> Add New Project -> Import repo kamu
3. Deploy -> Jadi! Dapat domain .vercel.app gratis

### Struktur File Penting untuk Pembeli
- `src/routes/index.tsx` -> Halaman utama (jangan dihapus)
- `src/routes/__root.tsx` -> Layout & SEO
- `src/lib/roti-data.ts` -> DATA TOKO (edit di sini)
- `src/assets/` -> Gambar hero & map

### Lisensi
Personal Use. Boleh dipakai untuk 1 toko / 1 client. Dilarang menjual ulang source code mentah di Lynk.id / marketplace lain. Boleh dipakai untuk jasa pembuatan website client.

### Support
Hubungi penjual via WhatsApp di Lynk.id setelah pembelian.

---
Dibuat oleh Mahasiswa Teknik Informatika - Bandung
