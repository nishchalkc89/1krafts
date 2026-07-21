export function formatPrice(value: number, currency = "NPR"): string {
  const symbol = currency === "NPR" ? "Rs. " : currency === "USD" ? "$" : "₹";
  return `${symbol}${value.toLocaleString("en-IN")}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}