import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Heritage } from "@/components/home/Heritage";
import { Craftsmanship } from "@/components/home/Craftsmanship";
import { LimitedCollection } from "@/components/home/LimitedCollection";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { services } from "@/services";

const newArrivalsQuery = () =>
  queryOptions({ queryKey: ["home", "new-arrivals"], queryFn: () => services.products.newArrivals(8) });
const bestSellersQuery = () =>
  queryOptions({ queryKey: ["home", "best-sellers"], queryFn: () => services.products.bestSellers(4) });
const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: () => services.categories.list() });
const testimonialsQuery = () =>
  queryOptions({ queryKey: ["testimonials"], queryFn: () => services.testimonials.list() });

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.fetchQuery(newArrivalsQuery()),
      context.queryClient.fetchQuery(bestSellersQuery()),
      context.queryClient.fetchQuery(categoriesQuery()),
      context.queryClient.fetchQuery(testimonialsQuery()),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: newArrivals } = useSuspenseQuery(newArrivalsQuery());
  const { data: bestSellers } = useSuspenseQuery(bestSellersQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery());
  return (
    <>
      <Hero />
      <FeaturedCategories categories={categories} />
      <NewArrivals eyebrow="The Latest" title="New Arrivals" products={newArrivals} />
      <Heritage />
      <NewArrivals eyebrow="Kept by many" title="Best Sellers" products={bestSellers} />
      <Craftsmanship />
      <LimitedCollection />
      <Testimonials testimonials={testimonials} />
      <InstagramGrid />
      <Newsletter />
    </>
  );
}
