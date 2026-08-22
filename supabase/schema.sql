-- Davai — progress storage
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
--
-- Design choice: the app's UserContext reducer already owns one coherent
-- state shape (xp, streak, completedLessons, srsState, unlockedBadges, ...).
-- Rather than splitting that into many normalized tables, we persist it as a
-- single jsonb blob per user — one row, upserted on every change. Simpler to
-- keep in sync with the reducer, and plenty for this app's access patterns.

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "Users read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own progress"
  on public.progress for delete
  using (auth.uid() = user_id);

-- Keep updated_at fresh on every upsert.
create or replace function public.set_progress_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists progress_set_updated_at on public.progress;
create trigger progress_set_updated_at
  before update on public.progress
  for each row execute procedure public.set_progress_updated_at();

-- ── Text-to-speech cache ──
-- Public bucket holding generated pronunciation clips, keyed by a hash of
-- the source text (see supabase/functions/tts). Public + read-only from the
-- client: nobody can upload directly, only the tts Edge Function (via the
-- service role key) writes here.
insert into storage.buckets (id, name, public)
values ('tts-cache', 'tts-cache', true)
on conflict (id) do nothing;

create policy "Anyone can read cached audio"
  on storage.objects for select
  using (bucket_id = 'tts-cache');
