import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/lib/services";
import { AdminTitle, Panel } from "@/components/admin-ui";

export const Route = createFileRoute("/admin/services")({ component: Services });

function Services() {
  return (
    <>
      <AdminTitle title="Services" />
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Service pages are written as hand-crafted content so each one stays unique. Ask your
        developer (or Lovable) to change their text, FAQs or related services.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Panel key={s.slug}>
            <div className="flex items-start gap-3">
              <s.icon className="h-5 w-5 text-accent-foreground" />
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.metaDescription}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {s.faqs.length} FAQs · related: {s.related.join(", ")}
                </p>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="mt-2 inline-block text-xs text-accent-foreground"
                >
                  View page
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
