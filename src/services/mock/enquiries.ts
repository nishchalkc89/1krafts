import type { EnquiryService } from "@/services/api";

export const mockEnquiryService: EnquiryService = {
  async create(input) {
    await new Promise((r) => setTimeout(r, 900));
    // eslint-disable-next-line no-console
    console.info("[1KRAFTS] enquiry (mock)", input);
    return { id: `enq_${Math.random().toString(36).slice(2, 10)}` };
  },
};