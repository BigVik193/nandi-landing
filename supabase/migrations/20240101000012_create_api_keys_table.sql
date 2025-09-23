-- Create api_keys table
create table if not exists public.api_keys (
  id bigint primary key generated always as identity,
  game_id bigint not null references public.games(id) on delete cascade,
  name text not null,
  key_hash text unique not null, -- Hashed API key for security
  key_prefix text not null, -- First few characters for identification
  permissions jsonb default '{"read": true, "write": true}',
  is_active boolean not null default true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique name per game
  unique(game_id, name)
);

-- Create updated_at trigger
create trigger api_keys_updated_at
  before update on public.api_keys
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.api_keys enable row level security;

-- Add indexes
create index idx_api_keys_game_id on public.api_keys(game_id);
create index idx_api_keys_key_hash on public.api_keys(key_hash);
create index idx_api_keys_key_prefix on public.api_keys(key_prefix);
create index idx_api_keys_is_active on public.api_keys(is_active);
create index idx_api_keys_expires_at on public.api_keys(expires_at);
create index idx_api_keys_last_used_at on public.api_keys(last_used_at);
create index idx_api_keys_created_at on public.api_keys(created_at);