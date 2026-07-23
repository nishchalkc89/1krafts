import type { JournalService } from "@/services/api";
import { supabase } from "./client";
import { mapJournal, type JournalRow } from "./mappers";

export const supabaseJournalService: JournalService = {
  async list() {
    const { data, error } = await supabase!
      .from("journal_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as JournalRow[]).map(mapJournal);
  },
  async bySlug(slug) {
    const { data, error } = await supabase!.from("journal_posts").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? mapJournal(data as JournalRow) : null;
  },
};
