import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  MessagesSquare,
  ClipboardList,
  PenTool,
  Smartphone,
  Code2,
  ShieldCheck,
  Eye,
  LifeBuoy,
  Store,
  Shirt,
  Plane,
  Briefcase,
  Rocket,
  Building2,
} from "lucide-react";
import { SERVICES } from "@/lib/services";
import { PROCESS, TECHNOLOGIES } from "@/lib/site";
import { listPosts, listProjects } from "@/lib/data.functions";
import { btn, SectionHeading } from "@/components/brand";
import { Reveal } from "@/components/motion";
import { FinalCTA, ProjectCard, EmptyState } from "@/components/blocks";

const TITLE = "Website Design & Development Company in Ahmedabad | Novyra Digital";
const DESC =
  "Looking for website design and development in Ahmedabad? Novyra Digital builds professional, responsive websites to help local businesses attract customers and grow online.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [projects, posts] = await Promise.all([listProjects(), listPosts()]);
    return { projects, posts: posts.slice(0, 3) };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Hero() {
  const reduce = useReducedMotion();
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]"
      />
      <div
        aria-hidden
        className="animate-drift absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl"
      />
      <div className="container-page relative grid items-center gap-14 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
        <div>
          <motion.p {...item(0)} className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Website Design &amp;
            Development Company in Ahmedabad
          </motion.p>
          <motion.h1 {...item(1)} className="text-display mt-6">
            We Build Websites That Grow Your <span className="text-gradient-brand">Business</span>{" "}
            in Ahmedabad.
          </motion.h1>
          <motion.p
            {...item(2)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Professional website design and development services in Ahmedabad to help your business
            attract customers, build trust, and grow online.
          </motion.p>
          <motion.div {...item(3)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className={btn({ size: "lg" })}>
              Get a Free Consultation{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
            <Link to="/work" className={btn({ variant: "outline", size: "lg" })}>
              View Our Work
            </Link>
          </motion.div>
          <motion.ul
            {...item(4)}
            className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium"
          >
            {["Custom Design", "SEO-Ready", "Mobile Responsive", "Fast Loading"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </motion.ul>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="animate-float-slow absolute -left-6 -top-6 h-16 w-16 rounded-2xl border border-border bg-card shadow-soft" />
      <div className="animate-drift absolute -bottom-8 right-10 h-24 w-24 rounded-full border-[14px] border-primary/25" />
      {/* Browser */}
      <div className="relative rounded-2xl border border-border bg-card shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          <span className="ml-3 h-5 flex-1 rounded-full bg-muted" />
        </div>
        <div className="grid gap-4 p-6">
          <div className="h-3 w-24 rounded-full bg-accent" />
          <div className="space-y-2">
            <div className="h-5 w-11/12 rounded-md bg-foreground/85" />
            <div className="h-5 w-2/3 rounded-md bg-gradient-brand" />
          </div>
          <div className="h-2.5 w-4/5 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-8 w-28 rounded-full bg-primary" />
            <div className="h-8 w-24 rounded-full border border-border" />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="h-6 w-6 rounded-lg bg-accent" />
                <div className="mt-3 h-2 w-full rounded bg-muted" />
                <div className="mt-1.5 h-2 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Phone */}
      <div className="absolute -bottom-10 -right-2 w-32 rounded-[1.6rem] border border-border bg-elevated p-2 shadow-lift sm:-right-8 sm:w-36">
        <div className="rounded-[1.2rem] bg-background p-3">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" />
          <div className="mt-4 h-16 rounded-xl bg-gradient-brand" />
          <div className="mt-3 h-2 w-full rounded bg-muted" />
          <div className="mt-1.5 h-2 w-3/4 rounded bg-muted" />
          <div className="mt-4 h-6 rounded-full bg-primary" />
        </div>
      </div>
      {/* Badge */}
      <div className="absolute -left-4 bottom-16 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold shadow-soft sm:-left-10">
        <span className="h-2 w-2 rounded-full bg-success" /> Responsive on every screen
      </div>
    </motion.div>
  );
}

const INDUSTRIES = [
  {
    icon: Store,
    name: "Local businesses",
    text: "Clear websites that help nearby customers find, trust and contact you.",
  },
  {
    icon: Shirt,
    name: "E-commerce & fashion",
    text: "Product catalogues, lookbooks and checkout flows for online selling.",
  },
  {
    icon: Plane,
    name: "Travel & hospitality",
    text: "Package listings, enquiry forms and booking-friendly layouts.",
  },
  {
    icon: Briefcase,
    name: "Professional services",
    text: "Credible sites that explain expertise and generate consultations.",
  },
  {
    icon: Rocket,
    name: "Startups",
    text: "MVPs, landing pages and apps to test ideas with real users.",
  },
  {
    icon: Building2,
    name: "SMEs",
    text: "Internal tools, portals and admin dashboards to streamline operations.",
  },
];

const WHY = [
  {
    icon: MessagesSquare,
    t: "Direct communication",
    d: "You talk with the people designing and building your project.",
  },
  {
    icon: ClipboardList,
    t: "Clear project scope",
    d: "A written scope with deliverables and exclusions before work starts.",
  },
  {
    icon: PenTool,
    t: "Thoughtful UI/UX",
    d: "Design decisions grounded in how your customers actually behave.",
  },
  {
    icon: Smartphone,
    t: "Mobile-first engineering",
    d: "Built for phones first, then scaled up to larger screens.",
  },
  {
    icon: Code2,
    t: "Maintainable code",
    d: "Typed, structured code that future developers can work with.",
  },
  {
    icon: ShieldCheck,
    t: "Testing and reliability",
    d: "Forms, flows and integrations tested before launch.",
  },
  {
    icon: Eye,
    t: "Transparent delivery",
    d: "Regular updates and preview links throughout the project.",
  },
  {
    icon: LifeBuoy,
    t: "Ongoing support",
    d: "Optional maintenance plans after your site goes live.",
  },
];

function Home() {
  const { projects, posts } = Route.useLoaderData();
  return (
    <>
      <Hero />

      {/* Services */}
      <section className="container-page mt-12">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Everything your business needs to work well online."
            text="From your first website to custom software, each service is scoped around what your business actually needs."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.slice(0, 8).map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 0.06}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.short}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground">
                  Learn more{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="container-page mt-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Selected work"
              title="Projects we've built."
              text="Each project is labelled honestly as client work, personal project or concept."
            />
          </Reveal>
          <Link to="/work" className={btn({ variant: "outline" })}>
            All work <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="Case studies coming soon"
                text="We're preparing detailed write-ups of recent work."
              />
            </div>
          )}
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tech */}
      <section className="container-page mt-28">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <SectionHeading
                eyebrow="Technology"
                title="Modern, proven tools."
                text="We pick technology for maintainability and fit, not hype."
              />
              <ul className="flex flex-wrap gap-2.5">
                {TECHNOLOGIES.map((t, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-accent-foreground"
                  >
                    {t}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Industries */}
      <section className="container-page mt-28">
        <Reveal>
          <SectionHeading eyebrow="Industries" title="Who we work with." />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((it) => (
            <div key={it.name} className="bg-card p-7 transition-colors hover:bg-accent/40">
              <it.icon className="h-6 w-6 text-accent-foreground" />
              <h3 className="mt-4 font-display text-lg font-bold">{it.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="container-page mt-28">
        <Reveal>
          <SectionHeading eyebrow="Why Novyra Digital" title="How we work with you." center />
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.t} delay={(i % 4) * 0.05}>
              <w.icon className="h-6 w-6 text-accent-foreground" />
              <h3 className="mt-4 font-display font-bold">{w.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{w.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-page mt-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Process"
                title="Six clear stages, from idea to launch."
                text="You always know what's happening, what's next and what we need from you."
              />
              <Link to="/process" className={btn({ variant: "outline", className: "mt-8" })}>
                See the process
              </Link>
            </div>
          </Reveal>
          <ol className="relative space-y-4 border-l border-border pl-8">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.04}>
                <li className="relative rounded-2xl border border-border bg-card p-6">
                  <span className="absolute -left-[45px] top-6 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background bg-primary" />
                  <p className="font-display text-sm font-extrabold text-accent-foreground">
                    {p.n}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Insights */}
      {posts.length > 0 && (
        <section className="container-page mt-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <SectionHeading eyebrow="Insights" title="Practical guides for business owners." />
            </Reveal>
            <Link to="/insights" className={btn({ variant: "outline" })}>
              All articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <Link
                  to="/insights/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    {p.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-accent-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
