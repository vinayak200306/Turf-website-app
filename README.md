# Field Door

Full-stack turf booking monorepo with:

- `apps/web`: Next.js App Router frontend
- `apps/api`: Express API for auth, slots, bookings, payments, and admin
- `packages/shared`: shared DTOs, sport metadata, and pricing helpers

## Quick start

1. Copy `apps/api/.env.example` to `apps/api/.env`
2. Create the Supabase tables with `apps/api/supabase/schema.sql`
3. Install dependencies with `npm install`
4. Seed demo data with `npm run seed`
5. Run both apps with `npm run dev`
