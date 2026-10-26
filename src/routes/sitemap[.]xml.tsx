import { createFileRoute } from "@tanstack/react-router";
import { SERVICES } from "@/lib/services";
import { getRequestOrigin, listPosts, listProjects } from "@/lib/data.functions";

const STATIC = [
  "/",
  "/services",
  "/work",
  "/about",
  "/process",
  "/insights",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/website-development-company-ahmedabad",
  "/flutter-app-development-ahmedabad",
  "/ecommerce-website-development-ahmedabad",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [origin, projects, posts] = await Promise.all([
          getRequestOrigin(),
          listProjects(),
          listPosts(),
        ]);
        const urls = [
          ...STATIC.map((p) => ({ loc: p })),
          ...SERVICES.map((s) => ({ loc: `/services/${s.slug}` })),
          ...projects.map((p) => ({ loc: `/work/${p.slug}`, lastmod: p.updated_at })),
          ...posts.map((p) => ({ loc: `/insights/${p.slug}`, lastmod: p.updated_at })),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map(
            (u) =>
              `  <url><loc>${origin}${u.loc}</loc>${"lastmod" in u && u.lastmod ? `<lastmod>${String(u.lastmod).slice(0, 10)}</lastmod>` : ""}</url>`,
          )
          .join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
