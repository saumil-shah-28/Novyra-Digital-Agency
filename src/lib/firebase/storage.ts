// Server-only media storage on Firebase Storage, replacing the old Supabase
// private bucket + signed URLs. Dynamically imported from admin.functions.ts.
import { randomUUID } from "node:crypto";

export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
];
export const MAX_BYTES = 25 * 1024 * 1024;
const TEN_YEARS_MS = 1000 * 60 * 60 * 24 * 365 * 10;

export function validateUpload(contentType: string, size: number): string | null {
  if (!ALLOWED_MIME.includes(contentType))
    return "Only JPG, PNG, WebP, AVIF, GIF, MP4 or WebM files are allowed.";
  if (size > MAX_BYTES) return "Files must be 25 MB or smaller.";
  return null;
}

export async function uploadToFirebase(buffer: Buffer, contentType: string, originalName: string) {
  const { storageBucket } = await import("@/lib/firebase/admin");
  const ext =
    originalName
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "bin";
  const path = `media/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  const file = storageBucket().file(path);
  await file.save(buffer, { contentType, resumable: false });
  const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + TEN_YEARS_MS });
  return { path, url };
}

export async function listFirebaseMedia(): Promise<
  { path: string; url: string; video: boolean }[]
> {
  const { storageBucket } = await import("@/lib/firebase/admin");
  const [files] = await storageBucket().getFiles({ prefix: "media/" });
  const out: { path: string; url: string; video: boolean }[] = [];
  for (const file of files) {
    const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + TEN_YEARS_MS });
    out.push({ path: file.name, url, video: /\.(mp4|webm)$/i.test(file.name) });
  }
  return out.sort((a, b) => (a.path < b.path ? 1 : -1));
}

export async function deleteFirebaseMedia(path: string) {
  const { storageBucket } = await import("@/lib/firebase/admin");
  await storageBucket().file(path).delete({ ignoreNotFound: true });
}
