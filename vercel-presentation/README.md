# SRB Motor - Panduan Presentasi Arsitektur MVC (Vercel Deployment)

Folder ini berisi berkas panduan presentasi interaktif SRB Motor yang siap di-hosting ke Vercel agar dapat diakses oleh dosen dan teman-teman sekelas melalui link publik.

## Berkas di dalam Folder:
- `index.html`: Panduan presentasi interaktif (salinan dari `docs/penjelasan_mvc_sistem.html`).

## Cara Hosting ke Vercel:

### Opsi 1: Menggunakan Vercel CLI (Sangat Cepat)
1. Buka terminal (CMD / PowerShell / Bash) di dalam folder `vercel-presentation/` ini.
2. Jalankan perintah:
   ```bash
   npm i -g vercel
   ```
3. Setelah terpasang, jalankan perintah ini untuk deploy:
   ```bash
   vercel
   ```
4. Ikuti panduan di terminal (tekan Enter untuk pilihan default). Vercel akan memberikan link deployment publik instan.

### Opsi 2: Menggunakan GitHub & Vercel Dashboard
1. Buat repositori GitHub baru (misalnya diberi nama `srb-motor-mvc-presentation`).
2. Masukkan berkas `index.html` ini ke dalam repositori tersebut.
3. Buka dashboard [Vercel](https://vercel.com).
4. Klik **Add New** -> **Project**.
5. Impor repositori GitHub tersebut.
6. Klik **Deploy**. Selesai!
