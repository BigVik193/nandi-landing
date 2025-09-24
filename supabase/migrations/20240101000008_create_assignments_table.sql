-- Create assignments table
create table if not exists public.assignments (
  id bigint primary key generated always as identity,
  player_id bigint not null references public.players(id) on delete cascade,
  experiment_id bigint not null references public.experiments(id) on delete cascade,
  experiment_arm_id bigint not null references public.experiment_arms(id) on delete cascade,
  assigned_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique assignment per player per experiment
  unique(player_id, experiment_id)
);

-- Add RLS policies
alter table public.assignments enable row level security;

-- Developers can manage assignments of their experiments
create policy "Developers can manage assignments of their experiments"
on public.assignments for all
to authenticated
using (
  experiment_id in (
    select e.id from public.experiments e
    join public.games g on e.game_id = g.id
    where g.developer_id = auth.uid()
  )
);

-- Create updated_at trigger
create trigger assignments_updated_at
  before update on public.assignments
  for each row execute function public.handle_updated_at();

-- Add utility functions
-- Function to get player's current experiment assignments
create or replace function public.get_player_assignments(p_player_id bigint)
returns table (
  experiment_id bigint,
  experiment_name text,
  experiment_arm_id bigint,
  arm_name text,
  sku_variant_id bigint
)
language sql
security definer
as $$
  select 
    a.experiment_id,
    e.name as experiment_name,
    a.experiment_arm_id,
    ea.name as arm_name,
    ea.sku_variant_id
  from public.assignments a
  join public.experiments e on a.experiment_id = e.id
  join public.experiment_arms ea on a.experiment_arm_id = ea.id
  where a.player_id = p_player_id
  and e.status = 'running';
$$;

-- Add indexes
create index idx_assignments_player_id on public.assignments(player_id);
create index idx_assignments_experiment_id on public.assignments(experiment_id);
create index idx_assignments_experiment_arm_id on public.assignments(experiment_arm_id);
create index idx_assignments_assigned_at on public.assignments(assigned_at);

-- Add constraint to ensure experiment_arm belongs to the correct experiment
-- This requires a composite foreign key approach
alter table public.assignments 
add constraint fk_assignments_experiment_arm_experiment 
foreign key (experiment_id, experiment_arm_id) 
references public.experiment_arms(experiment_id, id) 
on delete cascade;