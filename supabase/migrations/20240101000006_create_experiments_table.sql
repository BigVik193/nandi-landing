-- Create experiments table
create table if not exists public.experiments (
  id bigint primary key generated always as identity,
  game_id bigint not null references public.games(id) on delete cascade,
  virtual_item_id bigint not null references public.virtual_items(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'running', 'paused', 'completed', 'archived')),
  traffic_allocation decimal(5,2) not null default 100.00 check (traffic_allocation >= 0 and traffic_allocation <= 100),
  start_date timestamptz,
  end_date timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique name per game
  unique(game_id, name),
  
  -- Ensure end_date is after start_date
  check (end_date is null or start_date is null or end_date > start_date)
);

-- Create updated_at trigger
create trigger experiments_updated_at
  before update on public.experiments
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.experiments enable row level security;

-- Add indexes
create index idx_experiments_game_id on public.experiments(game_id);
create index idx_experiments_virtual_item_id on public.experiments(virtual_item_id);
create index idx_experiments_status on public.experiments(status);
create index idx_experiments_start_date on public.experiments(start_date);
create index idx_experiments_end_date on public.experiments(end_date);
create index idx_experiments_created_at on public.experiments(created_at);