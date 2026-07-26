import { z } from "zod";
import type { ProductBadge, Currency } from "@/types";

export const IMPORT_COLUMNS = [
  "sku",
  "slug",
  "name",
  "categorySlug",
  "subcategory",
  "brand",
  "description",
  "story",
  "price",
  "currency",
  "discount",
  "stock",
  "material",
  "occasion",
  "weight",
  "dimensions",
  "color",
  "fabric",
  "tags",
  "badges",
  "seoTitle",
  "seoDescription",
  "images",
  "gallery",
  "specifications",
] as const;

const CURRENCIES: Currency[] = ["NPR", "USD", "INR"];
const BADGES: ProductBadge[] = ["new", "bestseller", "limited", "wedding", "festival"];

function splitList(v: unknown): string[] {
  if (v == null || v === "") return [];
  return String(v).split(",").map((s) => s.trim()).filter(Boolean);
}

// "Fabric: Katan silk | Length: 6.3 metres | Care: Dry clean only" ->
// [{label:"Fabric", value:"Katan silk"}, ...] — matches how the single
// product admin form's spec rows work, just serialized into one cell.
function parseSpecifications(v: unknown): { label: string; value: string }[] {
  if (v == null || v === "") return [];
  return String(v)
    .split("|")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const idx = chunk.indexOf(":");
      if (idx === -1) return { label: chunk, value: "" };
      return { label: chunk.slice(0, idx).trim(), value: chunk.slice(idx + 1).trim() };
    })
    .filter((s) => s.label);
}

export const importRowSchema = z
  .object({
    sku: z.union([z.string(), z.number()]).transform((v) => String(v).trim()).pipe(z.string().min(1, "SKU is required")),
    slug: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    name: z.union([z.string(), z.number()]).transform((v) => String(v).trim()).pipe(z.string().min(1, "Name is required")),
    categorySlug: z.union([z.string(), z.number()]).transform((v) => String(v).trim()).pipe(z.string().min(1, "Category is required")),
    subcategory: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    brand: z.union([z.string(), z.number()]).optional().transform((v) => (v == null || v === "" ? "1KRAFTS Atelier" : String(v).trim())),
    description: z.union([z.string(), z.number()]).transform((v) => String(v).trim()).pipe(z.string().min(1, "Description is required")),
    story: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    price: z.coerce.number().min(0, "Price must be 0 or more"),
    currency: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v == null || v === "" ? "NPR" : String(v).trim().toUpperCase()))
      .refine((v) => (CURRENCIES as string[]).includes(v), { message: "Currency must be NPR, USD, or INR" }),
    discount: z.coerce.number().optional().default(0),
    stock: z.coerce.number().min(0).default(0),
    material: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    occasion: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    weight: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    dimensions: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    color: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    fabric: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    tags: z.any().transform(splitList),
    badges: z
      .any()
      .transform(splitList)
      .refine((arr) => arr.every((b) => (BADGES as string[]).includes(b)), {
        message: `Badges must be from: ${BADGES.join(", ")}`,
      }),
    seoTitle: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    seoDescription: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v).trim())),
    images: z.any().transform(splitList),
    gallery: z.any().transform(splitList),
    specifications: z.any().transform(parseSpecifications),
  })
  .transform((row) => ({
    ...row,
    slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));

export type ImportRow = z.infer<typeof importRowSchema>;
