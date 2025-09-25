/**
 * Nandi Store API Usage Examples
 * Demonstrates how to use the unified store API for mobile game monetization
 * with flexible store targeting (Google Play, App Store, or both)
 */

import { NandiStoreAPI, ProductTemplates, StoreCredentials, StoreTargets } from '@/lib/store-api';
import { ABTestHelpers } from '@/lib/ab-testing/manager';

// Example credentials (replace with your actual credentials)
const credentials: StoreCredentials = {
  googlePlay: {
    serviceAccountKey: JSON.stringify({
      // Your Google Play service account JSON key
      type: "service_account",
      project_id: "your-project-id",
      private_key_id: "your-key-id",
      private_key: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      client_email: "your-service-account@your-project.iam.gserviceaccount.com",
      client_id: "your-client-id",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    }),
    packageName: "com.yourcompany.yourgame",
  },
  appStore: {
    keyId: "YOUR_KEY_ID",
    issuerId: "YOUR_ISSUER_ID", 
    privateKey: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    bundleId: "com.yourcompany.yourgame",
  },
};

// Initialize the API
const storeAPI = new NandiStoreAPI(credentials);

/**
 * Example 1: Create a simple gold pack for both stores
 */
export async function createGoldPack() {
  console.log('Creating 1000 Gold Pack for both stores...');
  
  const result = await storeAPI.createProduct({
    product: ProductTemplates.goldPack(1000, 4.99),
    targetStores: StoreTargets.BOTH_STORES, // Creates for both Google Play and App Store
    publishImmediately: false, // Keep inactive until ready
  });

  if (result.success) {
    console.log('✅ Gold pack created successfully:', result.data?.id);
    console.log('   Google Play SKU:', result.data?.googlePlaySku);
    console.log('   App Store Product ID:', result.data?.appStoreProductId);
    return result.data;
  } else {
    console.error('❌ Failed to create gold pack:', result.errors);
    return null;
  }
}

/**
 * Example 2: Create a starter bundle - Google Play only
 */
export async function createStarterBundle() {
  console.log('Creating Starter Bundle for Google Play only...');
  
  const result = await storeAPI.createProduct({
    product: ProductTemplates.starterBundle(9.99),
    targetStores: StoreTargets.GOOGLE_PLAY_ONLY, // Only create for Google Play
    publishImmediately: false,
  });

  if (result.success) {
    console.log('✅ Starter bundle created successfully:', result.data?.id);
    console.log('   Google Play SKU:', result.data?.googlePlaySku);
    console.log('   App Store Product ID:', result.data?.appStoreProductId || 'Not created');
    return result.data;
  } else {
    console.error('❌ Failed to create starter bundle:', result.errors);
    return null;
  }
}

/**
 * Example 3: Create a premium subscription - App Store only
 */
export async function createPremiumSubscription() {
  console.log('Creating Premium Subscription for App Store only...');
  
  const result = await storeAPI.createProduct({
    product: ProductTemplates.premiumSubscription(9.99),
    targetStores: StoreTargets.APP_STORE_ONLY, // Only create for App Store
    publishImmediately: false,
  });

  if (result.success) {
    console.log('✅ Premium subscription created successfully:', result.data?.id);
    console.log('   Google Play SKU:', result.data?.googlePlaySku || 'Not created');
    console.log('   App Store Product ID:', result.data?.appStoreProductId);
    return result.data;
  } else {
    console.error('❌ Failed to create premium subscription:', result.errors);
    return null;
  }
}

/**
 * Example 4: Create an A/B test for pricing
 */
export async function createPricingABTest(productId: string) {
  console.log('Creating pricing A/B test...');
  
  const abTestConfig = ABTestHelpers.createPriceTest(
    'Gold Pack Pricing Test',
    productId,
    [0.8, 1.0, 1.2, 1.5] // Test 20% off, original price, 20% markup, 50% markup
  );

  const result = await storeAPI.createABTest(abTestConfig);

  if (result.success) {
    console.log('✅ A/B test created successfully:', result.data?.name);
    return result.data;
  } else {
    console.error('❌ Failed to create A/B test:', result.errors);
    return null;
  }
}

/**
 * Example 5: Create a bundle composition A/B test
 */
export async function createBundleABTest(productId: string) {
  console.log('Creating bundle composition A/B test...');
  
  const bundleVariants = [
    // Variant 1: Gold-focused
    [
      { itemType: 'gold', quantity: 2000 },
      { itemType: 'gems', quantity: 50 },
    ],
    // Variant 2: Balanced
    [
      { itemType: 'gold', quantity: 1000 },
      { itemType: 'gems', quantity: 100 },
      { itemType: 'powerup', quantity: 5 },
    ],
    // Variant 3: Premium items
    [
      { itemType: 'gold', quantity: 800 },
      { itemType: 'gems', quantity: 150 },
      { itemType: 'powerup', quantity: 10 },
      { itemType: 'lives', quantity: 5 },
    ],
  ];

  const abTestConfig = ABTestHelpers.createBundleTest(
    'Starter Bundle Composition Test',
    productId,
    bundleVariants
  );

  const result = await storeAPI.createABTest(abTestConfig);

  if (result.success) {
    console.log('✅ Bundle A/B test created successfully:', result.data?.name);
    return result.data;
  } else {
    console.error('❌ Failed to create bundle A/B test:', result.errors);
    return null;
  }
}

/**
 * Example 6: Batch create multiple products with different store targets
 */
export async function createProductCatalog() {
  console.log('Creating complete product catalog with strategic store targeting...');
  
  const products = [
    {
      product: ProductTemplates.goldPack(500, 1.99),
      targetStores: StoreTargets.BOTH_STORES, // Cross-platform gold pack
    },
    {
      product: ProductTemplates.goldPack(1000, 3.99),
      targetStores: StoreTargets.BOTH_STORES, // Cross-platform gold pack
    },
    {
      product: ProductTemplates.goldPack(2500, 9.99),
      targetStores: StoreTargets.GOOGLE_PLAY_ONLY, // Google Play exclusive high-value pack
    },
    {
      product: ProductTemplates.starterBundle(4.99),
      targetStores: StoreTargets.APP_STORE_ONLY, // App Store exclusive bundle
    },
    {
      product: ProductTemplates.premiumSubscription(9.99),
      targetStores: StoreTargets.BOTH_STORES, // Cross-platform subscription
    },
  ];

  const result = await storeAPI.batchCreateProducts(products);

  if (result.success) {
    console.log('✅ Product catalog created successfully');
    console.log('Products created:', result.data?.map(p => ({ id: p.id, name: p.name })));
    return result.data;
  } else {
    console.error('❌ Failed to create product catalog:', result.errors);
    return null;
  }
}

/**
 * Example 7: Update product pricing with store selection
 */
export async function updateProductPricing(productId: string, newPrice: number, stores = StoreTargets.BOTH_STORES) {
  console.log(`Updating product ${productId} price to $${newPrice} on selected stores...`);
  
  const result = await storeAPI.updateProduct({
    productId,
    updates: { price: newPrice },
    targetStores: stores, // Flexible store targeting
  });

  if (result.success) {
    console.log('✅ Product pricing updated successfully');
    return result.data;
  } else {
    console.error('❌ Failed to update product pricing:', result.errors);
    return null;
  }
}

/**
 * Example 8: Get all products
 */
export async function listAllProducts() {
  console.log('Fetching all products...');
  
  const result = await storeAPI.listProducts();

  if (result.success) {
    console.log('✅ Products fetched successfully');
    console.log('Total products:', result.data?.length);
    result.data?.forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - ${product.type}`);
    });
    return result.data;
  } else {
    console.error('❌ Failed to fetch products:', result.errors);
    return null;
  }
}

/**
 * Example 9: Run a complete workflow
 */
export async function runCompleteWorkflow() {
  console.log('🚀 Starting complete Nandi Store API workflow...\n');

  // Step 1: Create initial products
  console.log('Step 1: Creating initial products');
  const goldPack = await createGoldPack();
  const starterBundle = await createStarterBundle();
  
  if (!goldPack || !starterBundle) {
    console.error('Failed to create initial products');
    return;
  }

  // Step 2: Create A/B tests
  console.log('\nStep 2: Creating A/B tests');
  await createPricingABTest(goldPack.id);
  await createBundleABTest(starterBundle.id);

  // Step 3: Create full catalog
  console.log('\nStep 3: Creating full product catalog');
  await createProductCatalog();

  // Step 4: List all products
  console.log('\nStep 4: Listing all products');
  await listAllProducts();

  console.log('\n✅ Complete workflow finished successfully!');
}

// Example usage in a Next.js API route or component
export async function handleStoreAPIDemo() {
  try {
    await runCompleteWorkflow();
  } catch (error) {
    console.error('Store API Demo failed:', error);
  }
}

/**
 * Example 10: Store-specific product strategies
 */
export async function createStoreSpecificProducts() {
  console.log('Creating store-specific product strategies...');

  // Google Play strategy: Higher volume, lower prices
  const googlePlayProducts = [
    {
      product: {
        ...ProductTemplates.goldPack(100, 0.99),
        name: "Quick Gold Boost",
        description: "Perfect for a quick boost in your adventure!",
      },
      targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
    },
    {
      product: {
        ...ProductTemplates.goldPack(300, 1.99),
        name: "Gold Starter Pack",
        description: "Get started with this affordable gold pack!",
      },
      targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
    },
  ];

  // App Store strategy: Premium pricing, higher value
  const appStoreProducts = [
    {
      product: {
        ...ProductTemplates.goldPack(1000, 4.99),
        name: "Premium Gold Collection",
        description: "Exclusive premium gold collection for serious players!",
      },
      targetStores: StoreTargets.APP_STORE_ONLY,
    },
    {
      product: {
        ...ProductTemplates.starterBundle(9.99),
        name: "Elite Starter Bundle",
        description: "Everything you need to dominate the game from day one!",
      },
      targetStores: StoreTargets.APP_STORE_ONLY,
    },
  ];

  // Cross-platform products
  const crossPlatformProducts = [
    {
      product: ProductTemplates.premiumSubscription(9.99),
      targetStores: StoreTargets.BOTH_STORES,
    },
  ];

  const allProducts = [...googlePlayProducts, ...appStoreProducts, ...crossPlatformProducts];
  const result = await storeAPI.batchCreateProducts(allProducts);

  if (result.success) {
    console.log('✅ Store-specific products created successfully');
    console.log(`Google Play products: ${googlePlayProducts.length}`);
    console.log(`App Store products: ${appStoreProducts.length}`);
    console.log(`Cross-platform products: ${crossPlatformProducts.length}`);
    return result.data;
  } else {
    console.error('❌ Failed to create store-specific products:', result.errors);
    return null;
  }
}

/**
 * Example 11: Gradual rollout - start with one store, expand later
 */
export async function createWithGradualRollout() {
  console.log('Creating product with gradual rollout strategy...');

  // Step 1: Launch on Google Play first (easier approval process)
  const initialResult = await storeAPI.createProduct({
    product: {
      ...ProductTemplates.goldPack(1500, 5.99),
      name: "Mega Gold Pack",
      description: "The ultimate gold collection for serious players!",
    },
    targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
    publishImmediately: false,
  });

  if (!initialResult.success) {
    console.error('❌ Failed to create initial product:', initialResult.errors);
    return null;
  }

  console.log('✅ Product created on Google Play:', initialResult.data?.id);

  // Step 2: Later, expand to App Store (simulated with timeout)
  console.log('⏳ Simulating success on Google Play...');
  
  // In real scenario, you'd check metrics and then expand
  setTimeout(async () => {
    console.log('📈 Google Play metrics look good, expanding to App Store...');
    
    const expandResult = await storeAPI.updateProduct({
      productId: initialResult.data!.id,
      updates: {
        // Could adjust for App Store audience
        description: "The ultimate gold collection - now available on iOS!",
      },
      targetStores: StoreTargets.APP_STORE_ONLY, // Add App Store
    });

    if (expandResult.success) {
      console.log('✅ Successfully expanded to App Store');
    } else {
      console.error('❌ Failed to expand to App Store:', expandResult.errors);
    }
  }, 2000);

  return initialResult.data;
}

/**
 * Example 12: Platform-specific A/B testing
 */
export async function createPlatformSpecificABTest() {
  console.log('Creating platform-specific A/B tests...');

  // Create base products for each platform
  const googlePlayProduct = await storeAPI.createProduct({
    product: ProductTemplates.goldPack(1000, 3.99),
    targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
  });

  const appStoreProduct = await storeAPI.createProduct({
    product: ProductTemplates.goldPack(1000, 4.99), // Higher base price for iOS
    targetStores: StoreTargets.APP_STORE_ONLY,
  });

  if (!googlePlayProduct.success || !appStoreProduct.success) {
    console.error('❌ Failed to create base products');
    return null;
  }

  // Create different A/B tests for each platform
  const googlePlayABTest = await storeAPI.createABTest(
    ABTestHelpers.createPriceTest(
      'Google Play Pricing Test',
      googlePlayProduct.data!.id,
      [0.8, 1.0, 1.2] // More aggressive pricing for Android
    )
  );

  const appStoreABTest = await storeAPI.createABTest(
    ABTestHelpers.createPriceTest(
      'App Store Pricing Test', 
      appStoreProduct.data!.id,
      [0.9, 1.0, 1.1] // More conservative pricing for iOS
    )
  );

  if (googlePlayABTest.success && appStoreABTest.success) {
    console.log('✅ Platform-specific A/B tests created successfully');
    return {
      googlePlay: googlePlayABTest.data,
      appStore: appStoreABTest.data,
    };
  } else {
    console.error('❌ Failed to create A/B tests');
    return null;
  }
}

// For testing individual functions
if (typeof window === 'undefined') {
  // Only run on server side
  console.log('Nandi Store API Examples loaded. Call functions as needed.');
  console.log('Available store targets:', StoreTargets);
}