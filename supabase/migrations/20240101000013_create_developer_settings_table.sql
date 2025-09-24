-- Create developer settings table for preferences
create table if not exists public.developer_settings (
  id bigint primary key generated always as identity,
  developer_id uuid not null references public.developers(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  unique(developer_id, setting_key)
);

-- Create updated_at trigger for developer_settings
create trigger developer_settings_updated_at
  before update on public.developer_settings
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.developer_settings enable row level security;

-- Developers can manage their own settings
create policy "Developers can manage their own settings"
on public.developer_settings for all
to authenticated
using (developer_id = auth.uid());

-- Add indexes
create index idx_developer_settings_developer_id on public.developer_settings(developer_id);
create index idx_developer_settings_key on public.developer_settings(setting_key);

-- Add helper functions for settings management
create or replace function public.get_developer_setting(
  dev_id uuid,
  key text
) returns jsonb as $$
  select setting_value 
  from public.developer_settings 
  where developer_id = dev_id and setting_key = key;
$$ language sql security definer;

create or replace function public.set_developer_setting(
  dev_id uuid,
  key text,
  value jsonb
) returns void as $$
  insert into public.developer_settings (developer_id, setting_key, setting_value)
  values (dev_id, key, value)
  on conflict (developer_id, setting_key)
  do update set 
    setting_value = excluded.setting_value,
    updated_at = now();
$$ language sql security definer;

-- Add analytics view for experiment performance
create view public.experiment_performance as
select 
  e.id as experiment_id,
  e.name as experiment_name,
  e.game_id,
  ea.id as arm_id,
  ea.name as arm_name,
  ea.is_control,
  count(distinct a.player_id) as assigned_players,
  count(p.id) as total_purchases,
  sum(p.price_cents) as total_revenue_cents,
  avg(p.price_cents) as avg_purchase_cents
from public.experiments e
join public.experiment_arms ea on e.id = ea.experiment_id
left join public.assignments a on ea.id = a.experiment_arm_id
left join public.purchases p on a.player_id = p.player_id 
  and p.experiment_arm_id = ea.id
group by e.id, e.name, e.game_id, ea.id, ea.name, ea.is_control;

-- Grant access to the view
grant select on public.experiment_performance to authenticated;

-- Note: RLS policies cannot be applied to views, only tables
-- Access control is inherited from underlying tables (experiments, games, etc.)