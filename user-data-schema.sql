create table if not exists public.user_data (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  library jsonb default '{"continuing":[],"savedForLater":[],"finished":[]}'::jsonb,
  highlights jsonb default '[]'::jsonb,
  ratings jsonb default '{}'::jsonb,
  streak_count integer default 0,
  streak_week boolean[] default '{false,false,false,false,false,false,false}'::boolean[],
  last_finish_date text,
  is_subscribed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.user_data enable row level security;

create policy "Users can read own data" on public.user_data for select using (auth.uid() = user_id);
create policy "Users can insert own data" on public.user_data for insert with check (auth.uid() = user_id);
create policy "Users can update own data" on public.user_data for update using (auth.uid() = user_id);

create index if not exists idx_user_data_user_id on public.user_data(user_id);