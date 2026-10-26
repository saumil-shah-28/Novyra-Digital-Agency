import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { getService, SERVICES } from "@/lib/services";
import { listProjects } from "@/lib/data.functions";
import { PageIntro, FinalCTA, FAQ, ProjectCard } from "@/components/blocks";
import { Reveal } from "@/components/motion";
import { btn } from "@/components/brand";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    const projects = await listProjects();
    return { slug: service.slug, projects: projects.slice(0, 2) };
  },
  head: ({ params, loaderData }) => {
    const s = loaderData ? getService(loaderData.slug) : undefined;
    if (!s)
      return {
        meta: [
          { title: "Service not found | Novyra Digital" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = `${s.title} | Novyra Digital`;
    return {
      meta: [
        { title: t },
        { name: "description", content: s.metaDescription },
        { property: "og:title", content: t },
        { property: "og:description", content: s.metaDescription },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: s.name,
              description: s.metaDescription,
              provider: { "@type": "Organization", name: "Novyra Digital" },
              areaServed: "Ahmedabad",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Services", item: "/services" },
                { "@type": "ListItem", position: 2, name: s.name, item: `/services/${s.slug}` },
              ],
            },
          ]),
        },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug, projects } = Route.useLoaderData();
  const s = getService(slug)!;
  const related = s.related.map((r) => SERVICES.find((x) => x.slug === r)!).filter(Boolean);
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-8 text-sm text-muted-foreground">
        <Link to="/services" className="hover:text-foreground">
          Services
        </Link>{" "}
        <span aria-hidden>/</span> <span className="text-foreground">{s.name}</span>
      </nav>
      <PageIntro eyebrow={s.name} title={s.title} text={s.intro}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className={btn({ size: "lg" })}>
            Get a Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/work" className={btn({ variant: "outline", size: "lg" })}>
            View Our Work
          </Link>
        </div>
      </PageIntro>

      <section className="container-page">
        <h2 className="text-h2">What you get</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <s.icon className="h-6 w-6 text-accent-foreground" />
                <h3 className="mt-4 font-display font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-24 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-extrabold">Service scope</h2>
            <ul className="mt-6 space-y-3">
              {s.scope.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-full rounded-3xl bg-accent p-8">
            <h2 className="font-display text-2xl font-extrabold">Deliverables</h2>
            <ul className="mt-6 space-y-3">
              {s.deliverables.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
                  {x}
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Technologies
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {s.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="container-page mt-24">
        <h2 className="text-h2">How we deliver it</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {s.process.map((p, i) => (
            <Reveal key={p} delay={i * 0.05}>
              <li className="h-full rounded-2xl border border-border bg-card p-5">
                <span className="font-display text-sm font-extrabold text-accent-foreground">
                  0{i + 1}
                </span>
                <p className="mt-2 font-semibold">{p}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {projects.length > 0 && (
        <section className="container-page mt-24">
          <h2 className="text-h2">Related work</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-h2">Frequently asked questions</h2>
        <FAQ items={s.faqs} />
      </section>

      <section className="container-page mt-24">
        <h2 className="font-display text-xl font-extrabold">Related services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/services/$slug"
              params={{ slug: r.slug }}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary/40"
            >
              <span className="font-semibold">{r.name}</span>
              <ArrowRight className="h-4 w-4 text-accent-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
