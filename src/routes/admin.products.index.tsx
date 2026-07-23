import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card, EmptyState, IconButton, Field } from "@/components/admin/ui";
import { ConfirmDialog, useConfirmDelete } from "@/components/admin/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { productAdminService } from "@/services/admin/supabase/products";
import { categoryAdminService } from "@/services/admin/supabase/categories";
import { uploadMedia } from "@/services/admin/supabase/storage";
import type { ProductInput } from "@/services/admin/api";
import type { Currency, Product, ProductBadge, ProductImage } from "@/types";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/products/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Products — 1KRAFTS Admin" }] }),
  component: Page,
});

const productsQuery = queryOptions({ queryKey: ["admin", "products"], queryFn: () => productAdminService.list() });
const categoriesQuery = queryOptions({ queryKey: ["admin", "categories"], queryFn: () => categoryAdminService.list() });

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
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const del = useConfirmDelete<Product>();

  async function remove(product: Product) {
    await productAdminService.remove(product.id);
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  }

  return (
    <div>
      <PageHeader
        eyebrow="The Latest"
        title="Products"
        description={`${products.length} piece${products.length === 1 ? "" : "s"} in the catalog.`}
        action={
          <button onClick={() => setEditing("new")} className="admin-btn-primary">
            <Plus size={16} /> New product
          </button>
        }
      />

      <Card className="mt-8 overflow-hidden">
        {products.length === 0 ? (
          <EmptyState icon={<Package size={28} />} title="No products yet" description="Add one, or use Bulk Import to add many at once." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                <TableHead className="text-[color:var(--walnut-soft)]">Name</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">SKU</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Category</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Price</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Stock</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                  <TableCell className="font-medium text-[color:var(--walnut)]">{p.name}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{p.sku}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{p.categorySlug}</TableCell>
                  <TableCell className="font-mono text-[color:var(--brass)]">{formatPrice(p.price, p.currency)}</TableCell>
                  <TableCell className={p.stock <= 3 ? "font-semibold text-[color:var(--sindoor)]" : "text-[color:var(--walnut-soft)]"}>
                    {p.stock}
                  </TableCell>
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
        <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto sm:w-full">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing === "new" ? "New product" : `Edit ${(editing as Product)?.name ?? ""}`}</DialogTitle>
          </DialogHeader>
          {editing !== null && (
            <ProductForm
              initial={editing === "new" ? null : editing}
              categories={categories}
              onDone={() => {
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["admin", "products"] });
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

const CURRENCIES: Currency[] = ["NPR", "USD", "INR"];
const BADGES: ProductBadge[] = ["new", "bestseller", "limited", "wedding", "festival"];

function blankProduct(): ProductInput {
  return {
    slug: "",
    name: "",
    sku: "",
    categorySlug: "",
    subcategory: "",
    brand: "1KRAFTS Atelier",
    description: "",
    story: "",
    specifications: [],
    images: [],
    gallery: [],
    price: 0,
    currency: "NPR",
    discount: 0,
    stock: 0,
    material: "",
    occasion: "",
    weight: "",
    dimensions: "",
    color: "",
    fabric: "",
    tags: [],
    badges: [],
    seo: { title: "", description: "" },
  };
}

function ProductForm({
  initial,
  categories,
  onDone,
}: {
  initial: Product | null;
  categories: { slug: string; name: string }[];
  onDone: () => void;
}) {
  const [form, setForm] = useState<ProductInput>(initial ?? blankProduct());
  const [tagsText, setTagsText] = useState(form.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: ProductInput = {
      ...form,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (initial) await productAdminService.update(initial.id, payload);
      else await productAdminService.create(payload);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        </Field>
        <Field label="Slug (URL)">
          <input required disabled={!!initial} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" />
        </Field>
        <Field label="SKU">
          <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" />
        </Field>
        <Field label="Category">
          <select required value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="input">
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
      </Field>
      <Field label="Story (optional)">
        <textarea rows={2} value={form.story ?? ""} onChange={(e) => setForm({ ...form, story: e.target.value })} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Price">
          <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Currency">
          <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })} className="input">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Stock">
          <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Discount">
          <input type="number" value={form.discount ?? 0} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Material"><input required value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="input" /></Field>
        <Field label="Fabric"><input required value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className="input" /></Field>
        <Field label="Color"><input required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input" /></Field>
        <Field label="Occasion"><input required value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} className="input" /></Field>
      </div>

      <Field label="Tags (comma-separated)">
        <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="input" />
      </Field>

      <Field label="Badges">
        <div className="flex flex-wrap gap-3 pt-1">
          {BADGES.map((b) => (
            <label key={b} className="flex items-center gap-1.5 text-sm capitalize">
              <input
                type="checkbox"
                checked={(form.badges ?? []).includes(b)}
                onChange={(e) => {
                  const next = new Set(form.badges ?? []);
                  if (e.target.checked) next.add(b); else next.delete(b);
                  setForm({ ...form, badges: Array.from(next) });
                }}
              />
              {b}
            </label>
          ))}
        </div>
      </Field>

      <ImageListField
        label="Images"
        images={form.images}
        onChange={(images) => setForm({ ...form, images })}
      />
      <ImageListField
        label="Gallery"
        images={form.gallery}
        onChange={(gallery) => setForm({ ...form, gallery })}
      />

      <SpecsField specifications={form.specifications} onChange={(specifications) => setForm({ ...form, specifications })} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="SEO title">
          <input value={form.seo.title} onChange={(e) => setForm({ ...form, seo: { ...form.seo, title: e.target.value } })} className="input" />
        </Field>
        <Field label="SEO description">
          <input value={form.seo.description} onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })} className="input" />
        </Field>
      </div>

      {error && <p className="text-sm text-[color:var(--sindoor)]">{error}</p>}
      <button type="submit" disabled={saving} className="admin-btn-primary w-full justify-center py-2.5">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

function ImageListField({
  label,
  images,
  onChange,
}: {
  label: string;
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const src = await uploadMedia(file, "products");
      onChange([...images, { src, alt: "" }]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--walnut-soft)]">{label}</span>
      <div className="mt-1.5 space-y-2">
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-2">
            <img src={img.src} alt="" className="h-12 w-12 rounded-md object-cover" />
            <input
              value={img.alt}
              placeholder="Alt text"
              onChange={(e) => {
                const next = [...images];
                next[i] = { ...next[i], alt: e.target.value };
                onChange(next);
              }}
              className="input flex-1"
            />
            <IconButton onClick={() => onChange(images.filter((_, j) => j !== i))} variant="danger" title="Remove">
              <X size={14} />
            </IconButton>
          </div>
        ))}
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-[color:var(--walnut)]/25 px-3 py-2 text-sm text-[color:var(--walnut-soft)] hover:border-[color:var(--brass)]">
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

function SpecsField({
  specifications,
  onChange,
}: {
  specifications: { label: string; value: string }[];
  onChange: (specs: { label: string; value: string }[]) => void;
}) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--walnut-soft)]">Specifications</span>
      <div className="mt-1.5 space-y-2">
        {specifications.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              placeholder="Label"
              value={s.label}
              onChange={(e) => {
                const next = [...specifications];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
              className="input"
            />
            <input
              placeholder="Value"
              value={s.value}
              onChange={(e) => {
                const next = [...specifications];
                next[i] = { ...next[i], value: e.target.value };
                onChange(next);
              }}
              className="input"
            />
            <IconButton onClick={() => onChange(specifications.filter((_, j) => j !== i))} variant="danger" title="Remove">
              <X size={14} />
            </IconButton>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...specifications, { label: "", value: "" }])}
          className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--walnut-soft)] hover:text-[color:var(--sindoor)]"
        >
          <Plus size={14} /> Add spec
        </button>
      </div>
    </div>
  );
}
