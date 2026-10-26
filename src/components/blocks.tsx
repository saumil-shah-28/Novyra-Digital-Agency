import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { btn } from "./brand";
import { Reveal } from "./motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data.functions";

export function FinalCTA() {
  return (
    <section className="container-page mt-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-16 text-center text-primary-foreground sm:px-12 md:py-20">
          <div aria-hidden className="bg-dots absolute inset-0 opacity-30" />
          <div
            aria-hidden
            className="animate-drift absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-primary-foreground/15"
          />
          <div
            aria-hidden
            className="animate-float-slow absolute -bottom-10 left-10 h-24 w-24 rotate-12 rounded-2xl bg-primary-foreground/10"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-h2">Ready to Grow Your Business Online?</h2>
            <p className="mt-4 text-lg opacity-90">
              Tell us about your idea. Let's find the right digital solution for your business.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-background px-7 py-3.5 font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              Let's Discuss Your Project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((f, i) => (
        <div key={f.q}>
          <h3>
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-base font-bold"
            >
              {f.q}
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-accent-foreground transition-transform",
                  open === i && "rotate-45",
                )}
              />
            </button>
          </h3>
          <div
            className={cn(
              "grid transition-all duration-300",
              open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <p className="overflow-hidden px-6 text-muted-foreground">
              <span className="block pb-5">{f.a}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-novyra">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

export function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden bg-accent", className)}>
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border/60 bg-card px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-destructive/70" />
        <span className="h-2 w-2 rounded-full bg-warning/70" />
        <span className="h-2 w-2 rounded-full bg-success/70" />
        <span className="ml-2 truncate rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {project.slug}
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {project.cover_url ? (
          <img
            src={project.cover_url}
            alt={`${project.title} project preview`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          // Abstract preview until a real screenshot is uploaded.
          <div className="flex h-full w-full items-center justify-center bg-dots p-6">
            <div className="w-full max-w-[220px] space-y-2">
              <p className="truncate font-display text-base font-extrabold tracking-tight">
                {project.title}
              </p>
              <div className="h-1.5 w-3/4 rounded bg-muted" />
              <div className="h-1.5 w-1/2 rounded bg-muted" />
              <div className="mt-3 h-5 w-16 rounded-full bg-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: project.slug }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-500 hover:shadow-lift"
    >
      <div
        className={cn("overflow-hidden rounded-t-2xl", large ? "aspect-[16/10]" : "aspect-[16/11]")}
      >
        <ProjectVisual project={project} />
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            {project.project_type}
          </span>
          <h3 className="mt-2.5 truncate font-display text-base font-bold">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
          {project.technologies.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="h-3.5 w-3.5" />
          <span className="sr-only">View case study</span>
        </span>
      </div>
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div className="container-page relative pb-16 pt-16 md:pb-20 md:pt-24">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="text-display max-w-4xl">{title}</h1>
          {text && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{text}</p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <Link to="/contact" className={cn(btn({ variant: "soft", size: "sm" }), "mt-6")}>
        Get in touch
      </Link>
    </div>
  );
}
