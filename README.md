# RuangKampus

Aplikasi web untuk pencarian, pemesanan, persetujuan, pembayaran, dan pelaporan penyewaan ruang kampus.

## Teknologi

- Next.js App Router, React, TypeScript, dan Tailwind CSS
- PostgreSQL dan Prisma ORM
- NextAuth Credentials dengan password bcrypt
- Zod untuk validasi data
- jsPDF dan fflate untuk ekspor laporan PDF dan Excel

## Menggunakan Neon

Project memakai PostgreSQL melalui Prisma dan dapat diarahkan ke Neon tanpa mengganti model database atau query aplikasi.

1. Buat project/database PostgreSQL baru di [Neon](https://neon.tech/).
2. Dari halaman koneksi Neon, salin connection string PostgreSQL **direct (non-pooled)** untuk database tujuan. Connection string berisi host, database, port, username, password, dan `sslmode=require`.
3. Jika ingin mulai memakai Neon tanpa menyalin data lokal, isi `DATABASE_URL` di `.env` dengan connection string Neon:

   ```env
   DATABASE_URL="PASTE_NEON_DIRECT_CONNECTION_STRING_HERE"
   ```

   Simpan URL hanya di `.env` lokal—jangan menempelkannya ke chat, commit, atau membagikannya. Setelah memastikan database Neon belum berisi data penting, siapkan skema dan data demo:

   ```bash
   npm run db:generate
   npm run db:push
   npm run seed
   ```

4. Jika ingin mempertahankan data lokal, gunakan migrasi terpisah. Pertahankan URL PostgreSQL lokal sebagai `DATABASE_URL` (sumber) dan tambahkan URL Neon sebagai `NEON_DATABASE_URL` (tujuan):

   ```bash
   npx tsx scripts/migrate-to-neon.ts
   ```

   Skrip meminta konfirmasi `MIGRATE`, membuat skema, dan menyalin data dengan ID yang sama. PostgreSQL lokal tidak diubah. Setelah migrasi terverifikasi, ubah `DATABASE_URL` menjadi URL Neon. Jangan jalankan `npm run seed` setelah menyalin data.
5. Untuk melihat Neon lewat DBeaver, buat koneksi **PostgreSQL** memakai host, database, port, username, dan password dari URL Neon. Aktifkan SSL dengan mode `require`, tes koneksi, lalu buka **Schemas → public → Tables**.
6. File unggahan di `public/uploads` tidak termasuk database; pindahkan file tersebut secara terpisah jika dibutuhkan. Untuk development lokal, biarkan `NEXTAUTH_URL` mengarah ke `http://localhost:3000` dan pertahankan `NEXTAUTH_SECRET` yang sama setiap kali menjalankan aplikasi.

## Menjalankan aplikasi dengan PostgreSQL lokal

1. Gunakan Node.js 20.9 atau yang lebih baru dan siapkan server PostgreSQL.
2. DBeaver adalah aplikasi klien untuk mengelola PostgreSQL, bukan pengganti PostgreSQL. Di DBeaver, buat koneksi **PostgreSQL** ke server Anda (umumnya host `localhost`, port `5432`). Hubungkan ke database bawaan `postgres`, lalu jalankan:

   ```sql
   CREATE DATABASE ruang_kampus;
   ```

   Jika database sudah ada, langkah ini dapat dilewati. Muat ulang koneksi dan pastikan `ruang_kampus` muncul.
3. Salin `.env.example` menjadi `.env`. Atur `DATABASE_URL` dengan host, port, nama pengguna, kata sandi, dan database yang sama seperti koneksi DBeaver, misalnya:

   ```env
   DATABASE_URL="postgresql://postgres:KATA_SANDI@localhost:5432/ruang_kampus?schema=public"
   ```

   Ganti `postgres` dan `KATA_SANDI` sesuai konfigurasi PostgreSQL Anda; isi `NEXTAUTH_SECRET` dengan nilai acak yang panjang. Jangan gunakan tanda kutip atau karakter khusus pada kata sandi tanpa URL-encoding. Pertahankan nilai `NEXTAUTH_SECRET` yang sama setiap kali menjalankan aplikasi. Jika nilainya berubah, hapus cookie situs `localhost` di browser lalu masuk kembali.
   Di development, aplikasi memakai cookie sesi khusus `localhost` agar sesi lama tidak bentrok; masuk kembali setelah server dimulai ulang dengan konfigurasi ini.
4. Pasang dependensi dan siapkan skema serta data demo:

   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run seed
   npm run dev
   ```

5. Buka `http://localhost:3000`.

## Akun demo

Kedua akun menggunakan kata sandi `password123`.

| Peran | Email |
|---|---|
| Penyewa | `rina.putri@mhs.unugiri.ac.id` |
| Petugas | `budi.santoso@unugiri.ac.id` |

## Alur utama

- Penyewa mencari ruangan, mengisi formulir berdasarkan kepentingan, dan mengirim pengajuan.
- Server memvalidasi kapasitas, dokumen wajib, tarif, serta bentrok jadwal dengan pemesanan yang telah disetujui atau terkonfirmasi.
- Petugas menyetujui atau menolak pengajuan dengan alasan.
- Penyewa mengunggah bukti transfer setelah disetujui; petugas memeriksa nominal dan bukti sebelum konfirmasi.
- Petugas mengelola ruangan dan pengguna, serta mengekspor laporan PDF atau Excel.

Unggahan disimpan pada `public/uploads`. Untuk produksi, gunakan object storage persisten dan layanan email/SMTP yang dikonfigurasi untuk notifikasi keluar.
