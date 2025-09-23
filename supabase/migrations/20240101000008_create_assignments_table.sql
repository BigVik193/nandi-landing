-- Create assignments table
create table if not exists public.assignments (
  id bigint primary key generated always as identity,
  player_id bigint not null references public.players(id) on delete cascade,
  experiment_id bigint not null references public.experiments(id) on delete cascade,
  experiment_arm_id bigint not null references public.experiment_arms(id) on delete cascade,
  assigned_at timestamptz default now() not null,
  
  -- Ensure unique assignment per player per experiment
  unique(player_id, experiment_id)
);

-- Add RLS policies
alter table public.assignments enable row level security;

-- Add indexes
create index idx_assignments_player_id on public.assignments(player_id);
create index idx_assignments_experiment_id on public.assignments(experiment_id);
create index idx_assignments_experiment_arm_id on public.assignments(experiment_arm_id);
create index idx_assignments_assigned_at on public.assignments(assigned_at);

-- Note: The constraint that experiment_arm belongs to the experiment 
-- will be enforced at the application level, since PostgreSQL doesn't 
-- support this type of cross-table validation in foreign key constraints