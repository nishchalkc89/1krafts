// Recognizes and converts a Shopify product-export CSV/XLSX into the shape
// our own bulk-import template uses. Shopify's export is structurally
// different from ours: one row per image/variant, all grouped under a
// shared "Handle", with only the first row of each group carrying the
// product's title/description/price — and image URLs are already public
// links, not filenames needing a separate photo upload.

const SHOPIFY_MARKER_COLUMNS = ["Handle", "Title", "Variant Price", "Image Src"];

export function looksLikeShopifyExport(headers: string[]): boolean {
  const set = new Set(headers);
  return SHOPIFY_MARKER_COLUMNS.every((c) => set.has(c));
}

// Fixes the common mojibake that shows up when UTF-8 punctuation gets
// misread as Windows-1252 — a frequent artifact in CSVs exported from other
// systems, not something specific to Shopify's format. Written with \u
// escapes (not literal characters) so the source itself stays plain ASCII —
// a UTF-8 bullet ("•", bytes E2 80 A2) misread this way decodes into
// three separate Windows-1252 characters (U+00E2 U+0080 U+00A2), the middle
// of which is an invisible control character. A stray U+00C2 on its own is
// the same kind of misread non-breaking space.
function cleanMojibake(text: string): string {
  return text
    .replace(/\u00e2\u0080\u00a2/g, "\u2022")
    .replace(/\u00c2/g, "");
}

function stripHtml(html: string): string {
  return cleanMojibake(html)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Sellers commonly write product specs as a bullet/line list inside the
// HTML description itself — "Color: Black, Material: Cotton Blend<br>
// Pattern: Printed, ..." — rather than as structured spreadsheet columns.
// This pulls the ones we have dedicated fields for out of that free text,
// so they land in Color/Material/Fabric/Occasion instead of only ever
// showing up buried inside the description paragraph.
function extractSpecsFromHtml(html: string): { color: string; material: string; fabric: string; occasion: string } {
  const text = cleanMojibake(html).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ");
  const lines = text.split("\n");
  const specs = { color: "", material: "", fabric: "", occasion: "" };
  for (const line of lines) {
    const match = line.match(/^[\s•\-*]*([A-Za-z][A-Za-z\s]{2,24}?)\s*:\s*([^<\n]+)/);
    if (!match) continue;
    const label = match[1].trim().toLowerCase();
    const value = match[2].replace(/,\s*$/, "").trim();
    if (!value) continue;
    if (!specs.color && (label === "color" || label === "colour")) specs.color = value;
    else if (!specs.material && /^materia/.test(label)) specs.material = value;
    else if (!specs.fabric && label === "fabric") specs.fabric = value;
    else if (!specs.occasion && label === "occasion") specs.occasion = value;
  }
  return specs;
}

// Best-effort mapping from Shopify's free-text "Type"/"Product Category" to
// one of our own category slugs. Anything that doesn't match falls through
// unchanged and surfaces as a normal "Unknown category" row error — visible
// and fixable in the preview table, rather than silently guessed wrong.
function guessCategorySlug(type: string, productCategory: string): string {
  const text = `${type} ${productCategory}`.toLowerCase();
  if (/saree/.test(text)) return "sarees";
  if (/kurti/.test(text)) return "women-kurtis";
  if (/kurta/.test(text)) return "men-kurtas";
  if (/t-?shirt|\btee\b/.test(text)) return "men-tshirts";
  if (/shirt/.test(text)) return "men-shirts";
  if (/jewel/.test(text)) return "jewellery";
  if (/trouser|bottom|\bpant\b|legging|suruwal/.test(text)) return "men-bottoms";
  return type.trim() || productCategory.trim();
}

export function shopifyRowsToImportRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const r of rows) {
    const handle = String(r["Handle"] ?? "").trim();
    if (!handle) continue;
    if (!groups.has(handle)) groups.set(handle, []);
    groups.get(handle)!.push(r);
  }

  const out: Record<string, unknown>[] = [];
  for (const [handle, group] of groups) {
    const primary = group.find((r) => String(r["Title"] ?? "").trim()) ?? group[0];

    const images: string[] = [];
    for (const r of group) {
      const src = String(r["Image Src"] ?? "").trim();
      if (src && !images.includes(src)) images.push(src);
    }

    let color = "";
    let material = "";
    let fabric = "";
    let occasion = "";
    let stock = 0;
    for (const r of group) {
      for (const n of [1, 2, 3] as const) {
        const name = String(r[`Option${n} Name`] ?? "").trim().toLowerCase();
        const value = String(r[`Option${n} Value`] ?? "").trim();
        if (!name || !value) continue;
        if ((name === "color" || name === "colour") && !color) color = value;
        else if (name === "material" && !material) material = value;
        else if (name === "fabric" && !fabric) fabric = value;
        else if (name === "occasion" && !occasion) occasion = value;
      }
      const qty = Number(r["Variant Inventory Qty"]);
      if (Number.isFinite(qty)) stock += qty;
    }

    const name = cleanMojibake(String(primary["Title"] ?? handle)).trim();
    const imageList = images.join(", ");

    // Option columns (explicit "Color"/"Material" option names) take
    // priority; anything still missing is filled in from the description
    // text, since most listings state specs there instead.
    const htmlSpecs = extractSpecsFromHtml(String(primary["Body (HTML)"] ?? ""));
    color = color || htmlSpecs.color;
    material = material || htmlSpecs.material;
    fabric = fabric || htmlSpecs.fabric || material;
    occasion = occasion || htmlSpecs.occasion;

    out.push({
      sku: String(primary["Variant SKU"] ?? "").trim() || handle,
      slug: handle,
      name,
      categorySlug: guessCategorySlug(String(primary["Type"] ?? ""), String(primary["Product Category"] ?? "")),
      subcategory: "",
      brand: String(primary["Vendor"] ?? "").trim(),
      description: stripHtml(String(primary["Body (HTML)"] ?? "")) || name,
      story: "",
      price: String(primary["Variant Price"] ?? "0").trim(),
      currency: "NPR",
      discount: "0",
      stock: String(stock || 0),
      material,
      occasion,
      weight: "",
      dimensions: "",
      color,
      fabric,
      tags: String(primary["Tags"] ?? "").trim(),
      badges: "",
      seoTitle: String(primary["SEO Title"] ?? "").trim(),
      seoDescription: stripHtml(String(primary["SEO Description"] ?? "")),
      images: imageList,
      gallery: imageList,
    });
  }
  return out;
}
