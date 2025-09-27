import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAppleStoreJWT, fetchAppleAppId } from '@/lib/apple-store-helper';

// Apple App Store Connect API base URL
const APP_STORE_CONNECT_API_BASE = 'https://api.appstoreconnect.apple.com/v2';

interface CreateSKURequest {
  virtual_item_id: string;
  price_variants: {
    price_cents: number;
    quantity?: number;
  }[];
  product_type?: 'consumable' | 'non_consumable';
}

interface AppleStoreCredentials {
  app_name: string;
  bundle_id: string;
  p8_key_content: string;
  key_id: string;
  issuer_id: string;
}


// Create a single in-app purchase product in Apple's App Store Connect
async function createAppleInAppPurchase(
  credentials: AppleStoreCredentials,
  appId: string,
  productId: string,
  productName: string,
  productType: 'CONSUMABLE' | 'NON_CONSUMABLE' = 'CONSUMABLE'
): Promise<{ success: boolean; apple_product_id?: string; error?: string }> {
  console.log('[Apple SKU] Creating in-app purchase:', productId, productType);
  
  try {
    // Create JWT token for Apple API authentication
    const jwt = await createAppleStoreJWT(
      credentials.issuer_id,
      credentials.key_id,
      credentials.p8_key_content
    );

    // Create the in-app purchase via Apple's API
    const response = await fetch(`${APP_STORE_CONNECT_API_BASE}/inAppPurchases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: 'inAppPurchases',
          attributes: {
            name: productName,
            productId: productId,
            inAppPurchaseType: productType,
            state: 'READY_TO_SUBMIT',
            reviewNote: `Auto-generated SKU variant for A/B testing via Nandi`
          },
          relationships: {
            app: {
              data: {
                type: 'apps',
                id: appId
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Apple SKU] Create failed:', response.status, errorText.substring(0, 300));
      
      // Handle common Apple API errors
      if (response.status === 409) {
        return { success: false, error: `Product ID '${productId}' already exists in App Store Connect` };
      }
      
      return { 
        success: false, 
        error: `Apple API error (${response.status}): ${errorText.substring(0, 200)}` 
      };
    }

    const data = await response.json();
    console.log('[Apple SKU] Created successfully:', data.data?.id);
    
    return { 
      success: true, 
      apple_product_id: data.data?.id || productId 
    };
  } catch (error) {
    console.error('[Apple SKU] Creation failed:', error instanceof Error ? error.message : 'Unknown error');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Generate SKU variants for A/B testing
function generateSKUVariants(baseProductId: string, variants: { price_cents: number; quantity?: number }[]): Array<{
  app_store_product_id: string;
  price_cents: number;
  quantity: number;
  name: string;
}> {
  return variants.map((variant, index) => {
    const quantity = variant.quantity || 1;
    const variantSuffix = `_v${index + 1}_${variant.price_cents}c_${quantity}q`;
    
    return {
      app_store_product_id: `${baseProductId}${variantSuffix}`,
      price_cents: variant.price_cents,
      quantity: quantity,
      name: `Variant ${index + 1} ($${(variant.price_cents / 100).toFixed(2)}, ${quantity}x)`
    };
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const body: CreateSKURequest = await request.json();
    const { virtual_item_id, price_variants, product_type = 'consumable' } = body;

    console.log('[SKU Creation] Starting for game:', gameId, 'virtual item:', virtual_item_id);

    // Validate required fields
    if (!gameId || !virtual_item_id || !price_variants || price_variants.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: gameId, virtual_item_id, price_variants' },
        { status: 400 }
      );
    }

    // Validate price variants
    if (price_variants.some(v => !v.price_cents || v.price_cents <= 0)) {
      return NextResponse.json(
        { error: 'All price variants must have a positive price_cents value' },
        { status: 400 }
      );
    }

    // Get game and virtual item details
    const { data: gameData } = await supabaseAdmin
      .from('games')
      .select(`
        id, 
        developer_id, 
        name, 
        bundle_id,
        virtual_items!inner(
          id,
          name,
          type,
          min_price_cents,
          max_price_cents
        )
      `)
      .eq('id', gameId)
      .eq('virtual_items.id', virtual_item_id)
      .single();

    if (!gameData) {
      return NextResponse.json(
        { error: 'Game or virtual item not found' },
        { status: 404 }
      );
    }

    const virtualItem = gameData.virtual_items[0];
    if (!virtualItem) {
      return NextResponse.json(
        { error: 'Virtual item not found in this game' },
        { status: 404 }
      );
    }

    // Validate price ranges if set
    if (virtualItem.min_price_cents || virtualItem.max_price_cents) {
      const invalidVariants = price_variants.filter(v => {
        if (virtualItem.min_price_cents && v.price_cents < virtualItem.min_price_cents) return true;
        if (virtualItem.max_price_cents && v.price_cents > virtualItem.max_price_cents) return true;
        return false;
      });

      if (invalidVariants.length > 0) {
        return NextResponse.json(
          { 
            error: `Price variants must be within range $${(virtualItem.min_price_cents || 0) / 100}-$${(virtualItem.max_price_cents || 999999) / 100}`,
            invalid_variants: invalidVariants
          },
          { status: 400 }
        );
      }
    }

    // Get Apple Store credentials
    const { data: credentials } = await supabaseAdmin
      .from('store_credentials')
      .select('credential_data, validation_status, apple_app_id')
      .eq('game_id', gameId)
      .eq('store_type', 'app_store')
      .eq('is_active', true)
      .single();

    if (!credentials || credentials.validation_status !== 'valid') {
      return NextResponse.json(
        { error: 'Valid Apple Store credentials are required. Please configure store credentials first.' },
        { status: 400 }
      );
    }

    const appleCredentials = credentials.credential_data as AppleStoreCredentials;

    // Generate SKU variants
    const baseProductId = `${gameData.bundle_id}.${virtualItem.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const skuVariants = generateSKUVariants(baseProductId, price_variants);

    console.log('[SKU Creation] Generated', skuVariants.length, 'variants');

    // Get or fetch Apple app ID (we need this for creating products)
    let appleAppId = credentials.apple_app_id;
    
    if (!appleAppId) {
      console.log('[SKU Creation] Apple App ID not stored, fetching from Apple API');
      const appIdResult = await fetchAppleAppId(appleCredentials);
      
      if (!appIdResult.success) {
        return NextResponse.json(
          { error: `Failed to fetch Apple App ID: ${appIdResult.error}` },
          { status: 400 }
        );
      }
      
      appleAppId = appIdResult.app_id!;
      
      // Store the Apple App ID for future use
      await supabaseAdmin
        .from('store_credentials')
        .update({ apple_app_id: appleAppId })
        .eq('game_id', gameId)
        .eq('store_type', 'app_store');
        
      console.log('[SKU Creation] Stored Apple App ID:', appleAppId);
    }

    const createdSKUs = [];
    const errors = [];

    // Create each SKU variant in Apple App Store Connect
    for (const variant of skuVariants) {
      const result = await createAppleInAppPurchase(
        appleCredentials,
        appleAppId,
        variant.app_store_product_id,
        `${virtualItem.name} - ${variant.name}`,
        product_type === 'consumable' ? 'CONSUMABLE' : 'NON_CONSUMABLE'
      );

      if (result.success) {
        // Save to database
        const { data: createdSKU, error: dbError } = await supabaseAdmin
          .from('sku_variants')
          .insert({
            virtual_item_id: virtual_item_id,
            app_store_product_id: variant.app_store_product_id,
            price_cents: variant.price_cents,
            quantity: variant.quantity,
            currency: 'USD',
            platform: 'ios',
            product_type: product_type === 'consumable' ? 'consumable' : 'non_consumable',
            name: variant.name,
            metadata: {
              apple_product_id: result.apple_product_id,
              created_via: 'nandi_api',
              variant_index: skuVariants.indexOf(variant)
            }
          })
          .select()
          .single();

        if (dbError) {
          console.error('[SKU Creation] DB save failed:', variant.app_store_product_id, dbError);
          errors.push({
            app_store_product_id: variant.app_store_product_id,
            error: `Database save failed: ${dbError.message}`
          });
        } else {
          createdSKUs.push(createdSKU);
          console.log('[SKU Creation] Saved to database:', variant.app_store_product_id);
        }
      } else {
        errors.push({
          app_store_product_id: variant.app_store_product_id,
          error: result.error
        });
      }
    }

    console.log('[SKU Creation] Completed:', createdSKUs.length, 'created,', errors.length, 'errors');

    return NextResponse.json({
      success: true,
      message: `Created ${createdSKUs.length} SKU variants`,
      created_skus: createdSKUs,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        virtual_item: virtualItem.name,
        variants_requested: skuVariants.length,
        variants_created: createdSKUs.length,
        variants_failed: errors.length
      }
    });
  } catch (error) {
    console.error('[SKU Creation] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}