import { NextRequest, NextResponse } from 'next/server';
import { BanditService } from '@/lib/bandit/bandit-service';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getAuthInfo, createUnauthorizedResponse } from '@/lib/auth/api-key-utils';

export async function POST(request: NextRequest) {
  try {
    // Validate API key and get game ID
    const authInfo = await getAuthInfo(request);
    if (!authInfo.isValid) {
      return createUnauthorizedResponse(authInfo.error || 'Invalid API key');
    }

    const body = await request.json();
    const { 
      itemId, // Developer-friendly itemId
      userId,
      platform = 'both'
    } = body;

    const gameId = authInfo.gameId;

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId is required' },
        { status: 400 }
      );
    }

    // Resolve itemId to virtual item UUID using game_id + item_id
    const { data: virtualItem } = await supabaseAdmin
      .from('virtual_items')
      .select('id, name, item_id')
      .eq('game_id', gameId)
      .eq('item_id', itemId)
      .eq('status', 'active')
      .maybeSingle();

    if (!virtualItem) {
      return NextResponse.json(
        { error: `Virtual item with itemId '${itemId}' not found in game` },
        { status: 404 }
      );
    }

    const resolvedVirtualItemId = virtualItem.id;

    // Step 1: Check if there's a running experiment for this virtual item
    const { data: runningExperiments } = await supabaseAdmin
      .from('experiments')
      .select(`
        id,
        name,
        status,
        experiment_arms (
          id,
          name,
          traffic_weight,
          is_control,
          sku_variants (
            id,
            app_store_product_id,
            price_cents,
            quantity,
            currency,
            platform
          )
        )
      `)
      .eq('game_id', gameId)
      .eq('virtual_item_id', resolvedVirtualItemId)
      .eq('status', 'running')
      .order('created_at', { ascending: false })
      .limit(1);

    // If no running experiment, return default/control variant
    if (!runningExperiments || runningExperiments.length === 0) {
      const { data: defaultSkuVariant } = await supabaseAdmin
        .from('sku_variants')
        .select('*')
        .eq('virtual_item_id', resolvedVirtualItemId)
        .eq('status', 'active')
        .in('platform', [platform, 'both'])
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!defaultSkuVariant) {
        return NextResponse.json(
          { error: 'No SKU variants found for this item' },
          { status: 404 }
        );
      }

      // Build platform-specific data for default variant too
      const defaultPlatformData = {
        ios: {
          productIdentifier: defaultSkuVariant.app_store_product_id,
          storeKitVersion: '2.0',
          familyShareable: defaultSkuVariant.metadata?.ios_specific_settings?.family_shareable || false,
          contentVersion: defaultSkuVariant.metadata?.ios_specific_settings?.content_version || '1.0'
        },
        android: {
          productId: defaultSkuVariant.app_store_product_id,
          billingLibraryVersion: '8.0.0',
          acknowledgmentRequired: defaultSkuVariant.metadata?.android_specific_settings?.acknowledgment_required || true,
          prorationMode: defaultSkuVariant.metadata?.android_specific_settings?.proration_mode || 1
        }
      };

      const defaultCurrentPlatformData = platform === 'ios' ? defaultPlatformData.ios : 
                                         platform === 'android' ? defaultPlatformData.android : 
                                         null;

      return NextResponse.json({
        virtualItemId: resolvedVirtualItemId, // Internal UUID for backend use
        itemId: virtualItem.item_id, // Developer-friendly ID for SDK use
        experimentId: null,
        experimentArmId: null,
        variant: {
          skuVariantId: defaultSkuVariant.id,
          productId: defaultSkuVariant.app_store_product_id,
          price: {
            cents: defaultSkuVariant.price_cents,
            dollars: defaultSkuVariant.price_cents / 100,
            currency: defaultSkuVariant.currency,
            formatted: `$${(defaultSkuVariant.price_cents / 100).toFixed(2)}`
          },
          quantity: defaultSkuVariant.quantity,
          platform: defaultSkuVariant.platform,
          productType: defaultSkuVariant.product_type || 'consumable'
        },
        platformSpecific: defaultCurrentPlatformData,
        isExperiment: false,
        isControl: true,
        metadata: {
          selectionReason: 'no_running_experiment',
          userId,
          platform,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Step 2: Use bandit algorithm to select the best arm
    const experiment = runningExperiments[0];
    const banditService = new BanditService();
    
    const selectedArmId = await banditService.selectVariantForUser(
      experiment.id,
      userId
    );

    if (!selectedArmId) {
      return NextResponse.json(
        { error: 'Unable to select experiment variant' },
        { status: 500 }
      );
    }

    // Step 3: Get the selected arm and find the platform-specific SKU variant
    const selectedArm = experiment.experiment_arms?.find(arm => arm.id === selectedArmId);

    if (!selectedArm) {
      return NextResponse.json(
        { error: 'Selected experiment arm not found' },
        { status: 500 }
      );
    }

    // Find the correct platform variant for this arm
    let skuVariant = null;
    
    // Check if this arm has platform variants in metadata
    const armMetadata = selectedArm as any;
    if (armMetadata.metadata?.platform_variants && Array.isArray(armMetadata.metadata.platform_variants)) {
      // Find the variant for the requested platform
      const platformVariants = armMetadata.metadata.platform_variants;
      const platformVariant = platformVariants.find((v: any) => 
        v.platform === platform || 
        (platform !== 'ios' && platform !== 'android' && v.platform === 'both')
      );
      
      if (platformVariant) {
        // Fetch the full SKU variant details
        const { data: fullSkuVariant } = await supabaseAdmin
          .from('sku_variants')
          .select('*')
          .eq('id', platformVariant.sku_variant_id)
          .single();
        
        skuVariant = fullSkuVariant;
      }
    }
    
    // Fallback to the primary SKU variant if no platform-specific one found
    if (!skuVariant) {
      skuVariant = selectedArm.sku_variants as any;
      
      // If the primary variant doesn't match the platform, try to find a compatible one
      if (skuVariant && skuVariant.platform !== platform && platform !== 'both') {
        const { data: compatibleVariant } = await supabaseAdmin
          .from('sku_variants')
          .select('*')
          .eq('virtual_item_id', resolvedVirtualItemId)
          .eq('price_cents', skuVariant.price_cents)
          .eq('quantity', skuVariant.quantity)
          .in('platform', [platform, 'both'])
          .single();
        
        if (compatibleVariant) {
          skuVariant = compatibleVariant;
        }
      }
    }

    if (!skuVariant) {
      return NextResponse.json(
        { error: `No SKU variant found for platform ${platform}` },
        { status: 500 }
      );
    }

    // Step 4: Log the selection event for tracking
    // This would typically be done by the SDK after displaying the item
    // But we can prepare the event data here
    const eventData = {
      player_id: userId, // This would need to be resolved to actual player_id
      event_type: 'experiment_assignment',
      virtual_item_id: resolvedVirtualItemId,
      sku_variant_id: skuVariant.id,
      experiment_id: experiment.id,
      experiment_arm_id: selectedArmId,
      properties: {
        assignment_method: 'bandit_algorithm',
        traffic_weight: selectedArm.traffic_weight,
        is_control: selectedArm.is_control
      }
    };

    // Build platform-specific response
    const platformSpecificData = {
      ios: {
        productIdentifier: skuVariant.app_store_product_id,
        storeKitVersion: '2.0', // Assuming StoreKit 2
        familyShareable: skuVariant.metadata?.ios_specific_settings?.family_shareable || false,
        contentVersion: skuVariant.metadata?.ios_specific_settings?.content_version || '1.0'
      },
      android: {
        productId: skuVariant.app_store_product_id,
        billingLibraryVersion: '8.0.0', // Latest Google Play Billing Library
        acknowledgmentRequired: skuVariant.metadata?.android_specific_settings?.acknowledgment_required || true,
        prorationMode: skuVariant.metadata?.android_specific_settings?.proration_mode || 1
      }
    };

    const currentPlatformData = platform === 'ios' ? platformSpecificData.ios : 
                               platform === 'android' ? platformSpecificData.android : 
                               null;

    return NextResponse.json({
      virtualItemId: resolvedVirtualItemId, // Internal UUID for backend use
      itemId: virtualItem.item_id, // Developer-friendly ID for SDK use
      experimentId: experiment.id,
      experimentName: experiment.name,
      experimentArmId: selectedArmId,
      experimentArmName: selectedArm.name,
      variant: {
        skuVariantId: skuVariant.id,
        productId: skuVariant.app_store_product_id,
        price: {
          cents: skuVariant.price_cents,
          dollars: skuVariant.price_cents / 100,
          currency: skuVariant.currency,
          formatted: `$${(skuVariant.price_cents / 100).toFixed(2)}`
        },
        quantity: skuVariant.quantity,
        platform: skuVariant.platform,
        productType: skuVariant.product_type || 'consumable'
      },
      platformSpecific: currentPlatformData,
      isExperiment: true,
      isControl: selectedArm.is_control,
      trafficWeight: selectedArm.traffic_weight,
      eventToLog: eventData,
      metadata: {
        selectionReason: 'bandit_algorithm',
        algorithmUsed: 'thompson_sampling',
        userId,
        platform,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('SDK get item variant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET version for simpler integration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId'); // Now using itemId
    const userId = searchParams.get('userId');
    const platform = searchParams.get('platform') || 'both';

    return POST(new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({
        itemId, // Using itemId instead of virtualItemId/virtualItemName
        userId,
        platform
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      }
    }));

  } catch (error) {
    console.error('SDK get item variant GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}