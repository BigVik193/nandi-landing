import { NextRequest, NextResponse } from 'next/server';
import { ProductConfig, StoreApiResponse, resolveTargetStores } from '@/lib/store-api';
import { GooglePlayStoreAPI } from '@/lib/integrations/google-play';

interface ServiceAccountProductRequest {
  clientId: string;
  product: {
    name: string;
    description: string;
    price: number;
    currency: string;
    type: 'consumable' | 'non_consumable' | 'subscription' | 'bundle';
    isActive: boolean;
    bundleItems?: any[];
    tags?: string[];
  };
  targetStores: ('google_play' | 'app_store' | 'both')[];
  publishImmediately?: boolean;
  serviceAccountJson: string;
  packageName?: string;
  bundleId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceAccountProductRequest = await request.json();
    const { 
      clientId, 
      product, 
      targetStores, 
      publishImmediately = false, 
      serviceAccountJson,
      packageName,
      bundleId 
    } = body;

    // Resolve target stores
    const resolvedStores = resolveTargetStores(targetStores);

    const results: StoreApiResponse<ProductConfig> = {
      success: true,
      data: undefined,
      errors: [],
    };

    // Generate unique IDs for each store
    const productId = `nandi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const googlePlaySku = `${productId}_gp`;

    // Create the unified product config
    const productConfig: ProductConfig = {
      ...product,
      id: productId,
      googlePlaySku: resolvedStores.includes('google_play') ? googlePlaySku : undefined,
      appStoreProductId: resolvedStores.includes('app_store') ? `${productId}_as` : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`🎯 Creating product: ${product.name}`);
    console.log(`📦 Target stores: ${resolvedStores.join(', ')}`);

    // Create in Google Play Store
    if (resolvedStores.includes('google_play') && packageName) {
      try {
        console.log(`🤖 Creating in Google Play Store: ${packageName}`);
        
        const googlePlayAPI = new GooglePlayStoreAPI({
          serviceAccountKey: serviceAccountJson,
          packageName: packageName,
        });

        // Map product type to Google Play type
        const googlePlayType = product.type === 'subscription' ? 'subscription' : 'managed';
        
        const googleResult = await googlePlayAPI.createProduct({
          sku: googlePlaySku,
          packageName: packageName,
          productType: googlePlayType,
          defaultPrice: {
            priceMicros: Math.round(product.price * 1000000), // Convert to micros
            currency: product.currency,
          },
          listings: {
            'en-US': {
              title: product.name,
              description: product.description,
            },
          },
          status: publishImmediately ? 'active' : 'inactive',
        });

        if (googleResult.success) {
          console.log(`✅ Google Play product created: ${googlePlaySku}`);
        } else {
          console.log(`❌ Google Play creation failed: ${googleResult.error}`);
          results.errors?.push({
            store: 'google_play',
            code: 'CREATE_FAILED',
            message: 'Failed to create product in Google Play Store',
            details: googleResult.error,
          });
        }
      } catch (error) {
        console.log(`💥 Google Play API error:`, error);
        results.errors?.push({
          store: 'google_play',
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown Google Play API error',
        });
      }
    }

    // App Store creation would go here
    if (resolvedStores.includes('app_store') && bundleId) {
      results.errors?.push({
        store: 'app_store',
        code: 'NOT_IMPLEMENTED',
        message: 'App Store product creation not implemented yet',
      });
    }

    // Log summary
    console.log(`📊 Product creation summary:`);
    console.log(`   Product ID: ${productConfig.id}`);
    console.log(`   Google Play SKU: ${productConfig.googlePlaySku || 'Not created'}`);
    console.log(`   Errors: ${results.errors?.length || 0}`);

    // Determine overall success
    results.success = (results.errors?.length || 0) === 0;
    results.data = productConfig;

    return NextResponse.json(results, { 
      status: results.success ? 201 : 207 // 207 = Multi-Status for partial success
    });

  } catch (error) {
    console.error('Service account product creation error:', error);
    return NextResponse.json({
      success: false,
      errors: [{
        store: 'google_play',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal server error',
      }],
    }, { status: 500 });
  }
}