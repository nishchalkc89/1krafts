import type { Category, JournalPost, Product, Testimonial } from "@/types";

export type ProductInput = Omit<Product, "id" | "createdAt">;
export interface ProductAdminService {
  list(): Promise<Product[]>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: Partial<ProductInput>): Promise<Product>;
  remove(id: string): Promise<void>;
  bulkUpsert(rows: ProductInput[]): Promise<{ count: number }>;
}

export interface CategoryAdminService {
  list(): Promise<Category[]>;
  create(input: Category): Promise<Category>;
  update(slug: string, input: Partial<Category>): Promise<Category>;
  remove(slug: string): Promise<void>;
}

export interface JournalAdminService {
  list(): Promise<JournalPost[]>;
  create(input: JournalPost): Promise<JournalPost>;
  update(slug: string, input: Partial<JournalPost>): Promise<JournalPost>;
  remove(slug: string): Promise<void>;
}

export type TestimonialInput = Omit<Testimonial, "id">;
export interface TestimonialAdminService {
  list(): Promise<Testimonial[]>;
  create(input: TestimonialInput): Promise<Testimonial>;
  update(id: string, input: Partial<TestimonialInput>): Promise<Testimonial>;
  remove(id: string): Promise<void>;
}

export type EnquiryStatus = "new" | "read" | "archived";
export interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  productSlug?: string;
  productName?: string;
  status: EnquiryStatus;
  createdAt: string;
}
export interface EnquiryAdminService {
  list(): Promise<EnquiryRecord[]>;
  updateStatus(id: string, status: EnquiryStatus): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}
export interface NewsletterAdminService {
  list(): Promise<NewsletterSubscriber[]>;
  remove(id: string): Promise<void>;
}
