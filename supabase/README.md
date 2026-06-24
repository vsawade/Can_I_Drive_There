# Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Copy your project URL and **service role** key (Settings → API)
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_API_KEY=choose-a-strong-secret
```

The app uses the **service role key** server-side only. Never expose it to the browser.

Without Supabase env vars, data falls back to `.data/` JSON files (local dev only).

## Admin

- Login: `/admin/login`
- Reports queue: `/admin/reports`
- Data dashboard: `/admin/data-status`
