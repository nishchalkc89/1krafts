import Fuse from "fuse.js";
import type { Paginated, Product, ProductFilter } from "@/types";
import type { ProductService } from "@/services/api";
import { supabase } from "./client";
import { mapProduct, type ProductRow } from "./mappers";

async function fetchAll(): Promise<Product[]> {
  const { data, error } = await supabase!.from("products").select("*");
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

// Mirrors src/services/mock/products.ts — same filter/sort/search behavior,
// just sourced from Supabase instead of the static PRODUCTS array.
function applyFilter(items: Product[], f: ProductFilter = {}): Product[] {
  let out = items;
  if (f.category) out = out.filter((p) => p.categorySlug === f.category);
  if (f.colors?.length) out = out.filter((p) => f.colors!.some((c) => p.color.toLowerCase().includes(c.toLowerCase())));
  if (f.fabrics?.length) out = out.filter((p) => f.fabrics!.some((c) => p.fabric.toLowerCase().includes(c.toLowerCase())));
  if (f.occasions?.length)
    out = out.filter((p) => f.occasions!.some((c) => p.occasion.toLowerCase().includes(c.toLowerCase())));
  if (f.minPrice != null) out = out.filter((p) => p.price >= f.minPrice!);
  if (f.maxPrice != null) out = out.filter((p) => p.price <= f.maxPrice!);
  if (f.search?.trim()) {
    const fuse = new Fuse(out, {
      keys: ["name", "description", "tags", "categorySlug", "color", "fabric", "occasion"],
      threshold: 0.35,
    });
    const hits = fuse.search(f.search).map((r) => r.item);
    const ids = new Set(hits.map((p) => p.id));
    out = out.filter((p) => ids.has(p.id));
  }
  const sort = f.sort ?? "featured";
  if (sort === "newest") out = [...out].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
  return out;
}

export const supabaseProductService: ProductService = {
  async list(filter = {}) {
    const all = await fetchAll();
    const filtered = applyFilter(all, filter);
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 24;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const res: Paginated<Product> = { items, total: filtered.length, page, pageSize };
    return res;
  },
  async bySlug(slug) {
    const { data, error } = await supabase!.from("products").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data as ProductRow) : null;
  },
  async related(id, limit = 4) {
    const all = await fetchAll();
    const target = all.find((p) => p.id === id);
    if (!target) return [];
    return all.filter((p) => p.id !== id && p.categorySlug === target.categorySlug).slice(0, limit);
  },
  async search(query) {
    if (!query.trim()) return [];
    const all = await fetchAll();
    const fuse = new Fuse(all, {
      keys: ["name", "description", "tags", "categorySlug", "color", "fabric", "occasion"],
      threshold: 0.35,
    });
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  },
  async featured() {
    const all = await fetchAll();
    return all.filter((p) => p.badges?.includes("bestseller")).slice(0, 6);
  },
  async newArrivals(limit = 6) {
    const all = await fetchAll();
    return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
  },
  async bestSellers(limit = 6) {
    const all = await fetchAll();
    return all.filter((p) => p.badges?.includes("bestseller")).slice(0, limit);
  },
};
