import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader, Card, EmptyState, IconButton } from "@/components/admin/ui";
import { ConfirmDialog, useConfirmDelete } from "@/components/admin/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { enquiryAdminService } from "@/services/admin/supabase/enquiries";
import type { EnquiryRecord, EnquiryStatus } from "@/services/admin/api";

export const Route = createFileRoute("/admin/enquiries/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Enquiries — 1KRAFTS Admin" }] }),
  component: Page,
});

const enquiriesQuery = queryOptions({ queryKey: ["admin", "enquiries"], queryFn: () => enquiryAdminService.list() });

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  read: "bg-blue-100 text-blue-800",
  archived: "bg-[color:var(--walnut)]/10 text-[color:var(--walnut-soft)]",
};

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
  const { data } = useSuspenseQuery(enquiriesQuery);
  const qc = useQueryClient();
  const del = useConfirmDelete<EnquiryRecord>();

  async function setStatus(id: string, status: EnquiryStatus) {
    await enquiryAdminService.updateStatus(id, status);
    qc.invalidateQueries({ queryKey: ["admin", "enquiries"] });
  }

  async function remove(enquiry: EnquiryRecord) {
    await enquiryAdminService.remove(enquiry.id);
    qc.invalidateQueries({ queryKey: ["admin", "enquiries"] });
  }

  const unread = data.filter((e) => e.status === "new").length;

  return (
    <div>
      <PageHeader eyebrow="One conversation" title="Enquiries" description={`${unread} new · ${data.length} total`} />

      <Card className="mt-8 overflow-hidden">
        {data.length === 0 ? (
          <EmptyState icon={<MessageSquare size={28} />} title="No enquiries yet" description="Submissions from the storefront's enquiry form will land here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--walnut)]/10 hover:bg-transparent">
                <TableHead className="text-[color:var(--walnut-soft)]">Status</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Name</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Contact</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Product</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Message</TableHead>
                <TableHead className="text-[color:var(--walnut-soft)]">Received</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.id} className="border-[color:var(--walnut)]/8 hover:bg-[color:var(--walnut)]/3">
                  <TableCell>
                    <select
                      value={e.status}
                      onChange={(ev) => setStatus(e.id, ev.target.value as EnquiryStatus)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[e.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="archived">Archived</option>
                    </select>
                  </TableCell>
                  <TableCell className="font-medium text-[color:var(--walnut)]">{e.name}</TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">
                    <div>{e.email}</div>
                    <div>{e.phone}</div>
                  </TableCell>
                  <TableCell className="text-[color:var(--walnut-soft)]">{e.productName ?? "—"}</TableCell>
                  <TableCell className="max-w-sm text-[color:var(--walnut-soft)]">{e.message}</TableCell>
                  <TableCell className="whitespace-nowrap text-[color:var(--walnut-soft)]">{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => del.ask(e)} variant="danger" title="Delete"><Trash2 size={14} /></IconButton>
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
        title={`Delete enquiry from "${del.pending?.name}"?`}
        description="This can't be undone."
        onConfirm={() => del.pending && remove(del.pending)}
      />
    </div>
  );
}
