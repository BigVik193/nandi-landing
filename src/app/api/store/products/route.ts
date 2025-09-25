import { NextRequest, NextResponse } from 'next/server';
import { ProductCreateRequest, ProductUpdateRequest, ProductConfig, StoreApiResponse, resolveTargetStores } from '@/lib/store-api';
import { GooglePlayStoreAPI } from '@/lib/integrations/google-play';
import { AppStoreAPI } from '@/lib/integrations/app-store';
import { getGooglePlayCredentials, getAppStoreCredentials, updateCredentialValidation } from '@/lib/store-credentials';

interface CreateRequestBody extends ProductCreateRequest {
  gameId: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRequestBody = await request.json();
    const { product, targetStores, publishImmediately = false, gameId } = body;

    // Get credentials from database
    const [googlePlayCreds, appStoreCreds] = await Promise.all([
      getGooglePlayCredentials(gameId),
      getAppStoreCredentials(gameId)
    ]);

    // Resolve target stores (handle 'both' option)
    const resolvedStores = resolveTargetStores(targetStores);

    const results: StoreApiResponse<ProductConfig> = {
      success: true,
      data: undefined,
      errors: [],
    };

    // Generate unique IDs for each store
    const productId = `nandi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const googlePlaySku = `${productId}_gp`;
    const appStoreProductId = `${productId}_as`;

    // Create the unified product config
    const productConfig: ProductConfig = {
      ...product,
      id: productId,
      googlePlaySku: resolvedStores.includes('google_play') ? googlePlaySku : undefined,
      appStoreProductId: resolvedStores.includes('app_store') ? appStoreProductId : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check for missing credentials
    if (resolvedStores.includes('google_play') && !googlePlayCreds) {
      results.errors?.push({
        store: 'google_play',
        code: 'MISSING_CREDENTIALS',
        message: 'No active Google Play credentials found for this game',
      });
    }

    if (resolvedStores.includes('app_store') && !appStoreCreds) {
      results.errors?.push({
        store: 'app_store',
        code: 'MISSING_CREDENTIALS',
        message: 'No active App Store credentials found for this game',
      });
    }

    // Create in Google Play Store
    if (resolvedStores.includes('google_play') && googlePlayCreds) {
      try {
        const googlePlayAPI = new GooglePlayStoreAPI({
          serviceAccountKey: googlePlayCreds.serviceAccountKey,
          packageName: googlePlayCreds.packageName
        });
        const googleResult = await googlePlayAPI.createProduct({
          sku: googlePlaySku,
          packageName: googlePlayCreds.packageName,
          productType: product.type === 'subscription' ? 'subscription' : 'managed',
          defaultPrice: {
            priceMicros: Math.round(product.price * 1000000), // Convert to micros
            currency: product.currency,
          },
          listings: {
            'en-US': {
              title: product.name,
              description: product.description,
            },
            ...(product.localizations?.reduce((acc, loc) => ({
              ...acc,
              [loc.locale]: {
                title: loc.name,
                description: loc.description,
              },
            }), {}) || {}),
          },
          status: publishImmediately ? 'active' : 'inactive',
        });

        if (!googleResult.success) {
          results.errors?.push({
            store: 'google_play',
            code: 'CREATE_FAILED',
            message: 'Failed to create product in Google Play Store',
            details: googleResult.error,
          });
          // Mark credentials as invalid if API call failed
          await updateCredentialValidation(googlePlayCreds.credentialId, 'invalid', googleResult.error);
        } else {
          // Mark credentials as valid if API call succeeded
          await updateCredentialValidation(googlePlayCreds.credentialId, 'valid');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown Google Play API error';
        results.errors?.push({
          store: 'google_play',
          code: 'API_ERROR',
          message: errorMessage,
        });
        // Mark credentials as invalid on API error
        await updateCredentialValidation(googlePlayCreds.credentialId, 'invalid', errorMessage);
      }
    }

    // Create in App Store
    if (resolvedStores.includes('app_store') && appStoreCreds) {
      try {
        const appStoreAPI = new AppStoreAPI({
          keyId: appStoreCreds.keyId,
          issuerId: appStoreCreds.issuerId,
          privateKey: appStoreCreds.privateKey,
          bundleId: appStoreCreds.bundleId
        });
        const appStoreResult = await appStoreAPI.createProduct({
          productId: appStoreProductId,
          bundleId: appStoreCreds.bundleId,
          name: product.name,
          inAppPurchaseType: product.type === 'subscription' ? 'AUTO_RENEWABLE_SUBSCRIPTION' : 
                              product.type === 'consumable' ? 'CONSUMABLE' : 'NON_CONSUMABLE',
          reviewNote: `Nandi AI generated product: ${product.description}`,
          familySharable: product.type !== 'consumable',
          availableInAllTerritories: true,
          localizations: product.localizations || [{
            locale: 'en-US',
            name: product.name,
            description: product.description,
          }],
        });

        if (!appStoreResult.success) {
          results.errors?.push({
            store: 'app_store',
            code: 'CREATE_FAILED',
            message: 'Failed to create product in App Store',
            details: appStoreResult.error,
          });
          // Mark credentials as invalid if API call failed
          await updateCredentialValidation(appStoreCreds.credentialId, 'invalid', appStoreResult.error);
        } else {
          // Mark credentials as valid if API call succeeded
          await updateCredentialValidation(appStoreCreds.credentialId, 'valid');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown App Store API error';
        results.errors?.push({
          store: 'app_store',
          code: 'API_ERROR',
          message: errorMessage,
        });
        // Mark credentials as invalid on API error
        await updateCredentialValidation(appStoreCreds.credentialId, 'invalid', errorMessage);
      }
    }

    // Save to our database (you'll implement this)
    // await saveProductToDatabase(productConfig);

    // Determine overall success
    results.success = (results.errors?.length || 0) === 0;
    results.data = productConfig;

    return NextResponse.json(results, { 
      status: results.success ? 201 : 207 // 207 = Multi-Status for partial success
    });

  } catch (error) {
    console.error('Store API Error:', error);
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

export async function GET(request: NextRequest) {
  try {
    // Get all products from database
    // const products = await getProductsFromDatabase();
    
    // For now, return empty array
    const response: StoreApiResponse<ProductConfig[]> = {
      success: true,
      data: [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Store API Error:', error);
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

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateRequestBody = await request.json();
    const { productId, updates, targetStores, credentials } = body;

    // Resolve target stores (handle 'both' option)
    const resolvedStores = resolveTargetStores(targetStores);

    const results: StoreApiResponse<ProductConfig> = {
      success: true,
      data: undefined,
      errors: [],
    };

    // Get existing product from database to get store-specific IDs
    // const existingProduct = await getProductFromDatabase(productId);
    // For now, we'll assume the product exists and has the necessary store IDs
    
    // Update in Google Play Store
    if (resolvedStores.includes('google_play') && credentials.googlePlay) {
      try {
        const googlePlayAPI = new GooglePlayStoreAPI(credentials.googlePlay);
        
        // Convert updates to Google Play format
        const googlePlayUpdates: any = {};
        
        if (updates.name || updates.description) {
          googlePlayUpdates.listings = {
            'en-US': {
              ...(updates.name && { title: updates.name }),
              ...(updates.description && { description: updates.description }),
            },
            ...(updates.localizations?.reduce((acc, loc) => ({
              ...acc,
              [loc.locale]: {
                title: loc.name,
                description: loc.description,
              },
            }), {}) || {}),
          };
        }

        if (updates.price) {
          googlePlayUpdates.defaultPrice = {
            priceMicros: Math.round(updates.price * 1000000),
            currency: updates.currency || 'USD',
          };
        }

        if (updates.isActive !== undefined) {
          googlePlayUpdates.status = updates.isActive ? 'active' : 'inactive';
        }

        // Use productId as SKU for now - in real implementation, you'd get this from database
        const googlePlaySku = `${productId}_gp`;
        const googleResult = await googlePlayAPI.updateProduct(googlePlaySku, googlePlayUpdates);

        if (!googleResult.success) {
          results.errors?.push({
            store: 'google_play',
            code: 'UPDATE_FAILED',
            message: 'Failed to update product in Google Play Store',
            details: googleResult.error,
          });
        }
      } catch (error) {
        results.errors?.push({
          store: 'google_play',
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown Google Play API error',
        });
      }
    }

    // Update in App Store
    if (resolvedStores.includes('app_store') && credentials.appStore) {
      try {
        const appStoreAPI = new AppStoreAPI(credentials.appStore);
        
        // Convert updates to App Store format
        const appStoreUpdates: any = {};
        
        if (updates.name) {
          appStoreUpdates.name = updates.name;
        }

        if (updates.description) {
          appStoreUpdates.reviewNote = `Updated: ${updates.description}`;
        }

        // Use productId as App Store product ID for now - in real implementation, you'd get this from database
        const appStoreProductId = `${productId}_as`;
        const appStoreResult = await appStoreAPI.updateProduct(appStoreProductId, appStoreUpdates);

        if (!appStoreResult.success) {
          results.errors?.push({
            store: 'app_store',
            code: 'UPDATE_FAILED',
            message: 'Failed to update product in App Store',
            details: appStoreResult.error,
          });
        }

        // Update localizations if provided
        if (updates.localizations) {
          for (const localization of updates.localizations) {
            await appStoreAPI.createLocalization(appStoreProductId, localization);
          }
        }
      } catch (error) {
        results.errors?.push({
          store: 'app_store',
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown App Store API error',
        });
      }
    }

    // Update in our database
    // const updatedProduct = await updateProductInDatabase(productId, updates);
    
    // For now, create a mock updated product
    const updatedProduct: ProductConfig = {
      id: productId,
      name: updates.name || 'Updated Product',
      description: updates.description || 'Updated description',
      price: updates.price || 0,
      currency: updates.currency || 'USD',
      type: updates.type || 'consumable',
      isActive: updates.isActive !== undefined ? updates.isActive : true,
      updatedAt: new Date(),
      ...(updates.localizations && { localizations: updates.localizations }),
      ...(updates.tags && { tags: updates.tags }),
      ...(updates.bundleItems && { bundleItems: updates.bundleItems }),
      ...(updates.abTestVariant && { abTestVariant: updates.abTestVariant }),
      ...(updates.abTestGroup && { abTestGroup: updates.abTestGroup }),
    };

    // Determine overall success
    results.success = (results.errors?.length || 0) === 0;
    results.data = updatedProduct;

    return NextResponse.json(results, { 
      status: results.success ? 200 : 207 // 207 = Multi-Status for partial success
    });

  } catch (error) {
    console.error('Store API Update Error:', error);
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