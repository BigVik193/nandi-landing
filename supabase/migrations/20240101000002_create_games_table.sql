-- Create games table
create table if not exists public.games (
  id bigint primary key generated always as identity,
  developer_id bigint not null references public.developers(id) on delete cascade,
  name text not null,
  bundle_id text not null, -- App Store/Play Store bundle identifier
  platform text not null check (platform in ('ios', 'android', 'both')),
  description text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique bundle_id per developer per platform
  unique(developer_id, bundle_id, platform)
);

-- Create updated_at trigger
create trigger games_updated_at
  before update on public.games
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.games enable row level security;

-- Add indexes
create index idx_games_developer_id on public.games(developer_id);
create index idx_games_bundle_id on public.games(bundle_id);
create index idx_games_platform on public.games(platform);
create index idx_games_status on public.games(status);
create index idx_games_created_at on public.games(created_at);