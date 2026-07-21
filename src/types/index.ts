export type Currency = "NPR" | "USD" | "INR";

export type ProductBadge = "new" | "bestseller" | "limited" | "wedding" | "festival";

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categorySlug: string;
  subcategory?: string;
  brand: string;
  description: string;
  story?: string;
  specifications: { label: string; value: string }[];
  images: ProductImage[];
  gallery: ProductImage[];
  price: number;
  currency: Currency;
  discount?: number;
  stock: number;
  material: string;
  occasion: string;
  weight?: string;
  dimensions?: string;
  color: string;
  fabric: string;
  tags: string[];
  seo: { title: string; description: string };
  badges?: ProductBadge[];
  createdAt: string;
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  featured?: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  productRef?: string;
  rating: number;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: string;
  publishedAt: string;
  body: string;
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  message: string;
  productSlug?: string;
  productName?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductFilter {
  category?: string;
  colors?: string[];
  fabrics?: string[];
  occasions?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
  page?: number;
  pageSize?: number;
}