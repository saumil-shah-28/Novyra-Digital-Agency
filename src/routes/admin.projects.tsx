import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { deleteProject, listAllProjects, saveProject } from "@/lib/admin.functions";
import type { Project } from "../../drizzle/schema";
import { AdminTitle, F, Panel, aField, slugify } from "@/components/admin-ui";
import { btn } from "@/components/brand";
import { uploadMedia } from "@/lib/media";

export const Route = createFileRoute("/admin/projects")({ component: Projects });

const TYPES = ["Client project", "Personal project", "Prototype", "Concept"];

function Projects() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => listAllProjects(),
  });
  const del = useMutation({
    mutationFn: (id: string) => deleteProject({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin"] });
      setEditing(null);
    },
  });
  return (
    <>
      <AdminTitle title="Projects">
        <button onClick={() => setEditing("new")} className={btn({ size: "sm" })}>
          <Plus className="h-4 w-4" /> New project
        </button>
      </AdminTitle>
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <Panel className="p-2">
          {data.map((p) => (
            <button
              key={p.id}
              onClick={() => setEditing(p)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent"
            >
              <span className="font-semibold">{p.title}</span>
              <span className={`text-xs ${p.published ? "text-success" : "text-muted-foreground"}`}>
                {p.published ? "Published" : "Draft"}
              </span>
            </button>
          ))}
          {data.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No projects yet.</p>
          )}
        </Panel>
        {editing && (
          <ProjectForm
            key={editing === "new" ? "new" : editing.id}
            p={editing === "new" ? null : editing}
            onDone={() => setEditing(null)}
            onDelete={(id) => confirm("Delete this project?") && del.mutate(id)}
          />
        )}
      </div>
    </>
  );
}

function ProjectForm({
  p,
  onDone,
  onDelete,
}: {
  p: Project | null;
  onDone: () => void;
  onDelete: (id: string) => void;
}) {
  const qc = useQueryClient();
  const [cover, setCover] = useState(p?.cover_url ?? "");
  const [gallery, setGallery] = useState<string[]>(p?.gallery ?? []);
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | null, target: "cover" | "gallery") {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const url = await uploadMedia(f);
        if (target === "cover") setCover(url);
        else setGallery((g) => [...g, url]);
      }
    } catch (e) {
      toast.error((e as Error).message);
    }
    setBusy(false);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title")).trim();
    const row = {
      ...(p?.id ? { id: p.id } : {}),
      title,
      slug: slugify(String(fd.get("slug") || title)),
      project_type: String(fd.get("project_type")),
      category: String(fd.get("category")),
      summary: String(fd.get("summary")),
      body: String(fd.get("body")),
      technologies: String(fd.get("technologies"))
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      live_url: String(fd.get("live_url")) || null,
      seo_title: String(fd.get("seo_title")) || null,
      seo_description: String(fd.get("seo_description")) || null,
      published: fd.get("published") === "on",
      sort_order: Number(fd.get("sort_order") || 0),
      cover_url: cover || null,
      gallery,
    };
    if (!row.title || !row.slug) {
      toast.error("Title is required");
      return;
    }
    const res = await saveProject({ data: row });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin"] });
    onDone();
  }

  return (
    <Panel>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
        <F label="Title">
          <input name="title" defaultValue={p?.title} className={aField} required />
        </F>
        <F label="Slug">
          <input
            name="slug"
            defaultValue={p?.slug}
            className={aField}
            placeholder="auto from title"
          />
        </F>
        <F label="Type">
          <select
            name="project_type"
            defaultValue={p?.project_type ?? "Personal project"}
            className={aField}
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </F>
        <F label="Category">
          <input
            name="category"
            defaultValue={p?.category}
            className={aField}
            placeholder="e.g. E-commerce"
          />
        </F>
        <F label="Short summary" className="md:col-span-2">
          <input name="summary" defaultValue={p?.summary} className={aField} />
        </F>
        <F label="Case study (Markdown)" className="md:col-span-2">
          <textarea name="body" rows={8} defaultValue={p?.body} className={aField} />
        </F>
        <F label="Technologies (comma separated)">
          <input name="technologies" defaultValue={p?.technologies.join(", ")} className={aField} />
        </F>
        <F label="Live URL">
          <input name="live_url" type="url" defaultValue={p?.live_url ?? ""} className={aField} />
        </F>
        <F label="SEO title">
          <input name="seo_title" defaultValue={p?.seo_title ?? ""} className={aField} />
        </F>
        <F label="SEO description">
          <input
            name="seo_description"
            defaultValue={p?.seo_description ?? ""}
            className={aField}
          />
        </F>
        <F label="Sort order">
          <input
            name="sort_order"
            type="number"
            defaultValue={p?.sort_order ?? 0}
            className={aField}
          />
        </F>
        <label className="flex items-center gap-2 self-end text-sm font-semibold">
          <input type="checkbox" name="published" defaultChecked={p?.published} /> Published
        </label>
        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-muted-foreground">Cover image</p>
          {cover && (
            <img
              src={cover}
              alt="Cover preview"
              className="mt-2 h-32 rounded-lg border border-border object-cover"
            />
          )}
          <label
            className={btn({ variant: "outline", size: "sm", className: "mt-2 cursor-pointer" })}
          >
            <Upload className="h-4 w-4" /> Upload cover
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => upload(e.target.files, "cover")}
            />
          </label>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-muted-foreground">Gallery (images or videos)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {gallery.map((g) => (
              <div key={g} className="relative">
                <img
                  src={g}
                  alt=""
                  className="h-20 w-28 rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => setGallery(gallery.filter((x) => x !== g))}
                  className="absolute right-1 top-1 rounded-full bg-background p-1"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <label
            className={btn({ variant: "outline", size: "sm", className: "mt-2 cursor-pointer" })}
          >
            <Upload className="h-4 w-4" /> Add files
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm"
              hidden
              onChange={(e) => upload(e.target.files, "gallery")}
            />
          </label>
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button className={btn({ size: "sm" })} disabled={busy}>
            Save project
          </button>
          <button type="button" onClick={onDone} className={btn({ variant: "ghost", size: "sm" })}>
            Cancel
          </button>
          {p && (
            <button
              type="button"
              onClick={() => onDelete(p.id)}
              className={btn({
                variant: "ghost",
                size: "sm",
                className: "ml-auto text-destructive",
              })}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </Panel>
  );
}
