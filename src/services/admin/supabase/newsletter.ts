import type { NewsletterAdminService, NewsletterSubscriber } from "@/services/admin/api";
import { supabase } from "@/services/supabase/client";

interface NewsletterRow {
  id: string;
  email: string;
  created_at: string;
}

function mapSubscriber(row: NewsletterRow): NewsletterSubscriber {
  return { id: row.id, email: row.email, createdAt: row.created_at };
}

export const newsletterAdminService: NewsletterAdminService = {
  async list() {
    const { data, error } = await supabase!.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as NewsletterRow[]).map(mapSubscriber);
  },
  async remove(id) {
    const { error } = await supabase!.from("newsletter_subscribers").delete().eq("id", id);
    if (error) throw error;
  },
};
