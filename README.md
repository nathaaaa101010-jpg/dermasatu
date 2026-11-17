# DERMA-SATU

**Satu Rantai Keputusan Antibiotik Bijak untuk Kulit Anjing**

DERMA-SATU adalah prototipe aplikasi web interaktif berbasis klien (*client-side dummy data*, tanpa backend) untuk memvisualisasikan model *closed-loop veterinary dermatology stewardship* pada kasus pioderma superfisial anjing.

> **Disclaimer:** Prototipe konsep untuk keperluan lomba esai/inovasi. Bukan alat diagnosis klinis atau peresepan. Keputusan klinis tetap berada pada dokter hewan. Kelayakan dan dampak DERMA-SATU masih perlu diuji.

## Cara Menjalankan Secara Lokal

1. Pastikan Node.js (>= 18) terpasang.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:3000` di peramban.

## Build & Deploy ke Vercel

```bash
npm run build
```

File `vercel.json` sudah dikonfigurasi untuk SPA routing (`/` dan `/dashboard`), sehingga proyek dapat langsung di-deploy ke Vercel melalui Git atau `vercel --prod`.

## Cara Mengganti Data Dummy

Seluruh data simulasi terpusat di folder `/src/data`:

- `src/data/literatureData.ts`: Angka epidemiologi dan sitasi literatur ilmiah yang tampil di halaman beranda.
- `src/data/mockData.ts`: Data simulasi kasus pasien, antibiogram regional, log resep, KPI klinik, antrean voucher, jadwal terapi, antrean sinkronisasi offline, laporan penyimpangan, persetujuan, pengguna, serta log audit awal.

Cukup ubah array atau objek di kedua file tersebut tanpa perlu mengubah logika komponen di `/src/modules` atau `/src/pages`.
