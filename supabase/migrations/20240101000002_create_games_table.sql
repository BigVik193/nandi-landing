-- Create games table
create table if not exists public.games (
  id bigint primary key generated always as identity,
  developer_id uuid not null references public.developers(id) on delete cascade,
  name text not null,
  bundle_id text not null, -- App Store/Play Store bundle identifier
  platform text not null check (platform in ('ios', 'android', 'both')),
  product_type text check (product_type in ('consumable', 'non_consumable', 'auto_renewable_subscription', 'non_renewing_subscription')),
  package_name text,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  -- Enhanced onboarding fields
  genre text,
  art_style text,
  target_region text,
  monetization_model text,
  tech_stack text,
  store_state text check (store_state in ('augment', 'create')),
  store_surfaces text check (store_surfaces in ('inapp', 'both')),
  app_id text unique,
  integration_status text default 'pending' check (integration_status in ('pending', 'configured', 'tested', 'active')),
  sdk_version text,
  last_diagnostic_at timestamptz,
  development_stage text check (development_stage in ('concept', 'alpha', 'beta', 'live')),
  monthly_active_users bigint,
  current_revenue_cents bigint,
  launch_date date,
  game_engine_version text,
  target_revenue_cents bigint,
  app_store_team_id text,
  google_play_app_id text,
  analytics_platform text,
  attribution_partner text,
  webhook_endpoint text,
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

-- Developers can only access their own games
create policy "Developers can manage their own games"
on public.games for all
to authenticated
using (developer_id = auth.uid());

-- Add indexes
create index idx_games_developer_id on public.games(developer_id);
create index idx_games_bundle_id on public.games(bundle_id);
create index idx_games_platform on public.games(platform);
create index idx_games_product_type on public.games(product_type);
create index idx_games_package_name on public.games(package_name);
create index idx_games_status on public.games(status);
create index idx_games_genre on public.games(genre);
create index idx_games_monetization_model on public.games(monetization_model);
create index idx_games_tech_stack on public.games(tech_stack);
create index idx_games_app_id on public.games(app_id);
create index idx_games_integration_status on public.games(integration_status);
create index idx_games_created_at on public.games(created_at);