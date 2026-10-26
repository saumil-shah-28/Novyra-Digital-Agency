import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { submitEnquiry } from "@/lib/contact.functions";
import { enquirySchema, SERVICE_OPTIONS } from "@/lib/enquiry-schema";
import { BUDGETS, TIMELINES } from "@/lib/site";
import { btn } from "./brand";
import { cn } from "@/lib/utils";

const field =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive";

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const submit = useServerFn(submitEnquiry);
  const startedAt = useRef(Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      fullName: String(fd.get("fullName") ?? ""),
      businessName: String(fd.get("businessName") ?? ""),
      email: String(fd.get("email") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      service: String(fd.get("service") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      description: String(fd.get("description") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt: startedAt.current,
    };
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    setServerError("");
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) setStatus("done");
      else {
        setServerError(res.error);
        setStatus("error");
      }
    } catch {
      setServerError(
        "Something went wrong sending your enquiry. Please check your details and try again.",
      );
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-4 font-display text-2xl font-extrabold">
          Thank you — we've received your enquiry.
        </h2>
        <p className="mt-2 text-muted-foreground">
          We'll read it carefully and reply by email soon.
        </p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1.5 text-sm text-destructive">
        {errors[k]}
      </p>
    ) : null;
  const a = (k: string) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Full name *
          <input name="fullName" autoComplete="name" className={field} {...a("fullName")} />
          {err("fullName")}
        </label>
        <label className="text-sm font-semibold">
          Business name <span className="font-normal text-muted-foreground">(optional)</span>
          <input name="businessName" autoComplete="organization" className={field} />
        </label>
        <label className="text-sm font-semibold">
          Email *
          <input name="email" type="email" autoComplete="email" className={field} {...a("email")} />
          {err("email")}
        </label>
        <label className="text-sm font-semibold">
          WhatsApp number <span className="font-normal text-muted-foreground">(optional)</span>
          <input
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="+91"
            className={field}
            {...a("whatsapp")}
          />
          {err("whatsapp")}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Service required *
          <select
            name="service"
            defaultValue={defaultService ?? ""}
            className={field}
            {...a("service")}
          >
            <option value="" disabled>
              Choose a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {err("service")}
        </label>
        <label className="text-sm font-semibold">
          Budget range *
          <select name="budget" defaultValue="" className={field} {...a("budget")}>
            <option value="" disabled>
              Choose a range
            </option>
            {BUDGETS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {err("budget")}
        </label>
        <label className="text-sm font-semibold">
          Expected timeline *
          <select name="timeline" defaultValue="" className={field} {...a("timeline")}>
            <option value="" disabled>
              Choose a timeline
            </option>
            {TIMELINES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {err("timeline")}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Project description *
          <textarea
            name="description"
            rows={5}
            placeholder="What are you building, who is it for, and what should it achieve?"
            className={field}
            {...a("description")}
          />
          {err("description")}
        </label>
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              name="consent"
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
              {...a("consent")}
            />
            <span>
              I agree that Novyra Digital may store these details to respond to my enquiry, as
              described in the{" "}
              <Link to="/privacy-policy" className="text-accent-foreground underline">
                privacy policy
              </Link>
              .
            </span>
          </label>
          {err("consent")}
        </div>
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(btn({ size: "lg" }), "mt-6 w-full sm:w-auto")}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </button>
    </form>
  );
}
