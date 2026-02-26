-- Games table: one row per user's current/latest game
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quarter integer not null default 0,
  cash numeric not null default 1000000,
  engineers integer not null default 4,
  sales_staff integer not null default 2,
  product_quality numeric not null default 50,
  status text not null default 'playing' check (status in ('playing', 'won', 'lost')),
  cumulative_profit numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- History: last N quarters per game for dashboard
create table if not exists public.game_history (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  quarter integer not null,
  cash numeric not null,
  revenue numeric not null,
  net_income numeric not null,
  engineers integer not null,
  sales_staff integer not null,
  created_at timestamptz default now(),
  unique(game_id, quarter)
);

-- RLS
alter table public.games enable row level security;
alter table public.game_history enable row level security;

create policy "Users can view own games"
  on public.games for select
  using (auth.uid() = user_id);

create policy "Users can insert own games"
  on public.games for insert
  with check (auth.uid() = user_id);

create policy "Users can update own games"
  on public.games for update
  using (auth.uid() = user_id);

create policy "Users can view own game history"
  on public.game_history for select
  using (
    exists (
      select 1 from public.games g
      where g.id = game_id and g.user_id = auth.uid()
    )
  );

create policy "Users can insert own game history"
  on public.game_history for insert
  with check (
    exists (
      select 1 from public.games g
      where g.id = game_id and g.user_id = auth.uid()
    )
  );
