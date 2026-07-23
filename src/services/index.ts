/**
 * Service factory — swaps the mock impl for the Supabase impl without
 * touching the UI. All components import from "@/services". Falls back to
 * mock data when Supabase env vars aren't configured (e.g. local dev without
 * credentials), so the app never hard-fails on a missing backend.
 */
import type { Services } from "./api";
import { hasSupabaseConfig } from "./supabase/client";

import { mockProductService } from "./mock/products";
import { mockCategoryService } from "./mock/categories";
import { mockEnquiryService } from "./mock/enquiries";
import { mockTestimonialService } from "./mock/testimonials";
import { mockJournalService } from "./mock/journal";

import { supabaseProductService } from "./supabase/products";
import { supabaseCategoryService } from "./supabase/categories";
import { supabaseEnquiryService } from "./supabase/enquiries";
import { supabaseTestimonialService } from "./supabase/testimonials";
import { supabaseJournalService } from "./supabase/journal";

export const services: Services = hasSupabaseConfig
  ? {
      products: supabaseProductService,
      categories: supabaseCategoryService,
      enquiries: supabaseEnquiryService,
      testimonials: supabaseTestimonialService,
      journal: supabaseJournalService,
    }
  : {
      products: mockProductService,
      categories: mockCategoryService,
      enquiries: mockEnquiryService,
      testimonials: mockTestimonialService,
      journal: mockJournalService,
    };

export type { Services } from "./api";
