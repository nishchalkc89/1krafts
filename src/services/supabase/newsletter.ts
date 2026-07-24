import type { NewsletterService } from "@/services/api";
import { supabase } from "./client";

export const supabaseNewsletterService: NewsletterService = {
  async subscribe(email) {
    const id = crypto.randomUUID();
    const { error } = await supabase!.from("newsletter_subscribers").insert({ id, email: email.trim().toLowerCase() });
    // 23505 = unique_violation — already subscribed. Treat as success rather
    // than surfacing a confusing error for someone who signs up twice.
    if (error && error.code !== "23505") throw error;
    return { id };
  },
};
