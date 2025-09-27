-- Migration: Setup Pro Subscription Price Optimization Experiment
-- This migration creates SKU variants, experiment, experiment arms, and test players
-- for the "pro" subscription virtual item (iOS only)

-- First, create SKU variants for the "pro" subscription with different price points
-- Based on min_price_cents (50) and max_price_cents (150), creating variants within that range
INSERT INTO sku_variants (
    virtual_item_id,
    app_store_product_id,
    price_cents,
    quantity,
    currency,
    platform,
    product_type,
    name,
    status
) VALUES 
    -- Control variant (minimum price)
    ('d0923341-c0ae-48b6-bdf0-3a1ca2159bd2', 'com.nandi.pro.subscription.low', 50, 1, 'USD', 'ios', 'auto_renewable_subscription', 'Pro Subscription - Low Price', 'active'),
    
    -- Mid-range variant
    ('d0923341-c0ae-48b6-bdf0-3a1ca2159bd2', 'com.nandi.pro.subscription.mid', 100, 1, 'USD', 'ios', 'auto_renewable_subscription', 'Pro Subscription - Mid Price', 'active'),
    
    -- High-range variant (maximum price)
    ('d0923341-c0ae-48b6-bdf0-3a1ca2159bd2', 'com.nandi.pro.subscription.high', 150, 1, 'USD', 'ios', 'auto_renewable_subscription', 'Pro Subscription - High Price', 'active');

-- Create an experiment for testing the pro subscription pricing
INSERT INTO experiments (
    game_id,
    virtual_item_id,
    name,
    description,
    status,
    traffic_allocation,
    start_date,
    metadata
) VALUES (
    '75b0e38d-1a4f-4722-be0e-9ecbc9155930',
    'd0923341-c0ae-48b6-bdf0-3a1ca2159bd2',
    'Pro Subscription Price Optimization',
    'A/B/C test to optimize pricing for the pro subscription (no ads) - iOS only',
    'running',
    100.00,
    NOW(),
    '{"experiment_type": "price_optimization", "target_metric": "conversion_rate", "duration_days": 30, "platform": "ios"}'
);

-- Create experiment arms linking the SKU variants to the experiment
-- Using CTEs for cleaner code and proper referencing
WITH experiment_data AS (
    SELECT id as experiment_id 
    FROM experiments 
    WHERE virtual_item_id = 'd0923341-c0ae-48b6-bdf0-3a1ca2159bd2' 
    AND name = 'Pro Subscription Price Optimization'
),
sku_variants_data AS (
    SELECT 
        id as sku_variant_id,
        price_cents,
        name
    FROM sku_variants 
    WHERE virtual_item_id = 'd0923341-c0ae-48b6-bdf0-3a1ca2159bd2'
    AND platform = 'ios'
)
INSERT INTO experiment_arms (
    experiment_id,
    sku_variant_id,
    name,
    traffic_weight,
    is_control,
    metadata
)
SELECT 
    e.experiment_id,
    s.sku_variant_id,
    CASE 
        WHEN s.price_cents = 50 THEN 'Control - $0.50'
        WHEN s.price_cents = 100 THEN 'Variant A - $1.00'
        WHEN s.price_cents = 150 THEN 'Variant B - $1.50'
    END as name,
    33.33 as traffic_weight, -- Equal distribution across 3 variants
    CASE WHEN s.price_cents = 50 THEN true ELSE false END as is_control,
    jsonb_build_object(
        'price_cents', s.price_cents,
        'price_tier', 
        CASE 
            WHEN s.price_cents = 50 THEN 'low'
            WHEN s.price_cents = 100 THEN 'medium'
            WHEN s.price_cents = 150 THEN 'high'
        END,
        'platform', 'ios'
    ) as metadata
FROM experiment_data e
CROSS JOIN sku_variants_data s;

-- Create sample iOS players for testing the experiment
INSERT INTO players (
    game_id,
    external_player_id,
    device_id,
    platform,
    app_version,
    sdk_version
) VALUES 
    -- iOS test players
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_001', 'device_ios_001', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_002', 'device_ios_002', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_003', 'device_ios_003', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_004', 'device_ios_004', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_005', 'device_ios_005', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_006', 'device_ios_006', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_007', 'device_ios_007', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_008', 'device_ios_008', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_009', 'device_ios_009', 'ios', '1.0.0', '1.0.0'),
    ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'test_player_ios_010', 'device_ios_010', 'ios', '1.0.0', '1.0.0');

-- Verification queries (commented out for migration, but useful for manual testing)
/*
-- 1. Check SKU variants created
SELECT 
    sv.id,
    sv.app_store_product_id,
    sv.price_cents,
    sv.name,
    sv.platform,
    sv.product_type
FROM sku_variants sv
WHERE sv.virtual_item_id = 'd0923341-c0ae-48b6-bdf0-3a1ca2159bd2'
AND sv.platform = 'ios'
ORDER BY sv.price_cents;

-- 2. Check experiment and arms
SELECT 
    e.name as experiment_name,
    e.status,
    e.traffic_allocation,
    ea.name as arm_name,
    ea.traffic_weight,
    ea.is_control,
    sv.price_cents
FROM experiments e
JOIN experiment_arms ea ON e.id = ea.experiment_id
JOIN sku_variants sv ON ea.sku_variant_id = sv.id
WHERE e.virtual_item_id = 'd0923341-c0ae-48b6-bdf0-3a1ca2159bd2'
AND sv.platform = 'ios'
ORDER BY sv.price_cents;

-- 3. Check players created
SELECT 
    COUNT(*) as total_players,
    platform
FROM players 
WHERE game_id = '75b0e38d-1a4f-4722-be0e-9ecbc9155930'
AND platform = 'ios'
GROUP BY platform;
*/