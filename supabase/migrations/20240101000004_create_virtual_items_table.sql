-- Create virtual_items table
create table if not exists public.virtual_items (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  description text,
  type text not null check (type in ('consumable', 'non_consumable', 'subscription')),
  subtype text check (subtype in ('currency', 'item', 'resource', 'other')),
  price_tier integer,
  min_price_cents bigint,
  max_price_cents bigint,
  category text, -- For grouping items
  tags text[], -- For flexible categorization
  metadata jsonb default '{}',
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique name per game
  unique(game_id, name),
  
  -- Ensure price range is valid
  check (min_price_cents is null or max_price_cents is null or min_price_cents <= max_price_cents)
);

-- Create updated_at trigger
create trigger virtual_items_updated_at
  before update on public.virtual_items
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.virtual_items enable row level security;

-- Developers can manage virtual items of their games
create policy "Developers can manage virtual items of their games"
on public.virtual_items for all
to authenticated
using (
  game_id in (
    select id from public.games where developer_id = auth.uid()
  )
);

-- Add indexes
create index idx_virtual_items_game_id on public.virtual_items(game_id);
create index idx_virtual_items_type on public.virtual_items(type);
create index idx_virtual_items_subtype on public.virtual_items(subtype);
create index idx_virtual_items_price_tier on public.virtual_items(price_tier);
create index idx_virtual_items_category on public.virtual_items(category);
create index idx_virtual_items_tags on public.virtual_items using gin(tags);
create index idx_virtual_items_status on public.virtual_items(status);
create index idx_virtual_items_created_at on public.virtual_items(created_at);