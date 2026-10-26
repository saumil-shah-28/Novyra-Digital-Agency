import { createFileRoute } from "@tanstack/react-router";
import { listProjects } from "@/lib/data.functions";
import { PageIntro, FinalCTA, ProjectCard, EmptyState } from "@/components/blocks";
import { Reveal } from "@/components/motion";

const T = "Our Work — Websites, Apps & Software Projects | Novyra Digital";
const D =
  "Projects designed and built by Novyra Digital, each labelled as client work, personal project or concept.";

export const Route = createFileRoute("/work/")({
  loader: () => listProjects(),
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/work" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  const projects = Route.useLoaderData();
  return (
    <>
      <PageIntro
        eyebrow="Work"
        title="Selected projects."
        text="We label every project honestly — client work, personal project or concept — and never invent results."
      />
      <section className="container-page grid gap-6 md:grid-cols-2">
        {projects.length === 0 && (
          <div className="md:col-span-2">
            <EmptyState
              title="Case studies coming soon"
              text="Detailed write-ups are being prepared."
            />
          </div>
        )}
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 0.08}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </section>
      <FinalCTA />
    </>
  );
}
