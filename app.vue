<script setup lang="ts">
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;

useSeoMeta({
  ogUrl: `${siteUrl}/`,
  ogImage: `${siteUrl}/og-image.png`,
});
useHead({
  link: [{ rel: "canonical", href: `${siteUrl}/` }],
});
</script>

<template>
  <main style="font-family: system-ui; max-width: 640px; margin: 40px auto">
    <h1>Repro bug canonical/sitemap</h1>
    <p>
      Nilai <code>NUXT_PUBLIC_SITE_URL</code> sekarang:
      <strong>{{ siteUrl }}</strong>
    </p>
    <p>
      Coba view source (atau curl halaman ini), nanti keliatan
      <code>&lt;link rel="canonical"&gt;</code>, <code>og:url</code>, sama
      <code>og:image</code> semuanya ngikutin satu nilai itu doang. Cek juga
      <a href="/sitemap.xml">/sitemap.xml</a>, sama ceritanya.
    </p>
    <p>
      Kalau <code>NUXT_PUBLIC_SITE_URL</code> di-set ke domain yang ga ada di
      <code>NUXT_PUBLIC_ALLOWED_SITE_URLS</code>, build-nya bakal gagal duluan
      daripada keluar dengan tag yang salah.
    </p>
  </main>
</template>
