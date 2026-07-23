import type { TestimonialAdminService, TestimonialInput } from "@/services/admin/api";
import { supabase } from "@/services/supabase/client";
import { mapTestimonial, type TestimonialRow } from "@/services/supabase/mappers";

function toRow(input: TestimonialInput): Omit<TestimonialRow, "id"> {
  return {
    name: input.name,
    location: input.location,
    quote: input.quote,
    product_ref: input.productRef ?? null,
    rating: input.rating,
  };
}

export const testimonialAdminService: TestimonialAdminService = {
  async list() {
    const { data, error } = await supabase!.from("testimonials").select("*");
    if (error) throw error;
    return (data as TestimonialRow[]).map(mapTestimonial);
  },
  async create(input) {
    const { data, error } = await supabase!.from("testimonials").insert(toRow(input)).select("*").single();
    if (error) throw error;
    return mapTestimonial(data as TestimonialRow);
  },
  async update(id, input) {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.location !== undefined) patch.location = input.location;
    if (input.quote !== undefined) patch.quote = input.quote;
    if (input.productRef !== undefined) patch.product_ref = input.productRef;
    if (input.rating !== undefined) patch.rating = input.rating;
    const { data, error } = await supabase!.from("testimonials").update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    return mapTestimonial(data as TestimonialRow);
  },
  async remove(id) {
    const { error } = await supabase!.from("testimonials").delete().eq("id", id);
    if (error) throw error;
  },
};
