-- Create sessions table
create table if not exists public.sessions (
  id bigint primary key generated always as identity,
  player_id bigint not null references public.players(id) on delete cascade,
  session_token text unique not null,
  device_id text,
  platform text check (platform in ('ios', 'android')),
  app_version text,
  sdk_version text,
  ip_address inet,
  user_agent text,
  metadata jsonb default '{}',
  started_at timestamptz default now() not null,
  ended_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure ended_at is after started_at
  check (ended_at is null or ended_at > started_at)
);

-- Create updated_at trigger
create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.sessions enable row level security;

-- Add indexes
create index idx_sessions_player_id on public.sessions(player_id);
create index idx_sessions_session_token on public.sessions(session_token);
create index idx_sessions_device_id on public.sessions(device_id);
create index idx_sessions_platform on public.sessions(platform);
create index idx_sessions_started_at on public.sessions(started_at);
create index idx_sessions_ended_at on public.sessions(ended_at);
create index idx_sessions_created_at on public.sessions(created_at);