import { createFileRoute } from "@tanstack/react-router";
import { getRequestOrigin } from "@/lib/data.functions";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const origin = await getRequestOrigin();
        return new Response(
          `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`,
          {
            headers: { "Content-Type": "text/plain" },
          },
        );
      },
    },
  },
});
