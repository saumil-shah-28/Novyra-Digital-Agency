import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProject } from "@/lib/data.functions";
import { FinalCTA, Markdown, ProjectVisual } from "@/components/blocks";
import { Reveal } from "@/components/motion";
import { btn } from "@/components/brand";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const p = await getProject({ data: { slug: params.slug } });
    if (!p) throw notFound();
    return p;
  },
  head: ({ params, loaderData: p }) => {
    if (!p)
      return {
        meta: [
          { title: "Project not found | Novyra Digital" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = p.seo_title || `${p.title} — Case Study | Novyra Digital`;
    const d = p.seo_description || p.summary;
    const meta = [
      { title: t },
      { name: "description", content: d },
      { property: "og:title", content: t },
      { property: "og:description", content: d },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/work/${params.slug}` },
    ];
    if (p.cover_url?.startsWith("https://"))
      meta.push(
        { property: "og:image", content: p.cover_url },
        { name: "twitter:image", content: p.cover_url },
      );
    return { meta, links: [{ rel: "canonical", href: `/work/${params.slug}` }] };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const p = Route.useLoaderData();
  return (
    <>
      <div className="container-page pt-10">
        <Link
          to="/work"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All work
        </Link>
        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {p.project_type}
            </span>
            {p.category && p.category !== p.project_type && (
              <span className="rounded-full border border-border px-3 py-1 text-xs">
                {p.category}
              </span>
            )}
          </div>
          <h1 className="text-display mt-5">{p.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{p.summary}</p>
          {p.live_url && (
            <a
              href={p.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className={btn({ variant: "outline", className: "mt-8" })}
            >
              Visit live site <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </Reveal>
      </div>
      <Reveal className="container-page mt-12">
        <div className="group aspect-[16/9] overflow-hidden rounded-3xl border border-border">
          <ProjectVisual project={p} />
        </div>
      </Reveal>
      <section className="container-page mt-16 grid gap-12 lg:grid-cols-[1fr_280px]">
        <div>
          {p.body ? (
            <Markdown>{p.body}</Markdown>
          ) : (
            <p className="text-muted-foreground">
              A full case study for this project is being written.
            </p>
          )}
        </div>
        {p.technologies.length > 0 && (
          <aside>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Technologies
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.technologies.map((t) => (
                <li key={t} className="rounded-full border border-border px-3 py-1 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </section>
      {p.gallery.length > 0 && (
        <section className="container-page mt-16 grid gap-6 md:grid-cols-2">
          {p.gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${p.title} screenshot ${i + 1}`}
              loading="lazy"
              className="w-full rounded-2xl border border-border"
            />
          ))}
        </section>
      )}
      <FinalCTA />
    </>
  );
}
