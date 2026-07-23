import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/services";

const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["journal", slug], queryFn: () => services.journal.bySlug(slug) });

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.fetchQuery(postQuery(params.slug));
    if (!post) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — 1KRAFTS` },
      { property: "og:url", content: `/journal/${params.slug}` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/journal/${params.slug}` }],
  }),
  component: JournalPost,
});

function JournalPost() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(postQuery(slug));
  if (!p) return null;

  return (
    <article>
      <section className="pt-40 pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-[860px] text-center">
          <Reveal>
            <div className="eyebrow">{p.category}</div>
            <h1 className="mt-6 display-lg italic font-light">{p.title}</h1>
            <div className="mt-8 text-sm text-[color:var(--sindoor)] uppercase tracking-[0.24em]">
              {p.author} · {new Date(p.publishedAt).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal className="mx-auto max-w-[1200px] px-6 md:px-10">
        <img src={p.cover} alt="" className="aspect-[16/9] w-full object-cover" />
      </Reveal>

      <section className="px-6 md:px-10 py-24">
        <div className="mx-auto max-w-[720px]">
          <Reveal>
            <p className="font-display font-medium text-3xl leading-snug text-foreground">{p.excerpt}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 font-medium text-foreground leading-relaxed text-lg">{p.body}</p>
          </Reveal>
          <div className="mt-16 border-t border-foreground/10 pt-8">
            <Link to="/journal" className="text-[0.72rem] uppercase tracking-[0.28em] gold-underline">
              ← All essays
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}