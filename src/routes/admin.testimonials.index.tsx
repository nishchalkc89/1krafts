import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Quote, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card, EmptyState, IconButton, Field } from "@/components/admin/ui";
import { ConfirmDialog, useConfirmDelete } from "@/components/admin/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { testimonialAdminService } from "@/services/admin/supabase/testimonials";
import type { TestimonialInput } from "@/services/admin/api";
import type { Testimonial } from "@/types";

export const Route = createFileRoute("/admin/testimonials/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Testimonials — 1KRAFTS Admin" }] }),
  component: Page,
});

const testimonialsQuery = queryOptions({ queryKey: ["admin", "testimonials"], queryFn: () => testimonialAdminService.list() });

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
  const { data } = useSuspenseQuery(testimonialsQuery);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Testimonial | "new" | null>(null);
  const del = useConfirmDelete<Testimonial>();

  async function remove(testimonial: Testimonial) {
    await testimonialAdminService.remove(testimonial.id);
    qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Kept by them"
        title="Testimonials"
        description="Words from people who wear the house."
        action={
          <button onClick={() => setEditing("new")} className="admin-btn-primary">
            <Plus size={16} /> New testimonial
          </button>
        }
      />

      <Card className="mt-8 overflow-hidden">
        {data.length === 0 ? (
          <EmptyState icon={<Quote size={28} />} title="No testimonials yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                <TableHead className="text-[color:var(--walnut-soft)]">Name</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Location</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Rating</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Quote</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((t) => (
                <TableRow key={t.id} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                  <TableCell className="font-medium text-[color:var(--walnut)]">{t.name}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{t.location}</TableCell>
                  <TableCell className="text-[color:var(--brass)]">{"★".repeat(t.rating)}</TableCell>
                  <TableCell className="max-w-md truncate text-[color:var(--walnut-soft)]">{t.quote}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <IconButton onClick={() => setEditing(t)} title="Edit"><Pencil size={14} /></IconButton>
                      <IconButton onClick={() => del.ask(t)} variant="danger" title="Delete"><Trash2 size={14} /></IconButton>
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
            <DialogTitle className="font-display text-xl">{editing === "new" ? "New testimonial" : "Edit testimonial"}</DialogTitle>
          </DialogHeader>
          {editing !== null && (
            <TestimonialForm
              initial={editing === "new" ? null : editing}
              onDone={() => {
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={del.pending !== null}
        onOpenChange={(open) => !open && del.clear()}
        title={`Delete testimonial from "${del.pending?.name}"?`}
        description="This removes it from the storefront immediately. This can't be undone."
        onConfirm={() => del.pending && remove(del.pending)}
      />
    </div>
  );
}

function TestimonialForm({ initial, onDone }: { initial: Testimonial | null; onDone: () => void }) {
  const [form, setForm] = useState<TestimonialInput>(
    initial ?? { name: "", location: "", quote: "", rating: 5, productRef: undefined },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (initial) await testimonialAdminService.update(initial.id, form);
      else await testimonialAdminService.create(form);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Name">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
      </Field>
      <Field label="Location">
        <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
      </Field>
      <Field label="Quote">
        <textarea required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="input" />
      </Field>
      <Field label="Rating (1–5)">
        <input
          type="number"
          min={1}
          max={5}
          required
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          className="input"
        />
      </Field>
      {error && <p className="text-sm text-[color:var(--sindoor)]">{error}</p>}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full justify-center py-2.5">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
