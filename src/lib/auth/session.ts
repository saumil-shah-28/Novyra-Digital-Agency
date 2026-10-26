// Server-only session management: opaque random token in an httpOnly cookie,
// looked up against the `sessions` table on every request. Replaces Supabase
// Auth's JWT-based session.
import { randomBytes } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "novyra_admin_session";
const SESSION_DAYS = 30;

const cookieOptions = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function createSession(userId: string) {
  const { getDb, schema } = await import("@/lib/db");
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await getDb()
    .insert(schema.sessions)
    .values({ id: token, user_id: userId, expires_at: expiresAt });
  setCookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: SESSION_DAYS * 24 * 60 * 60 });
  return token;
}

/** Returns the signed-in admin user for the current request, or null. Also clears expired/invalid cookies. */
export async function getCurrentAdmin() {
  const token = getCookie(COOKIE_NAME);
  if (!token) return null;
  const { getDb, schema } = await import("@/lib/db");
  const rows = await getDb()
    .select({ user: schema.adminUsers, session: schema.sessions })
    .from(schema.sessions)
    .innerJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.sessions.user_id))
    .where(eq(schema.sessions.id, token))
    .limit(1);
  const row = rows[0];
  if (!row || new Date(row.session.expires_at).getTime() < Date.now()) {
    if (row) await getDb().delete(schema.sessions).where(eq(schema.sessions.id, token));
    deleteCookie(COOKIE_NAME, cookieOptions);
    return null;
  }
  return row.user;
}

export async function destroySession() {
  const token = getCookie(COOKIE_NAME);
  if (token) {
    const { getDb, schema } = await import("@/lib/db");
    await getDb().delete(schema.sessions).where(eq(schema.sessions.id, token));
  }
  deleteCookie(COOKIE_NAME, cookieOptions);
}
