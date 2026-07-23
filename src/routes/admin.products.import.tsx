import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Download, Upload, X } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card } from "@/components/admin/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categoryAdminService } from "@/services/admin/supabase/categories";
import { productAdminService } from "@/services/admin/supabase/products";
import { uploadBulkBatch } from "@/services/admin/supabase/storage";
import { IMPORT_COLUMNS, importRowSchema, type ImportRow } from "@/services/admin/import-schema";
import type { ProductInput } from "@/services/admin/api";

export const Route = createFileRoute("/admin/products/import")({
  ssr: false,
  head: () => ({ meta: [{ title: "Bulk Import — 1KRAFTS Admin" }] }),
  component: Page,
});

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

interface ParsedRow {
  raw: Record<string, unknown>;
  row: ImportRow | null;
  errors: string[];
  imageWarnings: string[];
  include: boolean;
}

function downloadTemplate() {
  const sheet = XLSX.utils.aoa_to_sheet([
    [...IMPORT_COLUMNS],
    [
      "1K-SAR-0099", "", "Example Saree", "sarees", "", "1KRAFTS Atelier",
      "A short description of the piece.", "", "9800", "NPR", "0", "5",
      "Cotton", "Everyday", "", "", "Indigo", "Cotton", "saree, cotton", "new",
      "", "", "example-photo-1.jpg, example-photo-2.jpg", "",
    ],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Products");
  XLSX.writeFile(wb, "1krafts-product-import-template.xlsx");
}

function Content() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const qc = useQueryClient();
  const [parsedRows, setParsedRows] = useState<ParsedRow[] | null>(null);
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  const [uploadingImages, setUploadingImages] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const categorySlugSet = new Set(categories.map((c) => c.slug));

  function validate(raw: Record<string, unknown>, images: Map<string, string>): ParsedRow {
    const parsed = importRowSchema.safeParse(raw);
    if (!parsed.success) {
      return { raw, row: null, errors: parsed.error.issues.map((i) => i.message), imageWarnings: [], include: false };
    }
    const row = parsed.data;
    const errors: string[] = [];
    if (!categorySlugSet.has(row.categorySlug)) errors.push(`Unknown category "${row.categorySlug}"`);

    const imageWarnings: string[] = [];
    for (const name of [...row.images, ...row.gallery]) {
      if (!images.has(name)) imageWarnings.push(`Image not found in uploaded batch: "${name}"`);
    }

    return { raw, row, errors, imageWarnings, include: errors.length === 0 };
  }

  function reparseAll(images: Map<string, string>) {
    setParsedRows((prev) => (prev ? prev.map((p) => validate(p.raw, images)) : prev));
  }

  async function onSpreadsheet(file: File) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    setParsedRows(rows.map((r) => validate(r, imageMap)));
    setResult(null);
  }

  async function onImages(files: FileList) {
    setUploadingImages(true);
    try {
      const map = await uploadBulkBatch(Array.from(files));
      const merged = new Map([...imageMap, ...map]);
      setImageMap(merged);
      reparseAll(merged);
    } finally {
      setUploadingImages(false);
    }
  }

  async function commit() {
    if (!parsedRows) return;
    setCommitting(true);
    setResult(null);
    try {
      const payload: ProductInput[] = parsedRows
        .filter((p) => p.include && p.row)
        .map((p) => rowToProductInput(p.row!, imageMap));
      if (payload.length === 0) {
        setResult("No valid rows selected to import.");
        return;
      }
      const { count } = await productAdminService.bulkUpsert(payload);
      setResult(`Imported ${count} product${count === 1 ? "" : "s"}.`);
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    } catch (err) {
      setResult(err instanceof Error ? `Import failed: ${err.message}` : "Import failed.");
    } finally {
      setCommitting(false);
    }
  }

  const includedCount = parsedRows?.filter((p) => p.include).length ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="For the whole catalog"
        title="Bulk import"
        description="Upload a CSV or Excel file of products, plus the photos it references. Existing products are matched and updated by SKU; new SKUs are created."
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={downloadTemplate} className="admin-btn-ghost">
          <Download size={16} /> Download template
        </button>

        <label className="admin-btn-ghost cursor-pointer">
          <Upload size={16} /> Upload spreadsheet (CSV/XLSX)
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onSpreadsheet(e.target.files[0])}
          />
        </label>

        <label className="admin-btn-ghost cursor-pointer">
          <Upload size={16} /> {uploadingImages ? "Uploading photos…" : `Upload photos (${imageMap.size} uploaded)`}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploadingImages}
            onChange={(e) => e.target.files && onImages(e.target.files)}
          />
        </label>
      </div>

      {imageMap.size > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--walnut-soft)]">
            Uploaded photos — reference these exact file names in the spreadsheet's images/gallery columns
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {Array.from(imageMap.entries()).map(([filename, url]) => (
              <div key={filename} className="group relative w-24">
                <div className="aspect-square overflow-hidden rounded-lg border border-[color:var(--walnut)]/12 bg-[color:var(--sand)]">
                  <img src={url} alt={filename} className="h-full w-full object-cover" />
                </div>
                <p className="mt-1 truncate text-[10px] text-[color:var(--walnut-soft)]" title={filename}>
                  {filename}
                </p>
                <button
                  type="button"
                  aria-label={`Remove ${filename}`}
                  onClick={() => {
                    const next = new Map(imageMap);
                    next.delete(filename);
                    setImageMap(next);
                    reparseAll(next);
                  }}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--walnut)] text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {parsedRows && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-[color:var(--walnut)]">
              Preview — {includedCount} of {parsedRows.length} rows ready to import
            </h2>
            <button onClick={commit} disabled={committing || includedCount === 0} className="admin-btn-primary">
              {committing ? "Importing…" : `Import ${includedCount} product${includedCount === 1 ? "" : "s"}`}
            </button>
          </div>

          {result && <p className="mt-3 text-sm font-medium text-[color:var(--walnut)]">{result}</p>}

          <Card className="mt-4 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                  <TableHead />
                  <TableHead className="text-[color:var(--walnut-soft)]">Status</TableHead>
                  <TableHead className="text-[color:var(--walnut-soft)]">SKU</TableHead>
                  <TableHead className="text-[color:var(--walnut-soft)]">Name</TableHead>
                  <TableHead className="text-[color:var(--walnut-soft)]">Category</TableHead>
                  <TableHead className="text-[color:var(--walnut-soft)]">Price</TableHead>
                  <TableHead className="text-[color:var(--walnut-soft)]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.map((p, i) => (
                  <TableRow key={i} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={p.include}
                        disabled={p.errors.length > 0}
                        onChange={(e) => {
                          const next = [...parsedRows];
                          next[i] = { ...p, include: e.target.checked };
                          setParsedRows(next);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {p.errors.length > 0 ? (
                        <span className="flex items-center gap-1 text-[color:var(--sindoor)]"><AlertCircle size={14} /> Error</span>
                      ) : p.imageWarnings.length > 0 ? (
                        <span className="flex items-center gap-1 text-amber-600"><AlertCircle size={14} /> Warning</span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-700"><CheckCircle2 size={14} /> OK</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[color:var(--walnut)]">{String(p.raw.sku ?? "")}</TableCell>
                    <TableCell className="font-medium text-[color:var(--walnut)]">{String(p.raw.name ?? "")}</TableCell>
                    <TableCell className="text-[color:var(--walnut-soft)]">{String(p.raw.categorySlug ?? "")}</TableCell>
                    <TableCell className="text-[color:var(--walnut-soft)]">{String(p.raw.price ?? "")}</TableCell>
                    <TableCell className="max-w-xs text-xs text-[color:var(--walnut-soft)]">
                      {[...p.errors, ...p.imageWarnings].join("; ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}

function rowToProductInput(row: ImportRow, imageMap: Map<string, string>): ProductInput {
  const toImages = (names: string[]) =>
    names.filter((n) => imageMap.has(n)).map((n) => ({ src: imageMap.get(n)!, alt: row.name }));
  return {
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    categorySlug: row.categorySlug,
    subcategory: row.subcategory || undefined,
    brand: row.brand,
    description: row.description,
    story: row.story || undefined,
    specifications: [],
    images: toImages(row.images),
    gallery: toImages(row.gallery),
    price: row.price,
    currency: row.currency as ProductInput["currency"],
    discount: row.discount,
    stock: row.stock,
    material: row.material,
    occasion: row.occasion,
    weight: row.weight || undefined,
    dimensions: row.dimensions || undefined,
    color: row.color,
    fabric: row.fabric,
    tags: row.tags,
    badges: row.badges as ProductInput["badges"],
    seo: { title: row.seoTitle || row.name, description: row.seoDescription || row.description.slice(0, 160) },
  };
}
