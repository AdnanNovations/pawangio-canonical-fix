export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;

  const routes = ["/", "/courses", "/tracks", "/playground"];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  setHeader(event, "content-type", "application/xml");
  return body;
});
