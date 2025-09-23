-- Create events table
create table if not exists public.events (
  id bigint primary key generated always as identity,
  player_id bigint not null references public.players(id) on delete cascade,
  session_id bigint references public.sessions(id) on delete set null,
  event_type text not null check (event_type in (
    'store_view', 'item_view', 'item_click', 'purchase_start', 'purchase_complete', 
    'purchase_fail', 'experiment_view', 'subscription_start', 'subscription_renew',
    'subscription_cancel', 'subscription_expire', 'offer_impression', 'custom'
  )),
  virtual_item_id bigint references public.virtual_items(id) on delete set null,
  sku_variant_id bigint references public.sku_variants(id) on delete set null,
  experiment_id bigint references public.experiments(id) on delete set null,
  experiment_arm_id bigint references public.experiment_arms(id) on delete set null,
  purchase_id bigint references public.purchases(id) on delete set null,
  -- Platform-specific tracking fields (2025)
  app_transaction_id text, -- Track app download transaction
  offer_identifier text, -- Track promotional offers
  subscription_group_id text, -- Track subscription groups
  billing_library_version text, -- Google Play Billing Library version
  store_version text, -- Platform store version
  properties jsonb default '{}',
  timestamp timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- Add RLS policies
alter table public.events enable row level security;

-- Add indexes
create index idx_events_player_id on public.events(player_id);
create index idx_events_session_id on public.events(session_id);
create index idx_events_event_type on public.events(event_type);
create index idx_events_virtual_item_id on public.events(virtual_item_id);
create index idx_events_sku_variant_id on public.events(sku_variant_id);
create index idx_events_experiment_id on public.events(experiment_id);
create index idx_events_experiment_arm_id on public.events(experiment_arm_id);
create index idx_events_purchase_id on public.events(purchase_id);
create index idx_events_timestamp on public.events(timestamp);
create index idx_events_created_at on public.events(created_at);

-- Add indexes for 2025 platform fields
create index idx_events_app_transaction_id on public.events(app_transaction_id);
create index idx_events_offer_identifier on public.events(offer_identifier);
create index idx_events_subscription_group_id on public.events(subscription_group_id);

-- Add composite indexes for common queries
create index idx_events_player_event_type_timestamp on public.events(player_id, event_type, timestamp);
create index idx_events_experiment_timestamp on public.events(experiment_id, timestamp);
create index idx_events_sku_variant_timestamp on public.events(sku_variant_id, timestamp);