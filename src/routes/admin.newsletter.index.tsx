import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card, EmptyState, IconButton } from "@/components/admin/ui";
import { ConfirmDialog, useConfirmDelete } from "@/components/admin/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { newsletterAdminService } from "@/services/admin/supabase/newsletter";
import type { NewsletterSubscriber } from "@/services/admin/api";

export const Route = createFileRoute("/admin/newsletter/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Newsletter — 1KRAFTS Admin" }] }),
  component: Page,
});

const subscribersQuery = queryOptions({ queryKey: ["admin", "newsletter"], queryFn: () => newsletterAdminService.list() });

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
  const { data } = useSuspenseQuery(subscribersQuery);
  const qc = useQueryClient();
  const del = useConfirmDelete<NewsletterSubscriber>();

  async function remove(sub: NewsletterSubscriber) {
    await newsletterAdminService.remove(sub.id);
    qc.invalidateQueries({ queryKey: ["admin", "newsletter"] });
  }

  return (
    <div>
      <PageHeader eyebrow="The Letter" title="Newsletter" description={`${data.length} subscriber${data.length === 1 ? "" : "s"}.`} />

      <Card className="mt-8 overflow-hidden">
        {data.length === 0 ? (
          <EmptyState icon={<Mail size={28} />} title="No subscribers yet" description="Emails from the storefront's newsletter box will land here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                <TableHead className="text-[color:var(--walnut-soft)]">Email</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Subscribed</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.id} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                  <TableCell className="font-medium text-[color:var(--walnut)]">{s.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-[color:var(--walnut-soft)]">{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <IconButton onClick={() => del.ask(s)} variant="danger" title="Delete"><Trash2 size={14} /></IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <ConfirmDialog
        open={del.pending !== null}
        onOpenChange={(open) => !open && del.clear()}
        title={`Remove "${del.pending?.email}"?`}
        description="This can't be undone."
        onConfirm={() => del.pending && remove(del.pending)}
      />
    </div>
  );
}
