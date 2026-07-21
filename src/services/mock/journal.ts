import { JOURNAL } from "@/data/journal";
import type { JournalService } from "@/services/api";

export const mockJournalService: JournalService = {
  async list() {
    return JOURNAL;
  },
  async bySlug(slug) {
    return JOURNAL.find((p) => p.slug === slug) ?? null;
  },
};