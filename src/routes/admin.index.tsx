import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { LayoutGrid, Newspaper, Package, Quote } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card } from "@/components/admin/ui";
import { productAdminService } from "@/services/admin/supabase/products";
import { categoryAdminService } from "@/services/admin/supabase/categories";
import { journalAdminService } from "@/services/admin/supabase/journal";
import { testimonialAdminService } from "@/services/admin/supabase/testimonials";
import { enquiryAdminService } from "@/services/admin/supabase/enquiries";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — 1KRAFTS Admin" }] }),
  component: Page,
});

const dashboardQuery = queryOptions({
  queryKey: ["admin", "dashboard"],
  queryFn: async () => {
    const [products, categories, journal, testimonials, enquiries] = await Promise.all([
      productAdminService.list(),
      categoryAdminService.list(),
      journalAdminService.list(),
      testimonialAdminService.list(),
      enquiryAdminService.list(),
    ]);
    return { products, categories, journal, testimonials, enquiries };
  },
});

function Page() {
  return (
    <AdminGuard>
      <AdminShell>
        <Content />
      </AdminShell>
    </AdminGuard>
  );
}

function Content() {
  const { data } = useSuspenseQuery(dashboardQuery);
  const newEnquiries = data.enquiries.filter((e) => e.status === "new");
  const lowStock = data.products.filter((p) => p.stock <= 3);

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" description="A quick look at the house." />

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Package} label="Products" value={data.products.length} to="/admin/products" />
        <StatCard icon={LayoutGrid} label="Categories" value={data.categories.length} to="/admin/categories" />
        <StatCard icon={Newspaper} label="Journal posts" value={data.journal.length} to="/admin/journal" />
        <StatCard icon={Quote} label="Testimonials" value={data.testimonials.length} to="/admin/testimonials" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-[color:var(--walnut)]">New enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--sindoor)] hover:opacity-70">
              View all →
            </Link>
          </div>
          {newEnquiries.length === 0 ? (
            <p className="mt-4 text-sm text-[color:var(--walnut-soft)]">Nothing new right now.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[color:var(--walnut)]/8">
              {newEnquiries.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-[color:var(--walnut)]/3 -mx-2 px-2 rounded-md">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[color:var(--walnut)]">{e.name}</p>
                    <p className="truncate text-xs text-[color:var(--walnut-soft)]">{e.productName ?? e.message}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[color:var(--brass)]/15 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--ember)]">
                    New
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-[color:var(--walnut)]">Low stock</h2>
            <Link to="/admin/products" className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--sindoor)] hover:opacity-70">
              View all →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-[color:var(--walnut-soft)]">Everything's well stocked.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[color:var(--walnut)]/8">
              {lowStock.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-[color:var(--walnut)]/3 -mx-2 px-2 rounded-md">
                  <p className="truncate text-sm font-medium text-[color:var(--walnut)]">{p.name}</p>
                  <span className="shrink-0 rounded-full bg-[color:var(--sindoor)]/10 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--sindoor)]">
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  to: "/admin/products" | "/admin/categories" | "/admin/journal" | "/admin/testimonials";
}) {
  return (
    <Link to={to} className="group block">
      <Card className="admin-card-hover p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--walnut-soft)]">{label}</span>
          <Icon size={16} className="text-[color:var(--brass)] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
        </div>
        <div className="mt-2 font-display text-3xl text-[color:var(--walnut)]">{value}</div>
      </Card>
    </Link>
  );
}
