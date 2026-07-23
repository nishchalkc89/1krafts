import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card, EmptyState, IconButton, Field } from "@/components/admin/ui";
import { ConfirmDialog, useConfirmDelete } from "@/components/admin/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { journalAdminService } from "@/services/admin/supabase/journal";
import type { JournalPost } from "@/types";

export const Route = createFileRoute("/admin/journal/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Journal — 1KRAFTS Admin" }] }),
  component: Page,
});

const journalQuery = queryOptions({ queryKey: ["admin", "journal"], queryFn: () => journalAdminService.list() });

function Page() {
  return (
    <AdminGuard>
      <AdminShell>
        <Content />
      </AdminShell>
    </AdminGuard>
  );
}

function Content() {
  const { data } = useSuspenseQuery(journalQuery);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<JournalPost | "new" | null>(null);
  const del = useConfirmDelete<JournalPost>();

  async function remove(post: JournalPost) {
    await journalAdminService.remove(post.slug);
    qc.invalidateQueries({ queryKey: ["admin", "journal"] });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Slow reading"
        title="Journal"
        description="Essays from the atelier."
        action={
          <button onClick={() => setEditing("new")} className="admin-btn-primary">
            <Plus size={16} /> New post
          </button>
        }
      />

      <Card className="mt-8 overflow-hidden">
        {data.length === 0 ? (
          <EmptyState icon={<Newspaper size={28} />} title="No posts yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                <TableHead className="text-[color:var(--walnut-soft)]">Title</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Category</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Author</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Published</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.slug} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                  <TableCell className="font-medium text-[color:var(--walnut)]">{p.title}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{p.category}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{p.author}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{new Date(p.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <IconButton onClick={() => setEditing(p)} title="Edit"><Pencil size={14} /></IconButton>
                      <IconButton onClick={() => del.ask(p)} variant="danger" title="Delete"><Trash2 size={14} /></IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] overflow-y-auto sm:w-full">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing === "new" ? "New post" : "Edit post"}</DialogTitle>
          </DialogHeader>
          {editing !== null && (
            <JournalForm
              initial={editing === "new" ? null : editing}
              onDone={() => {
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["admin", "journal"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={del.pending !== null}
        onOpenChange={(open) => !open && del.clear()}
        title={`Delete "${del.pending?.title}"?`}
        description="This removes it from the storefront immediately. This can't be undone."
        onConfirm={() => del.pending && remove(del.pending)}
      />
    </div>
  );
}

function JournalForm({ initial, onDone }: { initial: JournalPost | null; onDone: () => void }) {
  const [form, setForm] = useState<JournalPost>(
    initial ?? {
      slug: "",
      title: "",
      excerpt: "",
      category: "",
      cover: "",
      author: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      body: "",
    },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (initial) await journalAdminService.update(initial.slug, form);
      else await journalAdminService.create(form);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Slug (URL)">
        <input
          required
          disabled={!!initial}
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Title">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
      </Field>
      <Field label="Excerpt">
        <textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="input" />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Category">
          <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" />
        </Field>
        <Field label="Author">
          <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input" />
        </Field>
      </div>
      <Field label="Cover image URL">
        <input required value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} className="input" />
      </Field>
      <Field label="Published date">
        <input
          type="date"
          required
          value={form.publishedAt.slice(0, 10)}
          onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Body">
        <textarea required rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input" />
      </Field>
      {error && <p className="text-sm text-[color:var(--sindoor)]">{error}</p>}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full justify-center py-2.5">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
