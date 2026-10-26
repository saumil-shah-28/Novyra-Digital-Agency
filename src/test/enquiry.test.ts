import { describe, expect, it } from "vitest";
import { enquirySchema } from "@/lib/enquiry-schema";
const ok = {
  fullName: "Asha Patel",
  email: "asha@example.com",
  service: "Technical SEO",
  budget: "Not sure yet",
  timeline: "Flexible",
  description: "We need a new website for our clinic.",
  consent: true as const,
  startedAt: 0,
};
describe("enquiry rules", () => {
  it("accepts a complete enquiry", () => expect(enquirySchema.safeParse(ok).success).toBe(true));
  it("requires privacy consent", () =>
    expect(enquirySchema.safeParse({ ...ok, consent: false }).success).toBe(false));
  it("requires a valid email", () =>
    expect(enquirySchema.safeParse({ ...ok, email: "nope" }).success).toBe(false));
  it("rejects a filled honeypot", () =>
    expect(enquirySchema.safeParse({ ...ok, website: "spam" }).success).toBe(false));
});
