import type { ProductAdminService, ProductInput } from "@/services/admin/api";
import { supabase } from "@/services/supabase/client";
import { mapProduct, type ProductRow } from "@/services/supabase/mappers";

export function productInputToRow(input: ProductInput): Omit<ProductRow, "id" | "created_at"> {
  return {
    slug: input.slug,
    name: input.name,
    sku: input.sku,
    category_slug: input.categorySlug,
    subcategory: input.subcategory ?? null,
    brand: input.brand,
    description: input.description,
    story: input.story ?? null,
    specifications: input.specifications,
    images: input.images,
    gallery: input.gallery,
    price: input.price,
    currency: input.currency,
    discount: input.discount ?? 0,
    stock: input.stock,
    material: input.material,
    occasion: input.occasion,
    weight: input.weight ?? null,
    dimensions: input.dimensions ?? null,
    color: input.color,
    fabric: input.fabric,
    tags: input.tags,
    badges: input.badges ?? [],
    seo_title: input.seo.title,
    seo_description: input.seo.description,
  };
}

export const productAdminService: ProductAdminService = {
  async list() {
    const { data, error } = await supabase!.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProductRow[]).map(mapProduct);
  },
  async create(input) {
    const { data, error } = await supabase!.from("products").insert(productInputToRow(input)).select("*").single();
    if (error) throw error;
    return mapProduct(data as ProductRow);
  },
  async update(id, input) {
    const patch = productInputToRow(input as ProductInput);
    const { data, error } = await supabase!.from("products").update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    return mapProduct(data as ProductRow);
  },
  async remove(id) {
    const { error } = await supabase!.from("products").delete().eq("id", id);
    if (error) throw error;
  },
  async bulkUpsert(rows) {
    const payload = rows.map(productInputToRow);
    const { error, count } = await supabase!
      .from("products")
      .upsert(payload, { onConflict: "sku", count: "exact" });
    if (error) throw error;
    return { count: count ?? payload.length };
  },
};
