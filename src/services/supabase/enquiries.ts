import type { EnquiryService } from "@/services/api";
import { supabase } from "./client";

export const supabaseEnquiryService: EnquiryService = {
  async create(input) {
    // Generate the id client-side and insert it explicitly, rather than
    // asking PostgREST to SELECT the row back after insert — enquiries are
    // deliberately not readable by the public (anon) role, only by the
    // authenticated admin, and .select() after .insert() requires read-back
    // permission that anon doesn't have.
    const id = crypto.randomUUID();
    const { error } = await supabase!.from("enquiries").insert({
      id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      product_slug: input.productSlug ?? null,
      product_name: input.productName ?? null,
    });
    if (error) throw error;
    return { id };
  },
};
