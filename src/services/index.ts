/**
 * Service factory — swap the mock impl for a Supabase / REST impl
 * without touching the UI. All components import from "@/services".
 */
import type { Services } from "./api";
import { mockProductService } from "./mock/products";
import { mockCategoryService } from "./mock/categories";
import { mockEnquiryService } from "./mock/enquiries";
import { mockTestimonialService } from "./mock/testimonials";
import { mockJournalService } from "./mock/journal";

export const services: Services = {
  products: mockProductService,
  categories: mockCategoryService,
  enquiries: mockEnquiryService,
  testimonials: mockTestimonialService,
  journal: mockJournalService,
};

export type { Services } from "./api";