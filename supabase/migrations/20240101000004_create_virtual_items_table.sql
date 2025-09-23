-- Create virtual_items table
create table if not exists public.virtual_items (
  id bigint primary key generated always as identity,
  game_id bigint not null references public.games(id) on delete cascade,
  name text not null,
  description text,
  type text not null check (type in ('consumable', 'non_consumable', 'subscription')),
  subtype text check (subtype in ('currency', 'item', 'resource', 'other')),
  metadata jsonb default '{}',
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique name per game
  unique(game_id, name)
);

-- Create updated_at trigger
create trigger virtual_items_updated_at
  before update on public.virtual_items
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.virtual_items enable row level security;

-- Add indexes
create index idx_virtual_items_game_id on public.virtual_items(game_id);
create index idx_virtual_items_type on public.virtual_items(type);
create index idx_virtual_items_subtype on public.virtual_items(subtype);
create index idx_virtual_items_status on public.virtual_items(status);
create index idx_virtual_items_created_at on public.virtual_items(created_at);