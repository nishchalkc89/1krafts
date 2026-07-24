import type {
  Category,
  EnquiryInput,
  JournalPost,
  Paginated,
  Product,
  ProductFilter,
  Testimonial,
} from "@/types";

export interface ProductService {
  list(filter?: ProductFilter): Promise<Paginated<Product>>;
  bySlug(slug: string): Promise<Product | null>;
  related(id: string, limit?: number): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  featured(): Promise<Product[]>;
  newArrivals(limit?: number): Promise<Product[]>;
  bestSellers(limit?: number): Promise<Product[]>;
}

export interface CategoryService {
  list(): Promise<Category[]>;
  bySlug(slug: string): Promise<Category | null>;
  featured(): Promise<Category[]>;
}

export interface EnquiryService {
  create(input: EnquiryInput): Promise<{ id: string }>;
}

export interface NewsletterService {
  subscribe(email: string): Promise<{ id: string }>;
}

export interface TestimonialService {
  list(): Promise<Testimonial[]>;
}

export interface JournalService {
  list(): Promise<JournalPost[]>;
  bySlug(slug: string): Promise<JournalPost | null>;
}

export interface Services {
  products: ProductService;
  categories: CategoryService;
  enquiries: EnquiryService;
  testimonials: TestimonialService;
  journal: JournalService;
  newsletter: NewsletterService;
}