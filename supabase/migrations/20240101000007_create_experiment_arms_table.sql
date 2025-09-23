-- Create experiment_arms table
create table if not exists public.experiment_arms (
  id bigint primary key generated always as identity,
  experiment_id bigint not null references public.experiments(id) on delete cascade,
  sku_variant_id bigint not null references public.sku_variants(id) on delete cascade,
  name text not null,
  traffic_weight decimal(5,2) not null default 0.00 check (traffic_weight >= 0 and traffic_weight <= 100),
  is_control boolean not null default false,
  metadata jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique name per experiment
  unique(experiment_id, name),
  
  -- Ensure unique sku_variant per experiment
  unique(experiment_id, sku_variant_id)
);

-- Create updated_at trigger
create trigger experiment_arms_updated_at
  before update on public.experiment_arms
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.experiment_arms enable row level security;

-- Add indexes
create index idx_experiment_arms_experiment_id on public.experiment_arms(experiment_id);
create index idx_experiment_arms_sku_variant_id on public.experiment_arms(sku_variant_id);
create index idx_experiment_arms_is_control on public.experiment_arms(is_control);
create index idx_experiment_arms_traffic_weight on public.experiment_arms(traffic_weight);
create index idx_experiment_arms_created_at on public.experiment_arms(created_at);