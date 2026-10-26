import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { deletePost, listAllPosts, savePost } from "@/lib/admin.functions";
import type { Post } from "../../drizzle/schema";
import { AdminTitle, F, Panel, aField, slugify } from "@/components/admin-ui";
import { Markdown } from "@/components/blocks";
import { btn } from "@/components/brand";

export const Route = createFileRoute("/admin/blog")({ component: Blog });

function Blog() {
  const [editing, setEditing] = useState<Post | "new" | null>(null);
  const { data = [] } = useQuery({ queryKey: ["admin", "posts"], queryFn: () => listAllPosts() });
  return (
    <>
      <AdminTitle title="Blog">
        <button onClick={() => setEditing("new")} className={btn({ size: "sm" })}>
          <Plus className="h-4 w-4" /> New article
        </button>
      </AdminTitle>
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <Panel className="p-2">
          {data.map((p) => (
            <button
              key={p.id}
              onClick={() => setEditing(p)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent"
            >
              <span className="line-clamp-1 font-semibold">{p.title}</span>
              <span
                className={`shrink-0 text-xs ${p.status === "published" ? "text-success" : "text-muted-foreground"}`}
              >
                {p.status}
              </span>
            </button>
          ))}
        </Panel>
        {editing && (
          <PostForm
            key={editing === "new" ? "new" : editing.id}
            p={editing === "new" ? null : editing}
            onDone={() => setEditing(null)}
          />
        )}
      </div>
    </>
  );
}

function PostForm({ p, onDone }: { p: Post | null; onDone: () => void }) {
  const qc = useQueryClient();
  const [body, setBody] = useState(p?.body ?? "");
  const [preview, setPreview] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title")).trim();
    const status = String(fd.get("status")) as "draft" | "published";
    const pub = String(fd.get("published_at"));
    const row = {
      ...(p?.id ? { id: p.id } : {}),
      title,
      slug: slugify(String(fd.get("slug") || title)),
      excerpt: String(fd.get("excerpt")),
      category: String(fd.get("category")) || "Guides",
      tags: String(fd.get("tags"))
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      author_name: String(fd.get("author_name")) || "Novyra Digital",
      seo_title: String(fd.get("seo_title")) || null,
      seo_description: String(fd.get("seo_description")) || null,
      body,
      status,
      published_at: pub
        ? new Date(pub).toISOString()
        : status === "published"
          ? new Date().toISOString()
          : null,
    };
    if (!title) {
      toast.error("Title is required");
      return;
    }
    const res = await savePost({ data: row });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin"] });
    onDone();
  }
  async function remove() {
    if (!p || !confirm("Delete this article?")) return;
    await deletePost({ data: { id: p.id } });
    qc.invalidateQueries({ queryKey: ["admin"] });
    onDone();
  }

  return (
    <Panel>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
        <F label="Title" className="md:col-span-2">
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
        <F label="Category">
          <input name="category" defaultValue={p?.category ?? "Guides"} className={aField} />
        </F>
        <F label="Excerpt" className="md:col-span-2">
          <input name="excerpt" defaultValue={p?.excerpt} className={aField} />
        </F>
        <div className="md:col-span-2">
          <div className="flex gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={!preview ? "text-accent-foreground" : "text-muted-foreground"}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={preview ? "text-accent-foreground" : "text-muted-foreground"}
            >
              Preview
            </button>
          </div>
          {preview ? (
            <div className="mt-2 rounded-lg border border-border p-4">
              <Markdown>{body}</Markdown>
            </div>
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              className={`${aField} font-mono`}
              aria-label="Article body (Markdown)"
            />
          )}
        </div>
        <F label="Tags (comma separated)">
          <input name="tags" defaultValue={p?.tags.join(", ")} className={aField} />
        </F>
        <F label="Author">
          <input
            name="author_name"
            defaultValue={p?.author_name ?? "Novyra Digital"}
            className={aField}
          />
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
        <F label="Status">
          <select name="status" defaultValue={p?.status ?? "draft"} className={aField}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </F>
        <F label="Publication date">
          <input
            name="published_at"
            type="datetime-local"
            defaultValue={p?.published_at ? (p.published_at as unknown as string).slice(0, 16) : ""}
            className={aField}
          />
        </F>
        <div className="flex gap-2 md:col-span-2">
          <button className={btn({ size: "sm" })}>Save article</button>
          <button type="button" onClick={onDone} className={btn({ variant: "ghost", size: "sm" })}>
            Cancel
          </button>
          {p && (
            <button
              type="button"
              onClick={remove}
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
