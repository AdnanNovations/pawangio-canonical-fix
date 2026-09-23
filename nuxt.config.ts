export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  },

  hooks: {
    // Fails the build if siteUrl isn't in the allowlist, instead of silently
    // baking a wrong domain into canonical/og/sitemap tags.
    "build:before": () => {
      const siteUrl = process.env.NUXT_PUBLIC_SITE_URL;
      const allowlist = (process.env.NUXT_PUBLIC_ALLOWED_SITE_URLS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (allowlist.length && siteUrl && !allowlist.includes(siteUrl)) {
        throw new Error(
          `[site-url-guard] NUXT_PUBLIC_SITE_URL="${siteUrl}" is not in the allowed list (${allowlist.join(", ")}). Refusing to build.`
        );
      }
    },
  },
});
