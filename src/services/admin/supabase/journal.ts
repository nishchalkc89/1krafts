import type { JournalPost } from "@/types";
import type { JournalAdminService } from "@/services/admin/api";
import { supabase } from "@/services/supabase/client";
import { mapJournal, type JournalRow } from "@/services/supabase/mappers";

function toRow(input: JournalPost): JournalRow {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    cover: input.cover,
    author: input.author,
    published_at: input.publishedAt,
    body: input.body,
  };
}

export const journalAdminService: JournalAdminService = {
  async list() {
    const { data, error } = await supabase!.from("journal_posts").select("*").order("published_at", { ascending: false });
    if (error) throw error;
    return (data as JournalRow[]).map(mapJournal);
  },
  async create(input) {
    const { data, error } = await supabase!.from("journal_posts").insert(toRow(input)).select("*").single();
    if (error) throw error;
    return mapJournal(data as JournalRow);
  },
  async update(slug, input) {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
    if (input.category !== undefined) patch.category = input.category;
    if (input.cover !== undefined) patch.cover = input.cover;
    if (input.author !== undefined) patch.author = input.author;
    if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;
    if (input.body !== undefined) patch.body = input.body;
    const { data, error } = await supabase!.from("journal_posts").update(patch).eq("slug", slug).select("*").single();
    if (error) throw error;
    return mapJournal(data as JournalRow);
  },
  async remove(slug) {
    const { error } = await supabase!.from("journal_posts").delete().eq("slug", slug);
    if (error) throw error;
  },
};
