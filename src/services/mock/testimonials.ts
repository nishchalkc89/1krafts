import { TESTIMONIALS } from "@/data/testimonials";
import type { TestimonialService } from "@/services/api";

export const mockTestimonialService: TestimonialService = {
  async list() {
    return TESTIMONIALS;
  },
};