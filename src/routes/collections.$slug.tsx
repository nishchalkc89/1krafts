import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { Divider } from "@/components/brand/Divider";
import { ProductGrid } from "@/components/product/ProductGrid";
import { services } from "@/services";
import { useState } from "react";

const categoryQuery = (slug: string) =>
  queryOptions({ queryKey: ["category", slug], queryFn: () => services.categories.bySlug(slug) });
const productsQuery = (slug: string) =>
  queryOptions({ queryKey: ["category-products", slug], queryFn: () => services.products.list({ category: slug, pageSize: 48 }) });

export const Route = createFileRoute("/collections/$slug")({
  loader: async ({ params, context }) => {
    const cat = await context.queryClient.ensureQueryData(categoryQuery(params.slug));
    if (!cat) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery(params.slug));
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — 1KRAFTS` },
      { property: "og:url", content: `/collections/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/collections/${params.slug}` }],
  }),
  component: CollectionPage,
});

const SORT_OPTIONS = [
  { v: "featured", l: "Featured" },
  { v: "newest", l: "Newest" },
  { v: "price-asc", l: "Price · Low" },
  { v: "price-desc", l: "Price · High" },
] as const;

function CollectionPage() {
  const { slug } = Route.useParams();
  const { data: category } = useSuspenseQuery(categoryQuery(slug));
  const { data: page } = useSuspenseQuery(productsQuery(slug));
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["v"]>("featured");

  const items = [...page.items].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "newest") return a.createdAt < b.createdAt ? 1 : -1;
    return 0;
  });

  return (
    <>
      <section className="pt-40 pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-[1680px]">
          <Reveal>
            <div className="eyebrow">{category?.tagline}</div>
            <h1 className="mt-6 display-xl">{category?.name}</h1>
            <p className="mt-6 max-w-xl font-medium text-foreground">{category?.description}</p>
          </Reveal>
        </div>
      </section>
      <Divider className="mx-6 md:mx-10" />
      <section className="px-6 md:px-10 py-16">
        <div className="mx-auto max-w-[1680px]">
          <div className="mb-10 flex flex-col gap-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>{page.total} pieces</div>
            <div className="flex items-center gap-3 overflow-x-auto -mx-1 px-1 sm:overflow-visible">
              <span className="shrink-0">Sort</span>
              <div className="flex gap-2 shrink-0">
                {SORT_OPTIONS.map((o) => (
                  <motion.button
                    key={o.v}
                    onClick={() => setSort(o.v)}
                    whileTap={{ scale: 0.96 }}
                    className={
                      "shrink-0 rounded-full border px-3 py-1.5 transition-colors " +
                      (sort === o.v ? "border-foreground bg-foreground text-[color:var(--ivory)]" : "border-foreground/20 hover:border-foreground/60")
                    }
                  >
                    {o.l}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          {items.length > 0 ? (
            <ProductGrid products={items} />
          ) : (
            <div className="rounded-sm border border-foreground/10 bg-[color:var(--cream)] py-32 text-center font-medium text-foreground">
              This chapter is being loomed. Please check back soon.
            </div>
          )}
        </div>
      </section>
    </>
  );
}