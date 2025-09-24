-- Create sku_variants table
create table if not exists public.sku_variants (
  id bigint primary key generated always as identity,
  virtual_item_id bigint not null references public.virtual_items(id) on delete cascade,
  app_store_product_id text not null, -- The actual product ID in App Store/Play Store
  price_cents bigint not null, -- Price in cents for consistency
  quantity bigint not null default 1, -- Quantity of the virtual item
  currency text not null default 'USD',
  platform text not null check (platform in ('ios', 'android', 'both')),
  product_type text check (product_type in ('consumable', 'non_consumable', 'auto_renewable_subscription', 'non_renewing_subscription')),
  package_name text, -- For Google Play bundle identifier verification
  name text, -- Optional display name for this variant
  metadata jsonb default '{}',
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique app_store_product_id per platform
  unique(app_store_product_id, platform)
);

-- Create updated_at trigger
create trigger sku_variants_updated_at
  before update on public.sku_variants
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.sku_variants enable row level security;

-- Developers can manage SKU variants of their virtual items
create policy "Developers can manage SKU variants of their virtual items"
on public.sku_variants for all
to authenticated
using (
  virtual_item_id in (
    select vi.id from public.virtual_items vi
    join public.games g on vi.game_id = g.id
    where g.developer_id = auth.uid()
  )
);

-- Add indexes
create index idx_sku_variants_virtual_item_id on public.sku_variants(virtual_item_id);
create index idx_sku_variants_app_store_product_id on public.sku_variants(app_store_product_id);
create index idx_sku_variants_platform on public.sku_variants(platform);
create index idx_sku_variants_product_type on public.sku_variants(product_type);
create index idx_sku_variants_package_name on public.sku_variants(package_name);
create index idx_sku_variants_price_cents on public.sku_variants(price_cents);
create index idx_sku_variants_status on public.sku_variants(status);
create index idx_sku_variants_created_at on public.sku_variants(created_at);