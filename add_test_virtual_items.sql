-- Add virtual items and SKU variants for test game
-- Game ID: 75b0e38d-1a4f-4722-be0e-9ecbc9155930

-- Add virtual items for the test game (pro subscription already exists)
-- Note: id will be auto-generated UUID, item_id is the developer-friendly string
INSERT INTO virtual_items (game_id, item_id, name, description, type, subtype, status) VALUES
  ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'gold_coins', 'Gold Coins', 'Premium currency for the game', 'consumable', 'currency', 'active'),
  ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'health_potion', 'Health Potion', 'Restores 50 HP', 'consumable', 'item', 'active'),
  ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'magic_scroll', 'Magic Scroll', 'Casts a powerful spell', 'consumable', 'item', 'active'),
  ('75b0e38d-1a4f-4722-be0e-9ecbc9155930', 'energy_crystal', 'Energy Crystal', 'Restores energy to continue playing', 'consumable', 'item', 'active')
ON CONFLICT (game_id, item_id) DO NOTHING;

-- Add SKU variants for each virtual item (iOS platform)
-- Store SKU variant IDs in variables for experiments
DO $$
DECLARE
    -- Get the actual UUID IDs for the virtual items we just created
    gold_coins_uuid UUID;
    health_potion_uuid UUID;
    magic_scroll_uuid UUID;
    energy_crystal_uuid UUID;
    
    -- SKU variant IDs
    gold_small_id UUID := gen_random_uuid();
    gold_medium_id UUID := gen_random_uuid();
    gold_large_id UUID := gen_random_uuid();
    gold_large_variant_id UUID := gen_random_uuid();
    health_pack_id UUID := gen_random_uuid();
    health_pack_variant_id UUID := gen_random_uuid();
    magic_pack_id UUID := gen_random_uuid();
    energy_pack_id UUID := gen_random_uuid();
    
    -- Experiment IDs
    gold_experiment_id UUID := gen_random_uuid();
    health_experiment_id UUID := gen_random_uuid();
BEGIN
    -- Get the UUIDs for the virtual items by their item_id
    SELECT id INTO gold_coins_uuid FROM virtual_items WHERE game_id = '75b0e38d-1a4f-4722-be0e-9ecbc9155930' AND item_id = 'gold_coins';
    SELECT id INTO health_potion_uuid FROM virtual_items WHERE game_id = '75b0e38d-1a4f-4722-be0e-9ecbc9155930' AND item_id = 'health_potion';
    SELECT id INTO magic_scroll_uuid FROM virtual_items WHERE game_id = '75b0e38d-1a4f-4722-be0e-9ecbc9155930' AND item_id = 'magic_scroll';
    SELECT id INTO energy_crystal_uuid FROM virtual_items WHERE game_id = '75b0e38d-1a4f-4722-be0e-9ecbc9155930' AND item_id = 'energy_crystal';
    
    -- Insert SKU variants using the actual UUID references
    INSERT INTO sku_variants (id, virtual_item_id, app_store_product_id, price_cents, quantity, currency, platform, product_type, status) VALUES
      -- Gold Coins variants
      (gold_small_id, gold_coins_uuid, 'com.nandi.testgame.gold_small', 99, 100, 'USD', 'ios', 'consumable', 'active'),
      (gold_medium_id, gold_coins_uuid, 'com.nandi.testgame.gold_medium', 499, 500, 'USD', 'ios', 'consumable', 'active'),
      (gold_large_id, gold_coins_uuid, 'com.nandi.testgame.gold_large', 999, 1200, 'USD', 'ios', 'consumable', 'active'),
      (gold_large_variant_id, gold_coins_uuid, 'com.nandi.testgame.gold_large_v2', 899, 1200, 'USD', 'ios', 'consumable', 'active'), -- A/B test variant
      
      -- Health Potion variants
      (health_pack_id, health_potion_uuid, 'com.nandi.testgame.health_pack', 199, 5, 'USD', 'ios', 'consumable', 'active'),
      (health_pack_variant_id, health_potion_uuid, 'com.nandi.testgame.health_pack_v2', 179, 5, 'USD', 'ios', 'consumable', 'active'), -- A/B test variant
      
      -- Magic Scroll variants
      (magic_pack_id, magic_scroll_uuid, 'com.nandi.testgame.magic_pack', 299, 3, 'USD', 'ios', 'consumable', 'active'),
      
      -- Energy Crystal variants
      (energy_pack_id, energy_crystal_uuid, 'com.nandi.testgame.energy_pack', 399, 10, 'USD', 'ios', 'consumable', 'active');

    -- Create experiments for A/B testing using UUID references
    INSERT INTO experiments (id, game_id, virtual_item_id, name, description, status, traffic_allocation, start_date) VALUES
      (gold_experiment_id, '75b0e38d-1a4f-4722-be0e-9ecbc9155930', gold_coins_uuid, 'Gold Large Pack Price Test', 'Testing $8.99 vs $9.99 for large gold pack', 'running', 100.00, NOW()),
      (health_experiment_id, '75b0e38d-1a4f-4722-be0e-9ecbc9155930', health_potion_uuid, 'Health Pack Price Test', 'Testing $1.79 vs $1.99 for health pack', 'running', 100.00, NOW());

    -- Create experiment arms for gold coins experiment
    INSERT INTO experiment_arms (id, experiment_id, sku_variant_id, name, traffic_weight, is_control) VALUES
      (gen_random_uuid(), gold_experiment_id, gold_large_id, 'Control - $9.99', 50.00, true),
      (gen_random_uuid(), gold_experiment_id, gold_large_variant_id, 'Variant - $8.99', 50.00, false);

    -- Create experiment arms for health potion experiment  
    INSERT INTO experiment_arms (id, experiment_id, sku_variant_id, name, traffic_weight, is_control) VALUES
      (gen_random_uuid(), health_experiment_id, health_pack_id, 'Control - $1.99', 50.00, true),
      (gen_random_uuid(), health_experiment_id, health_pack_variant_id, 'Variant - $1.79', 50.00, false);
      
END $$;