import { createServerFn } from "@tanstack/react-start";
import { desc, eq, sql } from "drizzle-orm";

async function requireAdmin() {
  const { getCurrentAdmin } = await import("@/lib/auth/session");
  const user = await getCurrentAdmin();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  return user;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const getCurrentAdminUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getCurrentAdmin } = await import("@/lib/auth/session");
  const user = await getCurrentAdmin();
  return user ? { id: user.id, email: user.email, role: user.role } : null;
});

export const adminSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { getDb, schema } = await import("@/lib/db");
    const { verifyPassword } = await import("@/lib/auth/password");
    const { createSession } = await import("@/lib/auth/session");
    const [user] = await getDb()
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, data.email.trim().toLowerCase()));
    if (!user || !(await verifyPassword(data.password, user.password_hash))) {
      throw new Error("Invalid email or password");
    }
    if (user.role !== "admin") throw new Error("This account doesn't have admin access.");
    await createSession(user.id);
    return { ok: true as const };
  });

export const adminSignUp = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { getDb, schema } = await import("@/lib/db");
    const { hashPassword } = await import("@/lib/auth/password");
    const { createSession } = await import("@/lib/auth/session");
    const db = getDb();
    const existingRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.adminUsers);
    if ((existingRows[0]?.count ?? 0) > 0)
      throw new Error("An admin account already exists. Please sign in instead.");
    if (data.password.length < 8) throw new Error("Password must be at least 8 characters.");
    const password_hash = await hashPassword(data.password);
    const [user] = await db
      .insert(schema.adminUsers)
      .values({ email: data.email.trim().toLowerCase(), password_hash, role: "admin" })
      .returning();
    await createSession(user!.id);
    return { ok: true as const };
  });

export const adminSignOut = createServerFn({ method: "POST" }).handler(async () => {
  const { destroySession } = await import("@/lib/auth/session");
  await destroySession();
  return { ok: true as const };
});

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { getDb, schema } = await import("@/lib/db");
  const db = getDb();
  const [enquiries, published, drafts, recentPosts] = await Promise.all([
    db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.created_at)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.projects)
      .where(eq(schema.projects.published, true)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.posts)
      .where(eq(schema.posts.status, "draft")),
    db
      .select({
        id: schema.posts.id,
        title: schema.posts.title,
        updated_at: schema.posts.updated_at,
      })
      .from(schema.posts)
      .orderBy(desc(schema.posts.updated_at))
      .limit(5),
  ]);
  return {
    enquiries,
    published: published[0]?.count ?? 0,
    drafts: drafts[0]?.count ?? 0,
    recentPosts,
  };
});

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

export const listEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { getDb, schema } = await import("@/lib/db");
  return getDb().select().from(schema.enquiries).orderBy(desc(schema.enquiries.created_at));
});

export const updateEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; status?: string; notes?: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getDb, schema } = await import("@/lib/db");
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.status !== undefined) patch["status"] = data.status;
    if (data.notes !== undefined) patch["notes"] = data.notes;
    await getDb().update(schema.enquiries).set(patch).where(eq(schema.enquiries.id, data.id));
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const listAllProjects = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { getDb, schema } = await import("@/lib/db");
  return getDb().select().from(schema.projects).orderBy(schema.projects.sort_order);
});

export type ProjectInput = {
  id?: string;
  title: string;
  slug: string;
  project_type: string;
  category: string;
  summary: string;
  body: string;
  technologies: string[];
  live_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  sort_order: number;
  cover_url: string | null;
  gallery: string[];
};

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((d: ProjectInput) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getDb, schema } = await import("@/lib/db");
    const { id, ...row } = data;
    try {
      if (id) {
        await getDb()
          .update(schema.projects)
          .set({ ...row, updated_at: new Date().toISOString() })
          .where(eq(schema.projects.id, id));
      } else {
        await getDb().insert(schema.projects).values(row);
      }
      return { ok: true as const };
    } catch (err) {
      if ((err as { code?: string }).code === "23505")
        return { ok: false as const, error: "That slug is already used" };
      console.error("saveProject failed", err);
      return { ok: false as const, error: "Could not save" };
    }
  });

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getDb, schema } = await import("@/lib/db");
    await getDb().delete(schema.projects).where(eq(schema.projects.id, data.id));
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export const listAllPosts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { getDb, schema } = await import("@/lib/db");
  return getDb().select().from(schema.posts).orderBy(desc(schema.posts.updated_at));
});

export type PostInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author_name: string;
  seo_title: string | null;
  seo_description: string | null;
  body: string;
  status: "draft" | "published";
  published_at: string | null;
};

export const savePost = createServerFn({ method: "POST" })
  .inputValidator((d: PostInput) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getDb, schema } = await import("@/lib/db");
    const { id, ...row } = data;
    try {
      if (id) {
        await getDb()
          .update(schema.posts)
          .set({ ...row, updated_at: new Date().toISOString() })
          .where(eq(schema.posts.id, id));
      } else {
        await getDb().insert(schema.posts).values(row);
      }
      return { ok: true as const };
    } catch (err) {
      if ((err as { code?: string }).code === "23505")
        return { ok: false as const, error: "That slug is already used" };
      console.error("savePost failed", err);
      return { ok: false as const, error: "Could not save" };
    }
  });

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getDb, schema } = await import("@/lib/db");
    await getDb().delete(schema.posts).where(eq(schema.posts.id, data.id));
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const getAdminSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { getDb, schema } = await import("@/lib/db");
  const [row] = await getDb()
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, 1));
  return row ?? null;
});

export const updateSettings = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, unknown>) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { getDb, schema } = await import("@/lib/db");
    await getDb()
      .update(schema.siteSettings)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(schema.siteSettings.id, 1));
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Media (Firebase Storage)
// ---------------------------------------------------------------------------

export const listMedia = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { listFirebaseMedia } = await import("@/lib/firebase/storage");
  return listFirebaseMedia();
});

export const uploadMediaFile = createServerFn({ method: "POST" })
  .inputValidator((d: FormData) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("No file provided");
    const { validateUpload, uploadToFirebase } = await import("@/lib/firebase/storage");
    const buffer = Buffer.from(await file.arrayBuffer());
    const err = validateUpload(file.type, buffer.byteLength);
    if (err) throw new Error(err);
    const { url } = await uploadToFirebase(buffer, file.type, file.name);
    return { url };
  });

export const deleteMediaFile = createServerFn({ method: "POST" })
  .inputValidator((d: { path: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { deleteFirebaseMedia } = await import("@/lib/firebase/storage");
    await deleteFirebaseMedia(data.path);
    return { ok: true as const };
  });
