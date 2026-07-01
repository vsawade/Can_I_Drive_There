-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

create table if not exists outdated_reports (
  id uuid primary key default gen_random_uuid(),
  origin_country text not null,
  destination_country text not null,
  travel_type text not null default 'tourist',
  message text not null,
  source_url text,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'applied')),
  reported_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outdated_reports_status_idx on outdated_reports (status);
create index if not exists outdated_reports_reported_at_idx on outdated_reports (reported_at desc);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  origin_country text,
  destination_country text,
  rule_found boolean,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_idx on analytics_events (event);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);

create table if not exists trip_reminders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  origin_country text not null,
  destination_country text not null,
  trip_date date not null,
  reminder_date date not null default current_date,
  stay_length integer not null,
  travel_type text not null default 'tourist',
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

alter table trip_reminders add column if not exists reminder_date date;
alter table trip_reminders add column if not exists sent_at timestamptz;
alter table trip_reminders add column if not exists last_error text;
update trip_reminders
set reminder_date = greatest(trip_date - 3, current_date)
where reminder_date is null;
alter table trip_reminders alter column reminder_date set default current_date;
alter table trip_reminders alter column reminder_date set not null;

create index if not exists trip_reminders_trip_date_idx on trip_reminders (trip_date);
create index if not exists trip_reminders_due_idx on trip_reminders (reminder_date, sent_at);

-- Optional: enable RLS and deny public access (service role bypasses RLS)
alter table outdated_reports enable row level security;
alter table analytics_events enable row level security;
alter table trip_reminders enable row level security;

drop policy if exists "service role only" on outdated_reports;
drop policy if exists "service role only" on analytics_events;
drop policy if exists "service role only" on trip_reminders;

create policy "service role only" on outdated_reports for all using (false);
create policy "service role only" on analytics_events for all using (false);
create policy "service role only" on trip_reminders for all using (false);
