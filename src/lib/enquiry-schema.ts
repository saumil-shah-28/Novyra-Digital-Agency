import { z } from "zod";
import { BUDGETS, TIMELINES } from "./site";
import { SERVICES } from "./services";

export const SERVICE_OPTIONS = [...SERVICES.map((s) => s.name), "Something else"];

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  businessName: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(255),
  whatsapp: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+\d\s-]*$/, "Use digits, spaces, + or - only")
    .optional()
    .or(z.literal("")),
  service: z.string().refine((v) => SERVICE_OPTIONS.includes(v), "Please choose a service"),
  budget: z
    .string()
    .refine((v) => (BUDGETS as readonly string[]).includes(v), "Please choose a budget range"),
  timeline: z
    .string()
    .refine((v) => (TIMELINES as readonly string[]).includes(v), "Please choose a timeline"),
  description: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters)")
    .max(4000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy policy" }) }),
  // Honeypot: real users never fill this.
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Submissions faster than this are treated as bots. */
export const MIN_FILL_MS = 3000;
/** Max enquiries accepted per visitor per hour. */
export const RATE_LIMIT_PER_HOUR = 5;
