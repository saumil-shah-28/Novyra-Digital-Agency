import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Linkedin, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { getPost, listPosts } from "@/lib/data.functions";
import { formatDate, readingMinutes } from "@/lib/posts";
import { FinalCTA, Markdown } from "@/components/blocks";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const [post, all] = await Promise.all([getPost({ data: { slug: params.slug } }), listPosts()]);
    if (!post) throw notFound();
    const related = all
      .filter((p) => p.id !== post.id)
      .sort((a) => (a.category === post.category ? -1 : 1))
      .slice(0, 2);
    return { post, related };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.post;
    if (!p)
      return {
        meta: [
          { title: "Article not found | Novyra Digital" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = p.seo_title || `${p.title} | Novyra Digital`;
    const d = p.seo_description || p.excerpt;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/insights/${params.slug}` },
        { property: "article:published_time", content: p.published_at ?? "" },
        { property: "article:modified_time", content: p.updated_at },
      ],
      links: [{ rel: "canonical", href: `/insights/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: d,
            datePublished: p.published_at,
            dateModified: p.updated_at,
            author: { "@type": "Organization", name: p.author_name },
            publisher: { "@type": "Organization", name: "Novyra Digital" },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { post: p, related } = Route.useLoaderData();
  const share = (kind: "wa" | "li" | "copy") => {
    const url = window.location.href;
    if (kind === "copy") {
      navigator.clipboard.writeText(url).then(() => toast.success("Link copied"));
      return;
    }
    const href =
      kind === "wa"
        ? `https://wa.me/?text=${encodeURIComponent(`${p.title} ${url}`)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };
  const sb =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-primary hover:text-accent-foreground";
  return (
    <>
      <article className="container-page pt-10">
        <Link
          to="/insights"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All insights
        </Link>
        <header className="mx-auto mt-10 max-w-3xl">
          <Link to="/insights" search={{ category: p.category }} className="eyebrow">
            {p.category}
          </Link>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl">
            {p.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">{p.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4 text-sm text-muted-foreground">
            <span>
              By <strong className="text-foreground">{p.author_name}</strong> · Published{" "}
              {formatDate(p.published_at)}
              {p.updated_at && formatDate(p.updated_at) !== formatDate(p.published_at) && (
                <> · Updated {formatDate(p.updated_at)}</>
              )}{" "}
              · {readingMinutes(p.body)} min read
            </span>
            <span className="flex gap-2">
              <button
                type="button"
                className={sb}
                onClick={() => share("wa")}
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={sb}
                onClick={() => share("li")}
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={sb}
                onClick={() => share("copy")}
                aria-label="Copy link"
              >
                <Link2 className="h-4 w-4" />
              </button>
            </span>
          </div>
        </header>
        <div className="mx-auto mt-10 max-w-3xl">
          <Markdown>{p.body}</Markdown>
        </div>
      </article>
      {related.length > 0 && (
        <section className="container-page mt-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold">Related articles</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/insights/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40"
                >
                  <span className="text-xs font-semibold uppercase text-accent-foreground">
                    {r.category}
                  </span>
                  <p className="mt-2 font-display font-bold">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <FinalCTA />
    </>
  );
}
