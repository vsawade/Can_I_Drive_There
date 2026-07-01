# Can I Drive There?

Check what documents and permits you need to legally drive abroad. Source-backed route checklists, SEO-friendly pages, admin tools, and optional email reminders.

**Live site:** [https://canidrivethere.vercel.app](https://canidrivethere.vercel.app)

## Features

- Route checker for international driving requirements (origin → destination)
- SEO pages at `/drive/[origin]/[destination]` with sitemap and Open Graph images
- Data quality signals: confidence levels, staleness warnings, and unverified-route handling
- Rental desk mode, checklist copy/print/share, and trip email reminders
- Admin dashboard for outdated reports and analytics (`/admin/login`)
- Supabase storage in production with local `.data/` fallback for dev
- Scheduled reminder emails via Vercel Cron + Resend

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- TypeScript, Tailwind CSS v4, Radix UI
- Supabase (reports, analytics, trip reminders)
- Resend (email)
- Vitest + GitHub Actions CI

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Site URL for emails and links |
| `ADMIN_API_KEY` | Yes (admin) | Login secret for `/admin/*` |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Server-side database access |
| `RESEND_API_KEY` | Optional | Send trip reminder emails |
| `RESEND_FROM_EMAIL` | Optional | From address (must be verified in Resend) |
| `CRON_SECRET` | Production cron | Auth for `/api/cron/send-reminders` |

Without Supabase, data is stored in `.data/` JSON files (local dev only).

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Add your project URL and service role key to `.env.local`

See [supabase/README.md](supabase/README.md) for details.

### Email reminders

Trip reminders send an immediate checklist link and schedule a follow-up email 3 days before the trip.

- Sign up at [resend.com](https://resend.com) and add `RESEND_API_KEY`
- For testing, use `RESEND_FROM_EMAIL=onboarding@resend.dev`
- On Vercel, set `CRON_SECRET` so the daily cron job can run

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # TypeScript check
npm test         # Run unit tests
```

## Project structure

```
app/              # Pages and API routes
components/       # UI components
lib/              # Core logic, data, storage, email
data/             # Countries and state overrides (JSON)
supabase/         # Database schema
```

## Deployment

Connected to Vercel — pushes to `main` deploy automatically.

Set all production env vars in Vercel (especially `NEXT_PUBLIC_SITE_URL`, Supabase keys, Resend, and `CRON_SECRET`).

## Data

Driving rules live in `lib/data.ts` and `data/countries.json`. Coverage is growing route by route; unverified pairs show an explicit “no data” state instead of guessing.

To add or update a route, edit the rules in `lib/data.ts`, set `lastUpdated` and official `sources`, then redeploy.

## License

Private project.
