-- Create purchases table
create table if not exists public.purchases (
  id bigint primary key generated always as identity,
  player_id bigint not null references public.players(id) on delete cascade,
  sku_variant_id bigint not null references public.sku_variants(id) on delete cascade,
  experiment_id bigint references public.experiments(id) on delete set null,
  experiment_arm_id bigint references public.experiment_arms(id) on delete set null,
  transaction_id text not null, -- Platform transaction ID
  receipt_data text, -- Legacy receipt data (deprecated - use App Store Server API for Apple 2025)
  platform text not null check (platform in ('ios', 'android')),
  price_cents bigint not null,
  currency text not null,
  quantity bigint not null default 1,
  status text not null default 'pending' check (status in ('pending', 'verified', 'failed', 'refunded')),
  verified_at timestamptz,
  -- Apple StoreKit 2 (2025) fields
  app_transaction_id text, -- Apple StoreKit 2 new field (iOS 15+)
  original_transaction_id text, -- Apple original transaction ID
  web_order_line_item_id text, -- Apple web order line item ID
  subscription_group_id text, -- Apple subscription group identifier
  offer_identifier text, -- Apple promotional offer identifier
  offer_type text check (offer_type in ('introductory', 'promotional', 'subscription_offer_code')),
  original_platform text check (original_platform in ('ios', 'macos', 'tvos', 'visionos', 'android')),
  auto_renewing boolean, -- For subscription auto-renewal status
  expires_date timestamptz, -- For subscriptions
  grace_period_expires_date timestamptz, -- Apple grace period
  cancellation_date timestamptz, -- When subscription was cancelled
  cancellation_reason integer, -- Reason code for cancellation
  is_trial_period boolean default false,
  is_intro_offer_period boolean default false,
  revocation_date timestamptz, -- Apple revocation date
  revocation_reason integer, -- Apple revocation reason
  -- Google Play Billing (2025) fields
  order_id text, -- Google Play order ID
  purchase_token text, -- Google Play purchase token
  purchase_state integer, -- Google Play purchase state (0=purchased, 1=canceled)
  consumption_state integer, -- Google Play consumption state (0=not_consumed, 1=consumed)
  linked_purchase_token text, -- Google Play linked purchase token for subscription upgrades
  acknowledgement_state integer, -- Google Play acknowledgement state
  metadata jsonb default '{}',
  purchased_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique transaction_id per platform
  unique(transaction_id, platform)
);

-- Create updated_at trigger
create trigger purchases_updated_at
  before update on public.purchases
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.purchases enable row level security;

-- Add unique constraints for platform-specific identifiers
alter table public.purchases 
add constraint unique_apple_transaction unique (original_transaction_id) deferrable initially deferred;

alter table public.purchases 
add constraint unique_google_purchase_token unique (purchase_token) deferrable initially deferred;

-- Add indexes
create index idx_purchases_player_id on public.purchases(player_id);
create index idx_purchases_sku_variant_id on public.purchases(sku_variant_id);
create index idx_purchases_experiment_id on public.purchases(experiment_id);
create index idx_purchases_experiment_arm_id on public.purchases(experiment_arm_id);
create index idx_purchases_transaction_id on public.purchases(transaction_id);
create index idx_purchases_platform on public.purchases(platform);
create index idx_purchases_status on public.purchases(status);
create index idx_purchases_purchased_at on public.purchases(purchased_at);
create index idx_purchases_verified_at on public.purchases(verified_at);

-- Add indexes for 2025 platform fields
create index idx_purchases_app_transaction_id on public.purchases(app_transaction_id);
create index idx_purchases_order_id on public.purchases(order_id);
create index idx_purchases_purchase_token on public.purchases(purchase_token);
create index idx_purchases_original_transaction_id on public.purchases(original_transaction_id);
create index idx_purchases_subscription_group_id on public.purchases(subscription_group_id);
create index idx_purchases_expires_date on public.purchases(expires_date);
create index idx_purchases_auto_renewing on public.purchases(auto_renewing);
create index idx_purchases_cancellation_date on public.purchases(cancellation_date);
create index idx_purchases_original_platform on public.purchases(original_platform);

-- Add composite indexes for common queries
create index idx_purchases_platform_state on public.purchases(platform, purchase_state);
create index idx_purchases_player_expires on public.purchases(player_id, expires_date);
create index idx_purchases_subscription_status on public.purchases(subscription_group_id, auto_renewing, expires_date);