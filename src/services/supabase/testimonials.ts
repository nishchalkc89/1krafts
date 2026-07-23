import type { TestimonialService } from "@/services/api";
import { supabase } from "./client";
import { mapTestimonial, type TestimonialRow } from "./mappers";

export const supabaseTestimonialService: TestimonialService = {
  async list() {
    const { data, error } = await supabase!.from("testimonials").select("*");
    if (error) throw error;
    return (data as TestimonialRow[]).map(mapTestimonial);
  },
};
