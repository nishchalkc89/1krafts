import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutGrid, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card, EmptyState, IconButton, Field } from "@/components/admin/ui";
import { ConfirmDialog, useConfirmDelete } from "@/components/admin/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categoryAdminService } from "@/services/admin/supabase/categories";
import type { Category } from "@/types";

export const Route = createFileRoute("/admin/categories/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Categories — 1KRAFTS Admin" }] }),
  component: Page,
});

const categoriesQuery = queryOptions({ queryKey: ["admin", "categories"], queryFn: () => categoryAdminService.list() });

function Page() {
  return (
    <AdminGuard>
      <AdminShell>
        <CategoriesContent />
      </AdminShell>
    </AdminGuard>
  );
}

function CategoriesContent() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const del = useConfirmDelete<Category>();

  async function remove(category: Category) {
    await categoryAdminService.remove(category.slug);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Collections"
        title="Categories"
        description="The studios shown across the storefront."
        action={
          <button onClick={() => setEditing("new")} className="admin-btn-primary">
            <Plus size={16} /> New category
          </button>
        }
      />

      <Card className="mt-8 overflow-hidden">
        {categories.length === 0 ? (
          <EmptyState icon={<LayoutGrid size={28} />} title="No categories yet" description="Add your first collection to get started." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                <TableHead className="text-[color:var(--walnut-soft)]">Order</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Name</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Slug</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Tagline</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Featured</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.slug} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                  <TableCell className="text-[color:var(--walnut-soft)]">{c.order}</TableCell>
                  <TableCell className="font-medium text-[color:var(--walnut)]">{c.name}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{c.slug}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{c.tagline}</TableCell>
                  <TableCell>
                    {c.featured && <span className="rounded-full bg-[color:var(--brass)]/15 px-2.5 py-0.5 text-xs font-semibold text-[color:var(--ember)]">Featured</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <IconButton onClick={() => setEditing(c)} title="Edit"><Pencil size={14} /></IconButton>
                      <IconButton onClick={() => del.ask(c)} variant="danger" title="Delete"><Trash2 size={14} /></IconButton>
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
            <DialogTitle className="font-display text-xl">{editing === "new" ? "New category" : `Edit ${(editing as Category)?.name ?? ""}`}</DialogTitle>
          </DialogHeader>
          {editing !== null && (
            <CategoryForm
              initial={editing === "new" ? null : editing}
              onDone={() => {
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["admin", "categories"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={del.pending !== null}
        onOpenChange={(open) => !open && del.clear()}
        title={`Delete "${del.pending?.name}"?`}
        description="This removes it from the storefront immediately. This can't be undone."
        onConfirm={() => del.pending && remove(del.pending)}
      />
    </div>
  );
}

function CategoryForm({ initial, onDone }: { initial: Category | null; onDone: () => void }) {
  const [form, setForm] = useState<Category>(
    initial ?? { slug: "", name: "", tagline: "", description: "", image: "", featured: false, order: 1 },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (initial) await categoryAdminService.update(initial.slug, form);
      else await categoryAdminService.create(form);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Slug (URL, e.g. sarees)">
        <input
          required
          disabled={!!initial}
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Name">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
      </Field>
      <Field label="Tagline">
        <input required value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input" />
      </Field>
      <Field label="Description">
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Image URL">
        <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" />
      </Field>
      <div className="flex items-center gap-6">
        <Field label="Order">
          <input
            type="number"
            required
            value={form.order}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="input"
          />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-[color:var(--walnut)]">
          <input
            type="checkbox"
            checked={form.featured ?? false}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured on home page
        </label>
      </div>
      {error && <p className="text-sm text-[color:var(--sindoor)]">{error}</p>}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full justify-center py-2.5">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
