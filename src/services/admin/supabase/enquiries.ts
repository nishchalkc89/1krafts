import type { EnquiryAdminService, EnquiryRecord, EnquiryStatus } from "@/services/admin/api";
import { supabase } from "@/services/supabase/client";

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  product_slug: string | null;
  product_name: string | null;
  status: EnquiryStatus;
  created_at: string;
}

function mapEnquiry(row: EnquiryRow): EnquiryRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    productSlug: row.product_slug ?? undefined,
    productName: row.product_name ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export const enquiryAdminService: EnquiryAdminService = {
  async list() {
    const { data, error } = await supabase!.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as EnquiryRow[]).map(mapEnquiry);
  },
  async updateStatus(id, status) {
    const { error } = await supabase!.from("enquiries").update({ status }).eq("id", id);
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await supabase!.from("enquiries").delete().eq("id", id);
    if (error) throw error;
  },
};
