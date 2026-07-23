import type { Category, JournalPost, Product, ProductBadge, ProductImage, Testimonial } from "@/types";

// Database rows are snake_case; app types are camelCase. These mappers are the
// only place that boundary is crossed, so a schema change only touches here.

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category_slug: string;
  subcategory: string | null;
  brand: string;
  description: string;
  story: string | null;
  specifications: { label: string; value: string }[];
  images: ProductImage[];
  gallery: ProductImage[];
  price: number | string;
  currency: string;
  discount: number | string | null;
  stock: number;
  material: string;
  occasion: string;
  weight: string | null;
  dimensions: string | null;
  color: string;
  fabric: string;
  tags: string[];
  badges: string[] | null;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    categorySlug: row.category_slug,
    subcategory: row.subcategory ?? undefined,
    brand: row.brand,
    description: row.description,
    story: row.story ?? undefined,
    specifications: row.specifications ?? [],
    images: row.images ?? [],
    gallery: row.gallery ?? [],
    price: Number(row.price),
    currency: row.currency as Product["currency"],
    discount: row.discount != null ? Number(row.discount) : undefined,
    stock: row.stock,
    material: row.material,
    occasion: row.occasion,
    weight: row.weight ?? undefined,
    dimensions: row.dimensions ?? undefined,
    color: row.color,
    fabric: row.fabric,
    tags: row.tags ?? [],
    seo: { title: row.seo_title, description: row.seo_description },
    badges: (row.badges ?? undefined) as ProductBadge[] | undefined,
    createdAt: row.created_at,
  };
}

export interface CategoryRow {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  featured: boolean;
  order: number;
}

export function mapCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    featured: row.featured,
    order: row.order,
  };
}

export interface JournalRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: string;
  published_at: string;
  body: string;
}

export function mapJournal(row: JournalRow): JournalPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    cover: row.cover,
    author: row.author,
    publishedAt: row.published_at,
    body: row.body,
  };
}

export interface TestimonialRow {
  id: string;
  name: string;
  location: string;
  quote: string;
  product_ref: string | null;
  rating: number;
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    quote: row.quote,
    productRef: row.product_ref ?? undefined,
    rating: row.rating,
  };
}
