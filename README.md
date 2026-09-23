# bonus-canonical-fix

Demo kecil pakai Nuxt 3 buat nunjukin akar masalah dari temuan canonical/sitemap salah domain di pawang.io, sekalian kasih contoh perbaikannya.

## Apa yang salah di pawang.io

`canonical`, `og:url`, `og:image`, sama tiap `<loc>` di `sitemap.xml` itu semuanya ngambil dari satu env var doang: `NUXT_PUBLIC_SITE_URL`. Di pawang.io nilainya kesisa `pawang.ai` (domain lama yang udah ga aktif), padahal situsnya sendiri jalan di `pawang.io`. Ga ada satu pun pengecekan yang misahin "nilai yang di-set" sama "domain yang beneran hidup", jadi kesalahan kayak gini bisa lolos ke production tanpa ketahuan.

## Validasi yang saya tambahin

Di `nuxt.config.ts`, ada hook `build:before` yang jalan sebelum Nuxt mulai build apa pun. Dia bandingin `NUXT_PUBLIC_SITE_URL` sama daftar domain yang emang udah dikonfirmasi hidup (`NUXT_PUBLIC_ALLOWED_SITE_URLS`, dipisah koma). Kalau nilainya ga ada di daftar itu, build langsung di-throw error dan berhenti total, ga lanjut ngerender apa-apa.

Jadi bukan cuma "kasih tau ada yang salah", tapi build-nya sendiri yang gagal duluan, sebelum sempet nge-generate satu pun tag atau file yang salah. Ga ada cara buat kelewat validasi ini terus tetep dapet build yang jadi.

## Coba sendiri

```bash
npm install
cp env.example .env
```

### Skenario gagal (nilai salah)

```bash
NUXT_PUBLIC_SITE_URL=https://pawang.ai NUXT_PUBLIC_ALLOWED_SITE_URLS=https://pawang.io npm run build
```

Build bakal berhenti dengan error kayak gini, dan folder `.output` ga sempet kebuat sama sekali:

```
ERROR [site-url-guard] NUXT_PUBLIC_SITE_URL="https://pawang.ai" is not in the allowed list (https://pawang.io). Refusing to build.
```

### Skenario berhasil (nilai bener)

```bash
NUXT_PUBLIC_SITE_URL=https://pawang.io NUXT_PUBLIC_ALLOWED_SITE_URLS=https://pawang.io npm run build
npm run preview
```

Buka `http://localhost:3000`, terus curl:

```bash
curl -s http://localhost:3000/ | grep -oE '<link rel="canonical"[^>]*>|<meta property="og:(url|image)"[^>]*>'
curl -s http://localhost:3000/sitemap.xml
```

Semuanya bakal nunjuk ke `pawang.io`, bukan `pawang.ai`.

## Kenapa ini beneran bisa bantu pawang.io ke depannya

Kalau nanti pawang.io migrasi domain lagi, atau pindah dari staging ke production, tinggal update `NUXT_PUBLIC_ALLOWED_SITE_URLS` bareng sama `NUXT_PUBLIC_SITE_URL`. Kalau ada yang lupa update salah satunya, atau salah ketik, build-nya bakal gagal di CI/CD sebelum sempet ke-deploy, bukan ketauan belakangan pas Google udah kepalang crawl domain yang salah atau link yang di-share ke grup WhatsApp udah kepalang nyebar tanpa preview gambar. Intinya: kesalahan yang tadinya baru ketauan lewat audit manual kayak yang saya lakuin ini, sekarang ketauan otomatis di tahap build, jauh sebelum nyampe ke user.
