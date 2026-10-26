import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { deleteMediaFile, listMedia } from "@/lib/admin.functions";
import { AdminTitle, Panel } from "@/components/admin-ui";
import { btn } from "@/components/brand";
import { uploadMedia } from "@/lib/media";

export const Route = createFileRoute("/admin/media")({ component: Media });

function Media() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => listMedia(),
  });
  async function upload(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      try {
        await uploadMedia(f);
      } catch (e) {
        toast.error(`${f.name}: ${(e as Error).message}`);
      }
    }
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["admin", "media"] });
  }
  async function remove(path: string) {
    if (!confirm("Delete this file? Pages using it will show a broken image.")) return;
    await deleteMediaFile({ data: { path } });
    qc.invalidateQueries({ queryKey: ["admin", "media"] });
  }
  return (
    <>
      <AdminTitle title="Media">
        <label className={btn({ size: "sm", className: "cursor-pointer" })}>
          <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            multiple
            hidden
            accept="image/*,video/mp4,video/webm"
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </AdminTitle>
      <p className="mb-4 text-sm text-muted-foreground">
        Images and videos up to 25 MB (JPG, PNG, WebP, AVIF, GIF, MP4, WebM). Stored in Firebase
        Storage.
      </p>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data.length === 0 ? (
        <Panel>
          <p className="text-center text-sm text-muted-foreground">No media uploaded yet.</p>
        </Panel>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          {data.map((m) => (
            <Panel key={m.path} className="p-2">
              {m.video ? (
                <video src={m.url} className="aspect-square w-full rounded-lg object-cover" muted />
              ) : (
                <img
                  src={m.url}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover"
                  loading="lazy"
                />
              )}
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(m.url).then(() => toast.success("Link copied"))
                  }
                  aria-label="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(m.path)}
                  aria-label="Delete"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
