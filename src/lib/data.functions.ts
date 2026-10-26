import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq } from "drizzle-orm";

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb, schema } = await import("@/lib/db");
  const [row] = await getDb()
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, 1));
  return row ?? null;
});

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb, schema } = await import("@/lib/db");
  return getDb()
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.published, true))
    .orderBy(asc(schema.projects.sort_order));
});

export const getProject = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { getDb, schema } = await import("@/lib/db");
    const [row] = await getDb()
      .select()
      .from(schema.projects)
      .where(and(eq(schema.projects.slug, data.slug), eq(schema.projects.published, true)));
    return row ?? null;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb, schema } = await import("@/lib/db");
  return getDb()
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.status, "published"))
    .orderBy(desc(schema.posts.published_at));
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { getDb, schema } = await import("@/lib/db");
    const [row] = await getDb()
      .select()
      .from(schema.posts)
      .where(and(eq(schema.posts.slug, data.slug), eq(schema.posts.status, "published")));
    return row ?? null;
  });

export const getRequestOrigin = createServerFn({ method: "GET" }).handler(async () => {
  const configured = process.env["SITE_URL"];
  if (configured) return configured.replace(/\/$/, "");
  const { getRequest } = await import("@tanstack/react-start/server");
  const req = getRequest();
  const url = new URL(req.url);
  const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
});

export type { Project, Post, SiteSettings as PublicSettings } from "../../drizzle/schema";
