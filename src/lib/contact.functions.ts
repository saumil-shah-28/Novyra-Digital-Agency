import { createServerFn } from "@tanstack/react-start";
import { and, eq, gte } from "drizzle-orm";
import { enquirySchema, MIN_FILL_MS, RATE_LIMIT_PER_HOUR } from "./enquiry-schema";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Bot checks: honeypot filled or form submitted implausibly fast → pretend success, store nothing.
    if (data.website || Date.now() - data.startedAt < MIN_FILL_MS) {
      return { ok: true as const };
    }

    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const ipHash = await sha256(`novyra:${ip}`);

    const { getDb, schema } = await import("@/lib/db");
    const db = getDb();

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await db
      .select({ id: schema.enquiries.id })
      .from(schema.enquiries)
      .where(and(eq(schema.enquiries.ip_hash, ipHash), gte(schema.enquiries.created_at, since)));
    if (recent.length >= RATE_LIMIT_PER_HOUR) {
      return { ok: false as const, error: "Too many submissions. Please try again in an hour." };
    }

    let inserted;
    try {
      const rows = await db
        .insert(schema.enquiries)
        .values({
          full_name: data.fullName,
          business_name: data.businessName || null,
          email: data.email,
          whatsapp: data.whatsapp || null,
          service: data.service,
          budget: data.budget,
          timeline: data.timeline,
          description: data.description,
          consent: data.consent,
          ip_hash: ipHash,
        })
        .returning();
      inserted = rows[0]!;
    } catch (err) {
      console.error("enquiry insert failed", err);
      return { ok: false as const, error: "We couldn't save your enquiry. Please try again." };
    }

    const [settings] = await db
      .select({ contact_email: schema.siteSettings.contact_email })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.id, 1));

    const { mirrorEnquiryToFirestore } = await import("@/lib/firebase/firestore");
    const { sendEnquiryEmail } = await import("@/lib/email");
    await Promise.allSettled([
      mirrorEnquiryToFirestore(inserted),
      sendEnquiryEmail(settings?.contact_email, inserted),
    ]);

    return { ok: true as const };
  });
