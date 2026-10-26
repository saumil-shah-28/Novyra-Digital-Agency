import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAdminSettings, updateSettings } from "@/lib/admin.functions";
import { AdminTitle, F, Panel, aField } from "@/components/admin-ui";
import { btn } from "@/components/brand";

export const Route = createFileRoute("/admin/settings")({ component: Settings });

const TEXT_FIELDS = [
  ["contact_email", "Contact email"],
  ["contact_phone", "Phone"],
  ["whatsapp_number", "WhatsApp number (with country code)"],
  ["service_area", "Service area"],
  ["social_instagram", "Instagram URL"],
  ["social_linkedin", "LinkedIn URL"],
  ["social_github", "GitHub URL"],
  ["social_x", "X URL"],
  ["analytics_id", "Google Analytics ID (G-…)"],
] as const;

function Settings() {
  const router = useRouter();
  const { data, refetch } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAdminSettings(),
  });
  if (!data) return <p className="text-sm text-muted-foreground">Loading…</p>;
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const patch: Record<string, unknown> = {
      announcement_enabled: fd.get("announcement_enabled") === "on",
      announcement_text: String(fd.get("announcement_text")),
      default_meta_description: String(fd.get("default_meta_description")) || null,
    };
    for (const [k] of TEXT_FIELDS) patch[k] = String(fd.get(k) ?? "").trim() || null;
    if (!patch["service_area"]) patch["service_area"] = "Ahmedabad, Gujarat, India";
    try {
      await updateSettings({ data: patch });
    } catch {
      toast.error("Could not save");
      return;
    }
    toast.success("Settings saved");
    refetch();
    router.invalidate();
  }
  return (
    <>
      <AdminTitle title="Settings" />
      <form onSubmit={save} className="space-y-4">
        <Panel className="space-y-3">
          <h2 className="font-bold">Announcement bar</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="announcement_enabled"
              defaultChecked={data.announcement_enabled}
            />{" "}
            Show announcement
          </label>
          <F label="Text">
            <input
              name="announcement_text"
              defaultValue={data.announcement_text}
              className={aField}
            />
          </F>
        </Panel>
        <Panel className="grid gap-4 md:grid-cols-2">
          <h2 className="font-bold md:col-span-2">Contact, social and integrations</h2>
          {TEXT_FIELDS.map(([k, label]) => (
            <F key={k} label={label}>
              <input
                name={k}
                defaultValue={(data[k as keyof typeof data] as string | null) ?? ""}
                className={aField}
              />
            </F>
          ))}
          <F label="Default meta description" className="md:col-span-2">
            <textarea
              name="default_meta_description"
              defaultValue={data.default_meta_description ?? ""}
              className={aField}
              rows={2}
            />
          </F>
        </Panel>
        <button className={btn()}>Save settings</button>
      </form>
    </>
  );
}
