import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { listEnquiries, updateEnquiry } from "@/lib/admin.functions";
import type { Enquiry } from "../../drizzle/schema";
import { AdminTitle, Panel, aField } from "@/components/admin-ui";
import { btn } from "@/components/brand";
import { formatDate } from "@/lib/posts";

type Status = Enquiry["status"];
const STATUSES: Status[] = ["new", "contacted", "qualified", "won", "lost", "spam"];

export const Route = createFileRoute("/admin/enquiries")({ component: Enquiries });

function Enquiries() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | Status>("");
  const [selected, setSelected] = useState<string | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: () => listEnquiries(),
  });
  const update = useMutation({
    mutationFn: (p: { id: string; status?: Status; notes?: string }) => updateEnquiry({ data: p }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: () => toast.error("Could not save"),
  });
  const rows = useMemo(
    () =>
      data.filter(
        (e) =>
          (!status || e.status === status) &&
          (!q ||
            `${e.full_name} ${e.email} ${e.business_name ?? ""} ${e.service}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [data, q, status],
  );
  const sel = data.find((e) => e.id === selected);

  function exportCsv() {
    const cols = [
      "created_at",
      "full_name",
      "business_name",
      "email",
      "whatsapp",
      "service",
      "budget",
      "timeline",
      "status",
      "description",
    ] as const;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join(
      "\n",
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "enquiries.csv" });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminTitle title="Enquiries">
        <button onClick={exportCsv} className={btn({ variant: "outline", size: "sm" })}>
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </AdminTitle>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search name, email, service…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${aField} max-w-xs`}
          aria-label="Search enquiries"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | "")}
          className={`${aField} max-w-[180px]`}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Panel className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Service</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e.id)}
                  className={`cursor-pointer hover:bg-accent/50 ${selected === e.id ? "bg-accent/60" : ""}`}
                >
                  <td className="p-3">
                    <button className="text-left font-semibold">{e.full_name}</button>
                    <div className="text-xs text-muted-foreground">{e.email}</div>
                  </td>
                  <td className="p-3">{e.service}</td>
                  <td className="p-3">{e.budget}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      {e.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(e.created_at as unknown as string)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No enquiries match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>
        {sel && (
          <Panel key={sel.id}>
            <h2 className="font-display text-lg font-bold">{sel.full_name}</h2>
            <p className="text-sm text-muted-foreground">{sel.business_name}</p>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div>
                <dt className="inline text-muted-foreground">Email: </dt>
                <dd className="inline">
                  <a href={`mailto:${sel.email}`} className="text-accent-foreground">
                    {sel.email}
                  </a>
                </dd>
              </div>
              {sel.whatsapp && (
                <div>
                  <dt className="inline text-muted-foreground">WhatsApp: </dt>
                  <dd className="inline">{sel.whatsapp}</dd>
                </div>
              )}
              <div>
                <dt className="inline text-muted-foreground">Timeline: </dt>
                <dd className="inline">{sel.timeline}</dd>
              </div>
            </dl>
            <p className="mt-4 whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">
              {sel.description}
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(ev) => {
                ev.preventDefault();
                const fd = new FormData(ev.currentTarget);
                update.mutate({
                  id: sel.id,
                  status: fd.get("status") as Status,
                  notes: String(fd.get("notes") ?? ""),
                });
              }}
            >
              <select
                name="status"
                defaultValue={sel.status}
                className={aField}
                aria-label="Status"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <textarea
                name="notes"
                defaultValue={sel.notes ?? ""}
                rows={4}
                placeholder="Private notes"
                className={aField}
                aria-label="Private notes"
              />
              <button className={btn({ size: "sm" })} disabled={update.isPending}>
                Save
              </button>
            </form>
          </Panel>
        )}
      </div>
    </>
  );
}
