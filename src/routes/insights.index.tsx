import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { listPosts } from "@/lib/data.functions";
import { formatDate, readingMinutes } from "@/lib/posts";
import { PageIntro, FinalCTA, EmptyState } from "@/components/blocks";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

const T = "Insights — Website, App & SEO Guides for Businesses | Novyra Digital";
const D =
  "Practical articles on website costs, choosing a developer, Flutter apps, e-commerce planning and technical SEO for businesses in Ahmedabad and beyond.";

export const Route = createFileRoute("/insights/")({
  validateSearch: z.object({ category: z.string().optional() }),
  loader: () => listPosts(),
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const posts = Route.useLoaderData();
  const { category } = Route.useSearch();
  const cats = [...new Set(posts.map((p) => p.category))];
  const shown = category ? posts.filter((p) => p.category === category) : posts;
  const chip = "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";
  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Guides for business owners."
        text="Plain-language articles on planning, building and growing your digital presence."
      />
      <section className="container-page">
        <nav aria-label="Categories" className="flex flex-wrap gap-2">
          <Link
            to="/insights"
            search={{}}
            className={cn(
              chip,
              !category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50",
            )}
          >
            All
          </Link>
          {cats.map((c) => (
            <Link
              key={c}
              to="/insights"
              search={{ category: c }}
              className={cn(
                chip,
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50",
              )}
            >
              {c}
            </Link>
          ))}
        </nav>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.length === 0 && (
            <div className="md:col-span-3">
              <EmptyState title="No articles yet" text="New guides are on the way." />
            </div>
          )}
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}>
              <Link
                to="/insights/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  {p.category}
                </span>
                <h2 className="mt-3 font-display text-xl font-extrabold leading-snug group-hover:text-accent-foreground">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-muted-foreground">{p.excerpt}</p>
                <p className="mt-6 text-xs text-muted-foreground">
                  {formatDate(p.published_at)} · {readingMinutes(p.body)} min read
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
