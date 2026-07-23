import type { CategoryService } from "@/services/api";
import { supabase } from "./client";
import { mapCategory, type CategoryRow } from "./mappers";

export const supabaseCategoryService: CategoryService = {
  async list() {
    const { data, error } = await supabase!.from("categories").select("*").order("order", { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map(mapCategory);
  },
  async bySlug(slug) {
    const { data, error } = await supabase!.from("categories").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? mapCategory(data as CategoryRow) : null;
  },
  async featured() {
    const { data, error } = await supabase!
      .from("categories")
      .select("*")
      .eq("featured", true)
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map(mapCategory);
  },
};
