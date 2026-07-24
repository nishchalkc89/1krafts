import type { NewsletterService } from "@/services/api";

export const mockNewsletterService: NewsletterService = {
  async subscribe(email) {
    await new Promise((r) => setTimeout(r, 700));
    // eslint-disable-next-line no-console
    console.info("[1KRAFTS] newsletter subscribe (mock)", email);
    return { id: `sub_${Math.random().toString(36).slice(2, 10)}` };
  },
};
