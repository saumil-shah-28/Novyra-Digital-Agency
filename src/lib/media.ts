import { uploadMediaFile } from "@/lib/admin.functions";

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

export function validateFile(f: File): string | null {
  if (!ALLOWED_MIME.includes(f.type))
    return "Only JPG, PNG, WebP, AVIF, GIF, MP4 or WebM files are allowed.";
  if (f.size > MAX_BYTES) return "Files must be 25 MB or smaller.";
  return null;
}

/** Uploads to Firebase Storage (via the admin server function) and returns a long-lived signed URL. */
export async function uploadMedia(f: File): Promise<string> {
  const err = validateFile(f);
  if (err) throw new Error(err);
  const fd = new FormData();
  fd.set("file", f);
  const { url } = await uploadMediaFile({ data: fd });
  return url;
}
