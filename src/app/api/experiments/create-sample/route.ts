import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Use the provided game and virtual item data
    const targetGameId = "2a193504-52ed-4412-bec1-ad1d9af88f79"; // clash royale
    const targetVirtualItemId = "28adf946-6ec5-4830-8b17-34b0b9f1f032"; // test product
    
    // Verify the game exists (use provided or target)
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('id', gameId === 'clash-royale' ? targetGameId : gameId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Step 1: Get the existing virtual item instead of creating a new one
    const { data: virtualItem, error: virtualItemError } = await supabaseAdmin
      .from('virtual_items')
      .select('*')
      .eq('id', targetVirtualItemId)
      .single();

    if (virtualItemError || !virtualItem) {
      return NextResponse.json(
        { error: 'Virtual item not found: ' + (virtualItemError?.message || 'Missing test product') },
        { status: 404 }
      );
    }

    // Step 2: Get the existing SKU variants for this virtual item
    const { data: existingSkuVariants, error: skuError } = await supabaseAdmin
      .from('sku_variants')
      .select('*')
      .eq('virtual_item_id', targetVirtualItemId)
      .eq('status', 'active')
      .order('price_cents', { ascending: true });

    if (skuError || !existingSkuVariants || existingSkuVariants.length === 0) {
      return NextResponse.json(
        { error: 'No SKU variants found for this virtual item: ' + (skuError?.message || 'No variants available') },
        { status: 404 }
      );
    }

    // Map the existing SKU variants with experiment-specific metadata
    // Using your provided SKU variants:
    // test_product ($1.00), test_product_3 ($2.00), test_product_4 ($4.00), test_product_5 ($5.00)
    const createdSkuVariants = existingSkuVariants.map((sku, index) => ({
      ...sku,
      isControl: index === 0, // First variant (lowest price) as control
      variant_key: sku.app_store_product_id, // Use product ID as variant key
      metadata: {
        ...sku.metadata,
        platform_specific: false, // These are existing variants, not platform-specific
        original_variant: sku.app_store_product_id,
        experiment_role: index === 0 ? 'control' : `variant_${index}`,
        android_specific_settings: {
          acknowledgment_required: true,
          proration_mode: 1
        }
      }
    }));

    console.log(`Using ${createdSkuVariants.length} existing SKU variants:`, 
      createdSkuVariants.map(v => `${v.name} ($${v.price_cents/100})`)
    );

    // Step 3: Create the experiment using real data
    const { data: experiment, error: experimentError } = await supabaseAdmin
      .from('experiments')
      .insert({
        game_id: game.id,
        virtual_item_id: virtualItem.id,
        name: `${virtualItem.name} Price Optimization`,
        description: `Testing different price points for ${virtualItem.name} (${virtualItem.description}) to maximize conversion rate`,
        status: 'running',
        traffic_allocation: 100,
        start_date: new Date().toISOString(),
        end_date: null, // Let bandit algorithm decide when to stop
        metadata: {
          hypothesis: 'Different price points will show varying conversion rates',
          expectedDuration: '14-30 days',
          minimumSampleSize: 100,
          createdByAPI: true,
          game_name: game.name,
          virtual_item_type: virtualItem.type,
          virtual_item_category: virtualItem.category,
          price_range: {
            min_cents: Math.min(...createdSkuVariants.map(v => v.price_cents)),
            max_cents: Math.max(...createdSkuVariants.map(v => v.price_cents))
          }
        }
      })
      .select()
      .single();

    if (experimentError) {
      return NextResponse.json(
        { error: 'Failed to create experiment: ' + experimentError.message },
        { status: 400 }
      );
    }

    // Step 4: Create experiment arms - one per existing SKU variant
    const equalTrafficWeight = 100 / createdSkuVariants.length; // Equal traffic for each variant
    const createdArms = [];

    // Create one experiment arm per existing SKU variant
    for (const skuVariant of createdSkuVariants) {
      const { data: experimentArm, error: armError } = await supabaseAdmin
        .from('experiment_arms')
        .insert({
          experiment_id: experiment.id,
          sku_variant_id: skuVariant.id,
          name: `${skuVariant.name} - $${(skuVariant.price_cents / 100).toFixed(2)}`,
          traffic_weight: equalTrafficWeight,
          is_control: skuVariant.isControl,
          metadata: {
            priceInDollars: skuVariant.price_cents / 100,
            quantity: skuVariant.quantity,
            expectedPerformance: skuVariant.isControl ? 'baseline' : 'test',
            variant_key: skuVariant.variant_key,
            app_store_product_id: skuVariant.app_store_product_id,
            platform: skuVariant.platform,
            original_sku_data: {
              package_name: skuVariant.package_name,
              product_type: skuVariant.product_type,
              created_at: skuVariant.created_at
            }
          }
        })
        .select(`
          *,
          sku_variants (
            id,
            app_store_product_id,
            price_cents,
            quantity,
            currency,
            platform,
            name
          )
        `)
        .single();

      if (armError) {
        console.error('Experiment arm creation error:', armError);
        return NextResponse.json(
          { error: 'Failed to create experiment arm: ' + armError.message },
          { status: 400 }
        );
      }

      createdArms.push(experimentArm);
    }

    // Step 5: Return the complete experiment setup
    const fullExperiment = {
      ...experiment,
      virtualItem,
      arms: createdArms,
      game: {
        id: game.id,
        name: game.name,
        bundle_id: game.bundle_id,
        platform: game.platform
      },
      summary: {
        totalArms: createdArms.length,
        trafficAllocation: createdArms.map(arm => ({
          name: arm.name,
          weight: arm.traffic_weight,
          isControl: arm.is_control,
          price: `$${(arm.metadata.priceInDollars).toFixed(2)}`
        })),
        priceRange: {
          min: Math.min(...createdSkuVariants.map(v => v.price_cents)) / 100,
          max: Math.max(...createdSkuVariants.map(v => v.price_cents)) / 100
        },
        skuVariantsUsed: createdSkuVariants.map(v => ({
          id: v.id,
          name: v.name,
          app_store_product_id: v.app_store_product_id,
          price: `$${(v.price_cents / 100).toFixed(2)}`,
          platform: v.platform,
          isControl: v.isControl
        }))
      }
    };

    console.log(`Sample experiment created successfully for ${game.name}:`, {
      experimentId: experiment.id,
      experimentName: experiment.name,
      virtualItemId: virtualItem.id,
      virtualItemName: virtualItem.name,
      armsCount: createdArms.length,
      priceRange: `$${(Math.min(...createdSkuVariants.map(v => v.price_cents)) / 100).toFixed(2)} - $${(Math.max(...createdSkuVariants.map(v => v.price_cents)) / 100).toFixed(2)}`
    });

    return NextResponse.json({
      success: true,
      message: `Experiment created successfully for ${game.name}`,
      experiment: fullExperiment,
      realDataUsed: {
        game: game.name,
        virtualItem: virtualItem.name,
        existingSkuVariants: createdSkuVariants.length,
        platforms: [...new Set(createdSkuVariants.map(v => v.platform))]
      },
      nextSteps: [
        `Experiment "${experiment.name}" is now running with equal traffic allocation (${(100/createdArms.length).toFixed(1)}% each)`,
        'SDK can request variants via /api/sdk/get-item-variant with gameId, virtualItemName, and platform',
        'Bandit algorithm will optimize traffic based on conversion performance',
        'Use /api/experiments/{id}/update-traffic to manually trigger traffic weight updates',
        'View results at /api/experiments/{id}/results'
      ]
    });

  } catch (error) {
    console.error('Sample experiment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}