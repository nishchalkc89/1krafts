import type { Category } from "@/types";
import type { CategoryAdminService } from "@/services/admin/api";
import { supabase } from "@/services/supabase/client";
import { mapCategory, type CategoryRow } from "@/services/supabase/mappers";

function toRow(input: Category): CategoryRow {
  return {
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    image: input.image,
    featured: input.featured ?? false,
    order: input.order,
  };
}

export const categoryAdminService: CategoryAdminService = {
  async list() {
    const { data, error } = await supabase!.from("categories").select("*").order("order", { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map(mapCategory);
  },
  async create(input) {
    const { data, error } = await supabase!.from("categories").insert(toRow(input)).select("*").single();
    if (error) throw error;
    return mapCategory(data as CategoryRow);
  },
  async update(slug, input) {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.tagline !== undefined) patch.tagline = input.tagline;
    if (input.description !== undefined) patch.description = input.description;
    if (input.image !== undefined) patch.image = input.image;
    if (input.featured !== undefined) patch.featured = input.featured;
    if (input.order !== undefined) patch.order = input.order;
    const { data, error } = await supabase!.from("categories").update(patch).eq("slug", slug).select("*").single();
    if (error) throw error;
    return mapCategory(data as CategoryRow);
  },
  async remove(slug) {
    const { error } = await supabase!.from("categories").delete().eq("slug", slug);
    if (error) throw error;
  },
};
