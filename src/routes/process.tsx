import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, FinalCTA } from "@/components/blocks";
import { Reveal } from "@/components/motion";
import { PROCESS } from "@/lib/site";

const T = "Our Process — From Discovery to Launch | Novyra Digital";
const D =
  "How Novyra Digital delivers websites and apps: discovery, planning, UI/UX design, development, testing, launch and ongoing maintenance.";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: Process,
});

const DETAIL: Record<string, { you: string; us: string }> = {
  "01": {
    you: "Share goals, audience and examples you like.",
    us: "Ask questions, review competitors and your current site.",
  },
  "02": {
    you: "Review and approve the written scope.",
    us: "Document pages, features, timeline and budget.",
  },
  "03": {
    you: "Give feedback on wireframes and designs.",
    us: "Design mobile and desktop layouts for key pages.",
  },
  "04": {
    you: "Provide content and test preview links.",
    us: "Build, integrate and share progress regularly.",
  },
  "05": {
    you: "Final review and sign-off.",
    us: "Cross-device testing, launch, analytics and Search Console.",
  },
  "06": {
    you: "Request changes as your business grows.",
    us: "Updates, fixes, monitoring and improvements.",
  },
};

function Process() {
  return (
    <>
      <PageIntro
        eyebrow="Process"
        title="A clear path from idea to launch."
        text="Six stages, each with a clear outcome — so you always know what's happening and what we need from you."
      />
      <section className="container-page">
        <ol className="space-y-5">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.03}>
              <li className="grid gap-6 rounded-3xl border border-border bg-card p-8 md:grid-cols-[120px_1fr_1fr_1fr] md:items-start">
                <p className="text-gradient-brand font-display text-5xl font-extrabold">{p.n}</p>
                <div>
                  <h2 className="font-display text-xl font-extrabold">{p.title}</h2>
                  <p className="mt-2 text-muted-foreground">{p.text}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
                    What you do
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{DETAIL[p.n]?.you}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
                    What we do
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{DETAIL[p.n]?.us}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
      <FinalCTA />
    </>
  );
}
