import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/admin.functions";
import { AdminTitle, Panel } from "@/components/admin-ui";
import { formatDate } from "@/lib/posts";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => getDashboardStats(),
  });
  const counts = (data?.enquiries ?? []).reduce<Record<string, number>>(
    (a, e) => ((a[e.status] = (a[e.status] ?? 0) + 1), a),
    {},
  );
  return (
    <>
      <AdminTitle title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel>
          <p className="text-xs text-muted-foreground">New enquiries</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{counts["new"] ?? 0}</p>
        </Panel>
        <Panel>
          <p className="text-xs text-muted-foreground">Total enquiries</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{data?.enquiries.length ?? 0}</p>
        </Panel>
        <Panel>
          <p className="text-xs text-muted-foreground">Published projects</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{data?.published ?? 0}</p>
        </Panel>
        <Panel>
          <p className="text-xs text-muted-foreground">Draft articles</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{data?.drafts ?? 0}</p>
        </Panel>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="flex justify-between">
            <h2 className="font-bold">Recent enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm text-accent-foreground">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {(data?.enquiries ?? []).slice(0, 6).map((e) => (
              <li key={e.id} className="flex justify-between gap-3 py-2.5 text-sm">
                <span>
                  <strong>{e.full_name}</strong>{" "}
                  <span className="text-muted-foreground">· {e.service}</span>
                </span>
                <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                  {e.status}
                </span>
              </li>
            ))}
            {data && data.enquiries.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">No enquiries yet.</li>
            )}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {Object.entries(counts).map(([k, v]) => (
              <span key={k} className="rounded-full border border-border px-2 py-1">
                {k}: {v}
              </span>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="font-bold">Content activity</h2>
          <ul className="mt-4 divide-y divide-border">
            {(data?.recentPosts ?? []).map((p) => (
              <li key={p.id} className="flex justify-between py-2.5 text-sm">
                <span>{p.title}</span>
                <span className="text-muted-foreground">
                  {formatDate(p.updated_at as unknown as string)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
