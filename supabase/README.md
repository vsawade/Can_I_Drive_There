# Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Copy your project URL and **service role** key (Settings → API)
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_API_KEY=choose-a-strong-secret
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=reminders@yourdomain.com
CRON_SECRET=choose-a-strong-cron-secret
```

The app uses the **service role key** server-side only. Never expose it to the browser.

Without Supabase env vars, data falls back to `.data/` JSON files (local dev only).

## Email reminders

Reminder emails use [Resend](https://resend.com). When a user saves a trip reminder, the app sends the checklist link immediately and stores a scheduled reminder for 3 days before the trip.

For deployed scheduled reminders:

- Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CRON_SECRET` in Vercel project environment variables.
- Run `supabase/schema.sql` again if your project was created before scheduled reminders were added.
- `vercel.json` calls `/api/cron/send-reminders` every day at 13:00 UTC. Vercel sends `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is configured.

## Admin

- Login: `/admin/login`
- Reports queue: `/admin/reports`
- Data dashboard: `/admin/data-status`
