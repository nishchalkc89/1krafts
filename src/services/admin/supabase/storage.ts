import { supabase } from "@/services/supabase/client";

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

export async function uploadMedia(file: File, folder: "products" | "categories" | "journal"): Promise<string> {
  const path = `${folder}/${Date.now()}-${sanitize(file.name)}`;
  const { error } = await supabase!.storage.from("media").upload(path, file, { cacheControl: "3600" });
  if (error) throw error;
  const { data } = supabase!.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

// Bulk import needs the exact original filename preserved (not timestamp-prefixed)
// so spreadsheet rows can reference photos by filename. Uniqueness instead comes
// from a per-batch folder.
export async function uploadBulkBatch(files: File[]): Promise<Map<string, string>> {
  const batch = `products/bulk-${Date.now()}`;
  const map = new Map<string, string>();
  for (const file of files) {
    const path = `${batch}/${sanitize(file.name)}`;
    const { error } = await supabase!.storage.from("media").upload(path, file, { cacheControl: "3600" });
    if (error) throw error;
    const { data } = supabase!.storage.from("media").getPublicUrl(path);
    map.set(file.name, data.publicUrl);
  }
  return map;
}
