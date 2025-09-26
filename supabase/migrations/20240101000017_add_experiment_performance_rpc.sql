-- Create RPC function for experiment performance
create or replace function public.get_experiment_performance(
  p_experiment_id uuid,
  p_timeframe text default '7d'
)
returns table (
  arm_id uuid,
  arm_name text,
  is_control boolean,
  traffic_weight decimal,
  sku_variant_id uuid,
  app_store_product_id text,
  price_cents bigint,
  quantity bigint,
  currency text,
  platform text,
  impressions bigint,
  views bigint,
  purchases bigint,
  revenue bigint,
  conversion_rate decimal,
  average_revenue_per_user decimal
)
language plpgsql
security definer
as $$
declare
  start_date timestamptz;
begin
  -- Calculate date filter
  if p_timeframe = 'all' then
    start_date := '2020-01-01'::timestamptz;
  else
    case p_timeframe
      when '7d' then start_date := now() - interval '7 days';
      when '30d' then start_date := now() - interval '30 days';
      when '90d' then start_date := now() - interval '90 days';
      else start_date := now() - interval '7 days';
    end case;
  end if;

  return query
  with experiment_arms_data as (
    select 
      ea.id as arm_id,
      ea.name as arm_name,
      ea.is_control,
      ea.traffic_weight,
      ea.sku_variant_id,
      sv.app_store_product_id,
      sv.price_cents,
      sv.quantity,
      sv.currency,
      sv.platform
    from experiment_arms ea
    join sku_variants sv on ea.sku_variant_id = sv.id
    where ea.experiment_id = p_experiment_id
  ),
  event_metrics as (
    select 
      e.experiment_arm_id,
      count(*) filter (where e.event_type = 'store_view') as store_views,
      count(*) filter (where e.event_type = 'item_view') as item_views,
      count(*) filter (where e.event_type = 'purchase_complete') as purchase_events
    from events e
    where e.experiment_id = p_experiment_id
      and e.timestamp >= start_date
      and e.event_type in ('store_view', 'item_view', 'purchase_complete')
    group by e.experiment_arm_id
  ),
  purchase_metrics as (
    select 
      p.experiment_arm_id,
      count(*) as verified_purchases,
      sum(p.price_cents * p.quantity) as total_revenue
    from purchases p
    where p.experiment_id = p_experiment_id
      and p.status = 'verified'
      and p.purchased_at >= start_date
    group by p.experiment_arm_id
  )
  select 
    ead.arm_id,
    ead.arm_name,
    ead.is_control,
    ead.traffic_weight,
    ead.sku_variant_id,
    ead.app_store_product_id,
    ead.price_cents,
    ead.quantity,
    ead.currency,
    ead.platform,
    coalesce(em.store_views, 0)::bigint as impressions,
    coalesce(em.item_views, 0)::bigint as views,
    coalesce(pm.verified_purchases, 0)::bigint as purchases,
    coalesce(pm.total_revenue, 0)::bigint as revenue,
    case 
      when coalesce(em.store_views, 0) > 0 
      then (coalesce(pm.verified_purchases, 0)::decimal / em.store_views * 100)
      else 0::decimal
    end as conversion_rate,
    case 
      when coalesce(em.store_views, 0) > 0 
      then (coalesce(pm.total_revenue, 0)::decimal / em.store_views)
      else 0::decimal
    end as average_revenue_per_user
  from experiment_arms_data ead
  left join event_metrics em on ead.arm_id = em.experiment_arm_id
  left join purchase_metrics pm on ead.arm_id = pm.experiment_arm_id
  order by ead.traffic_weight desc;
end;
$$;

-- Grant access to authenticated users
grant execute on function public.get_experiment_performance(uuid, text) to authenticated;

-- Add comment
comment on function public.get_experiment_performance(uuid, text) is 
'Efficiently calculates experiment performance metrics including conversion rates, revenue, and traffic weights for all arms in an experiment within a specified timeframe.';