import { CATEGORIES } from "@/data/categories";
import type { CategoryService } from "@/services/api";

export const mockCategoryService: CategoryService = {
  async list() {
    return [...CATEGORIES].sort((a, b) => a.order - b.order);
  },
  async bySlug(slug) {
    return CATEGORIES.find((c) => c.slug === slug) ?? null;
  },
  async featured() {
    return CATEGORIES.filter((c) => c.featured).sort((a, b) => a.order - b.order);
  },
};