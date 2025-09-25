-- Create players table
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  external_player_id text not null, -- Developer's internal player ID
  device_id text,
  platform text check (platform in ('ios', 'android', 'both')),
  app_version text,
  sdk_version text,
  first_seen_at timestamptz default now() not null,
  last_seen_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique external_player_id per game
  unique(game_id, external_player_id)
);

-- Create updated_at trigger
create trigger players_updated_at
  before update on public.players
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.players enable row level security;

-- Developers can manage players of their games
create policy "Developers can manage players of their games"
on public.players for all
to authenticated
using (
  game_id in (
    select id from public.games where developer_id = auth.uid()
  )
);

-- Add indexes
create index idx_players_game_id on public.players(game_id);
create index idx_players_external_player_id on public.players(external_player_id);
create index idx_players_device_id on public.players(device_id);
create index idx_players_platform on public.players(platform);
create index idx_players_first_seen_at on public.players(first_seen_at);
create index idx_players_last_seen_at on public.players(last_seen_at);