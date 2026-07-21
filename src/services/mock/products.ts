import Fuse from "fuse.js";
import { PRODUCTS } from "@/data/products";
import type { Paginated, Product, ProductFilter } from "@/types";
import type { ProductService } from "@/services/api";

const fuse = new Fuse(PRODUCTS, {
  keys: ["name", "description", "tags", "categorySlug", "color", "fabric", "occasion"],
  threshold: 0.35,
});

function applyFilter(items: Product[], f: ProductFilter = {}): Product[] {
  let out = items;
  if (f.category) out = out.filter((p) => p.categorySlug === f.category);
  if (f.colors?.length) out = out.filter((p) => f.colors!.some((c) => p.color.toLowerCase().includes(c.toLowerCase())));
  if (f.fabrics?.length) out = out.filter((p) => f.fabrics!.some((c) => p.fabric.toLowerCase().includes(c.toLowerCase())));
  if (f.occasions?.length) out = out.filter((p) => f.occasions!.some((c) => p.occasion.toLowerCase().includes(c.toLowerCase())));
  if (f.minPrice != null) out = out.filter((p) => p.price >= f.minPrice!);
  if (f.maxPrice != null) out = out.filter((p) => p.price <= f.maxPrice!);
  if (f.search?.trim()) {
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

export const mockProductService: ProductService = {
  async list(filter = {}) {
    const filtered = applyFilter(PRODUCTS, filter);
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 24;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const res: Paginated<Product> = { items, total: filtered.length, page, pageSize };
    return res;
  },
  async bySlug(slug) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  },
  async related(id, limit = 4) {
    const target = PRODUCTS.find((p) => p.id === id);
    if (!target) return [];
    return PRODUCTS.filter((p) => p.id !== id && p.categorySlug === target.categorySlug).slice(0, limit);
  },
  async search(query) {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  },
  async featured() {
    return PRODUCTS.filter((p) => p.badges?.includes("bestseller")).slice(0, 6);
  },
  async newArrivals(limit = 6) {
    return [...PRODUCTS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
  },
  async bestSellers(limit = 6) {
    return PRODUCTS.filter((p) => p.badges?.includes("bestseller")).slice(0, limit);
  },
};