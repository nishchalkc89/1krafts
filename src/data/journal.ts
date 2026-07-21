import type { JournalPost } from "@/types";
import loom from "@/assets/craft-loom.jpg";
import embroidery from "@/assets/craft-embroidery.jpg";
import mountain from "@/assets/heritage-mountain.jpg";

export const JOURNAL: JournalPost[] = [
  {
    slug: "the-loom-that-remembers",
    title: "The Loom That Remembers",
    excerpt: "How a wooden loom in a Kathmandu courtyard keeps a two-hundred-year-old memory alive.",
    category: "Craft",
    cover: loom,
    author: "Anjana Shrestha",
    publishedAt: "2026-05-14",
    body: "In a courtyard behind the Boudha stupa, a wooden loom clicks on with a rhythm older than the road outside. This is the loom that made the first Rakta silk. It has not been rebuilt.",
  },
  {
    slug: "gold-thread-slow-time",
    title: "Gold Thread, Slow Time",
    excerpt: "The forty-two days it takes to finish a single Banaras border.",
    category: "Atelier",
    cover: embroidery,
    author: "Krishna Rai",
    publishedAt: "2026-06-02",
    body: "A zari border is not woven. It is coaxed. You cannot rush a thread that measures itself in years, not minutes.",
  },
  {
    slug: "chyangra-and-the-cold",
    title: "Chyangra and the Cold",
    excerpt: "Above three thousand metres, a goat and a shepherd give us pashmina.",
    category: "Heritage",
    cover: mountain,
    author: "Pemba Sherpa",
    publishedAt: "2026-06-19",
    body: "Chyangra pashmina is only pashmina because the cold makes it so. This is a story about wind, altitude, and the slow patience of fibre.",
  },
];