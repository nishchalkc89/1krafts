# Supabase (BYO) — Phase 2 stub

This directory will contain the Supabase implementation of `Services`
defined in `../api.ts`. When you provide `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY`, wire a concrete impl here and swap
the factory in `../index.ts`.

No UI code imports Supabase directly — everything goes through
`@/services`. That's the whole point.