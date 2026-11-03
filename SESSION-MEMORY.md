# Session memory: portfolio danielaugustian

Catatan serah terima untuk Claude yang melanjutkan pekerjaan ini. Baca sampai habis sebelum mengubah apa pun, lalu cocokkan dengan `git status` dan `git log`, karena catatan ini ditulis pada 3 November 2026.

## Tujuan

Pemilik ingin situs portofolio pribadi dengan layout dan animasi sama seperti https://mobius.framer.website/, ditulis ulang dengan kode sendiri. Isinya diganti konten pemilik secara bertahap.

## Cara kerja dengan pemilik

- Selalu pakai Bahasa Indonesia yang santai dan jelas.
- Commit dan push hanya kalau diminta. Biasanya pemilik bilang "Commit dan push".
- Kalau pemilik membandingkan dengan web asli, ukur web aslinya dulu, jangan menebak. Beberapa koreksi muncul karena tebakan awal saya tidak sama dengan aslinya.
- Laporkan apa adanya: apa yang sudah dicek, apa yang belum, dan koreksi kalau diagnosis sebelumnya ternyata salah.
- Kalau ada keputusan di luar permintaan, sebutkan terang-terangan di laporan.

## Teknologi

- Astro 7 (situs statis), GSAP 3 + ScrollTrigger, Lenis, `@fontsource-variable/inter`, sharp (dev).
- Perintah: `npm run dev`, `npm run build`, `npm run preview`.
- Repo: https://github.com/danielaugustian67/me.git, branch `portfolio-site`. Belum ada branch `main`. `gh` CLI tidak terpasang.
- `astro check` belum bisa dipakai: paket pendukungnya belum terpasang dan perintah itu menanyakan instalasi. Verifikasi pakai `astro build` dan tes browser.

## Kondisi saat ini

Commit terakhir yang sudah di-push:

```
c1ed529 Remove the pricing and clients sections
d173863 Match the hero entrance and add the custom cursor
2bc2bee Add my name and portrait to the site
593aff5 Match the hero to the original and add dark mode
0761da2 Add portfolio site with placeholder content
```

**Belum di-commit** saat catatan ini ditulis:

- `src/scripts/main.ts` dan `src/styles/global.css`: perbaikan bagan Process.
  - Batang kini terbuka dengan `clip-path`, bukan `scaleX`, supaya teks tidak gepeng saat animasi.
  - Di ponsel teks batang boleh turun baris (`white-space: normal`, padding 6px), karena di 320px "Launch & Care" meluber 10px.
  - Sudah dicek di 320, 375, 1024, dan 1440px tanpa error JS.
- `SESSION-MEMORY.md`: file ini. Tanyakan ke pemilik apakah file ini mau ikut di-commit.

## Struktur penting

- `src/data/site.ts`: **semua konten situs ada di sini** (`site`, `home`, `about`, proyek, catatan, dan lainnya).
- `src/pages/`: `index`, `about`, `contact`, `404`, `work/`, `notes/`, `legal/`.
- `src/components/`: `Chrome` (header dan menu), `Footer`, `Pill`, `TextLink`, `Roll`, `Arrow`, `TalkForm`.
- `src/layouts/Base.astro`: kerangka halaman, skrip tema sebelum paint, elemen `.cursor`.
- `src/scripts/main.ts`: semua animasi. `pan.ts`: galeri geser di `/work` dan `/notes`. `forms.ts`: form.
- `src/styles/global.css`: seluruh CSS.
- `scripts/make-placeholders.mjs`: pembuat gambar placeholder. Menjalankannya mengubah gambar lain karena seed berbasis indeks, jadi kembalikan yang tidak terkait dengan `git restore`.
- `scripts/make-portrait.mjs`: memotong foto dari latar hitam dan menempelkannya di kartu.

## Keputusan desain yang sudah final

**Breakpoint:** ponsel <810px, tablet 810 sampai 1199px, desktop ≥1200px. Gutter `--g`: 40, 30, 20px.

**Tema:** token warna `--bg`, `--fg`, `--ink`, `--logo`, `--muted`, `--faint`, `--ghost`, `--field`, diganti lewat `:root[data-theme='dark']`. `.chrome` tetap `color:#fff` dengan `mix-blend-mode: difference`.

**Nama panjang:** "danielaugustian" tidak muat di judul besar, jadi dipakai `.name-box` + `.name-fit` (container query) dan `fitText()` di `main.ts`.

**Foto (`make-portrait.mjs`):**

- Kartu hero berwarna pasir (`#ddcfb6` ke `#c2b091`), dipilih pemilik setelah oranye terasa kurang cocok.
- Kartu About Me pertama abu-biru (`#7d8fa0` ke `#566675`).
- `PERSON_HEIGHT = 900`, `PERSON_TOP = 190`, `OPACITY = 0.5`. Pemilik minta seluruh badan pudar merata, bukan hanya kaki.
- Foto sumber tidak ada di repo. Salinan terakhir ada di `/private/tmp/claude-501/-Users-mac-Documents-My-Project-me/437976cc-9741-4dad-b4a1-d9028efc944d/images/1.png`. Folder itu sementara, jadi kalau sudah hilang, minta fotonya lagi ke pemilik. Hasilnya sudah ada di `public/img/portrait.webp` dan `portrait-about.webp`.

**Hero (hasil ukur dari web asli):**

- 4 kartu, di 1440×900 berukuran 450×600 (tinggi 66,67vh).
- Kemiringan diam -5°, -20°, -10°, 5°. Saat hover 0°, -30°, -15°, 15° (`power2.out`, 0,75 detik).
- Urutan masuk: judul dulu, lalu pada detik ke-1 kartu naik dari `y: 100vh` dengan jeda 0,1 detik per kartu (`power3.out`, 1,1 detik). Kemiringan tetap dan tidak ada perubahan skala.
- Teks perkenalan dan tahun terbuka dengan `clip-path` dari atas ke bawah.
- Teks hero disembunyikan lewat `.js` sampai animasi siap, supaya tidak berkedip saat dimuat.
- Area klik `.hero__link` mengarah ke `/work`. Ukurannya sama dengan aslinya di 1440px (450×563) dan 1024px (281×351).

**Kursor (`initCursor`, hasil ukur dari web asli):**

- Titik 20px mengikuti mouse dengan lerp 0,1 per frame.
- Di link dan kontrol (`a, button, input, textarea, select`) mengecil ke 2px.
- Di elemen `data-cursor="arrow"` membesar ke 120px dengan panah 32px (`power2.out`, 0,45 detik).
- Warnanya `--fg`, panahnya `--bg`.
- Tidak aktif di perangkat sentuh dan saat `prefers-reduced-motion`.
- `data-cursor="arrow"` ada di kartu hero, kartu About Me, gambar kartu Notes, kartu proyek `/work`, dan link Next Project. Yang terakhir pilihan sendiri, belum diukur dari aslinya dan belum dites.
- Kursor **Play** dan **Drag** di web asli sengaja tidak dipasang, karena situs ini belum punya video atau deretan gambar yang bisa digeser. Ikonnya bisa diambil dari web asli kalau elemen itu nanti ada.

**Section yang dihapus atas permintaan pemilik:** Pricing dan Selected Clients. Jangan dikembalikan.

**Teks abu sangat pucat** (`/1`, tahun proyek): kontrasnya rendah, tapi sama dengan web asli. Saya pernah menawarkan untuk menggelapkannya dan belum dijawab.

## Yang masih perlu dikerjakan

Konten yang masih placeholder, menunggu dikirim pemilik:

- Bahasa situs (Indonesia atau Inggris) belum dijawab. Saat ini teksnya Inggris.
- Teks perkenalan, bio, peran, layanan, dan tahun.
- Proyek di `/work`, statistik In Numbers (termasuk "42 Happy Clients"), penghargaan, dan testimoni.
- Catatan di `/notes` dan FAQ.
- Email, telepon, alamat, media sosial, dan `formEndpoint`.
- Pilihan budget di form kontak.
- Gambar kartu kedua di About Me (`about-2`) dan gambar placeholder lainnya.
- Halaman legal.

Pemeriksaan yang belum dilakukan: Safari, ponsel asli, mode tanpa JavaScript, panah di link Next Project, dan gerakan masuk hero di ponsel.

## Cara memverifikasi

- Panel browser bawaan berhenti menjalankan animasi saat tersembunyi, jadi tangkapan layarnya bisa basi. Pakai Chrome headless dengan `puppeteer-core` yang dipasang di folder sementara, jangan di proyek.
- Jalankan `npx astro build`, lalu `npx astro preview --port 4399`, dan hentikan server-nya setelah selesai.
- Gulir bertahap sebelum mengambil tangkapan layar, karena animasinya terikat scroll. Hati-hati, animasi yang tertangkap di tengah bisa terlihat seperti bug.
- Selalu cek error JS dan lebar halaman (`scrollWidth - innerWidth` harus 0) di 320, 375, 1024, dan 1440px, terang dan gelap.
- Di zsh, kutip pola glob seperti `'--include=*.astro'`, karena pola tanpa kecocokan membatalkan seluruh perintah.
- Skrip sharp sementara harus berada di dalam proyek (misalnya `node_modules/.x.mjs`, lalu dihapus) supaya sharp bisa ditemukan.

## Format commit

Pesan commit dalam bahasa Inggris, baris pertama berupa kalimat perintah, misalnya "Remove the pricing and clients sections". Tambahkan baris attribution sesuai aturan akun yang sedang dipakai.
