# Nandi Store API Reference

## Overview
The Nandi Store API provides a unified interface for programmatically creating and managing in-app products across Google Play Store and App Store. It supports flexible store targeting, A/B testing, and automated product lifecycle management.

## Store Selection Options

### Basic Store Targets
```typescript
import { StoreTargets } from '@/lib/store-api';

// Create for Google Play only
targetStores: StoreTargets.GOOGLE_PLAY_ONLY

// Create for App Store only  
targetStores: StoreTargets.APP_STORE_ONLY

// Create for both stores
targetStores: StoreTargets.BOTH_STORES

// Alternative way to specify both
targetStores: StoreTargets.CROSS_PLATFORM
```

### Manual Store Selection
```typescript
// Using array syntax
targetStores: ['google_play']           // Google Play only
targetStores: ['app_store']             // App Store only
targetStores: ['google_play', 'app_store'] // Both stores
targetStores: ['both']                  // Both stores (shorthand)
```

## Product Creation Examples

### 1. Cross-Platform Gold Pack
```typescript
const result = await storeAPI.createProduct({
  product: ProductTemplates.goldPack(1000, 4.99),
  targetStores: StoreTargets.BOTH_STORES,
  publishImmediately: false,
});
```

### 2. Platform-Specific Products
```typescript
// Google Play exclusive (lower price point)
await storeAPI.createProduct({
  product: ProductTemplates.goldPack(500, 1.99),
  targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
});

// App Store exclusive (premium pricing)
await storeAPI.createProduct({
  product: ProductTemplates.goldPack(1000, 5.99),
  targetStores: StoreTargets.APP_STORE_ONLY,
});
```

### 3. Gradual Rollout Strategy
```typescript
// Step 1: Launch on Google Play first
const initialProduct = await storeAPI.createProduct({
  product: ProductTemplates.starterBundle(9.99),
  targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
});

// Step 2: Expand to App Store after validation
await storeAPI.updateProduct({
  productId: initialProduct.data.id,
  updates: { description: "Now available on iOS!" },
  targetStores: StoreTargets.APP_STORE_ONLY,
});
```

## A/B Testing

### Price Testing Across Platforms
```typescript
// Different pricing strategies per platform
const googlePlayTest = ABTestHelpers.createPriceTest(
  'Android Pricing',
  productId,
  [0.8, 1.0, 1.2] // More aggressive pricing
);

const appStoreTest = ABTestHelpers.createPriceTest(
  'iOS Pricing',
  productId,
  [0.9, 1.0, 1.1] // Conservative pricing
);
```

### Bundle Composition Testing
```typescript
const bundleTest = ABTestHelpers.createBundleTest(
  'Bundle Optimization',
  productId,
  [
    [{ itemType: 'gold', quantity: 1000 }],                    // Gold-only
    [{ itemType: 'gold', quantity: 800 }, { itemType: 'gems', quantity: 100 }], // Mixed
    [{ itemType: 'gold', quantity: 600 }, { itemType: 'powerup', quantity: 5 }] // Premium
  ]
);
```

## Product Templates

### Available Templates
```typescript
// Gold packs
ProductTemplates.goldPack(amount: number, price: number)

// Starter bundles  
ProductTemplates.starterBundle(price: number)

// Premium subscriptions
ProductTemplates.premiumSubscription(monthlyPrice: number)
```

### Custom Product Configuration
```typescript
const customProduct = {
  name: "Ultimate Power Pack",
  description: "Everything you need to dominate!",
  price: 19.99,
  currency: "USD",
  type: 'bundle',
  bundleItems: [
    { itemType: 'gold', quantity: 5000 },
    { itemType: 'gems', quantity: 500 },
    { itemType: 'powerup', quantity: 20 },
    { itemType: 'lives', quantity: 10 }
  ],
  isActive: true,
  tags: ['premium', 'power-user', 'best-value'],
  localizations: [
    {
      locale: 'en-US',
      name: 'Ultimate Power Pack',
      description: 'Everything you need to dominate!'
    },
    {
      locale: 'es-ES', 
      name: 'Pack de Poder Definitivo',
      description: '¡Todo lo que necesitas para dominar!'
    }
  ]
};
```

## Batch Operations

### Strategic Product Catalog
```typescript
const products = [
  // Entry-level Google Play products
  {
    product: ProductTemplates.goldPack(100, 0.99),
    targetStores: StoreTargets.GOOGLE_PLAY_ONLY,
  },
  
  // Premium App Store products
  {
    product: ProductTemplates.starterBundle(9.99),
    targetStores: StoreTargets.APP_STORE_ONLY,
  },
  
  // Cross-platform subscription
  {
    product: ProductTemplates.premiumSubscription(9.99),
    targetStores: StoreTargets.BOTH_STORES,
  }
];

const result = await storeAPI.batchCreateProducts(products);
```

## Platform-Specific Strategies

### Google Play Strategy
- **Pricing**: More aggressive, volume-focused
- **Products**: Smaller denominations, frequent purchases
- **A/B Testing**: Wider price ranges

```typescript
const googlePlayStrategy = [
  ProductTemplates.goldPack(100, 0.99),   // Micro-transaction
  ProductTemplates.goldPack(500, 2.99),   // Small pack
  ProductTemplates.goldPack(1000, 4.99),  // Medium pack
];
```

### App Store Strategy  
- **Pricing**: Premium positioning, value-focused
- **Products**: Higher value bundles, premium experiences
- **A/B Testing**: Conservative price variations

```typescript
const appStoreStrategy = [
  ProductTemplates.goldPack(1000, 4.99),    // Entry premium
  ProductTemplates.starterBundle(9.99),     // Premium bundle
  ProductTemplates.premiumSubscription(9.99), // Subscription
];
```

## Error Handling

### Store-Specific Errors
```typescript
const result = await storeAPI.createProduct({...});

if (!result.success) {
  result.errors?.forEach(error => {
    console.log(`${error.store}: ${error.message}`);
    
    if (error.store === 'google_play') {
      // Handle Google Play specific error
    } else if (error.store === 'app_store') {
      // Handle App Store specific error  
    }
  });
}
```

### Partial Success Handling
```typescript
// When creating for both stores, one might succeed and one might fail
if (result.success) {
  console.log('✅ All stores succeeded');
} else if (result.errors?.length === 1) {
  console.log('⚠️ Partial success - one store failed');
  // Product still created on successful store
} else {
  console.log('❌ Complete failure');
}
```

## Authentication Setup

### Google Play Credentials
```typescript
const googlePlayCredentials = {
  serviceAccountKey: JSON.stringify({
    // Download from Google Cloud Console
    type: "service_account",
    project_id: "your-project-id", 
    private_key: "-----BEGIN PRIVATE KEY-----\n...",
    client_email: "service-account@project.iam.gserviceaccount.com",
  }),
  packageName: "com.yourcompany.yourgame",
};
```

### App Store Credentials
```typescript
const appStoreCredentials = {
  keyId: "YOUR_KEY_ID",        // From App Store Connect
  issuerId: "YOUR_ISSUER_ID",  // From App Store Connect  
  privateKey: "-----BEGIN PRIVATE KEY-----\n...", // Your .p8 file content
  bundleId: "com.yourcompany.yourgame",
};
```

## Best Practices

### 1. Store Selection Strategy
- **Test on Google Play first**: Faster approval process
- **Premium pricing on App Store**: iOS users typically have higher LTV
- **Cross-platform for subscriptions**: Maximize reach

### 2. A/B Testing Guidelines
- **Test one variable at a time**: Price OR description OR bundle content
- **Platform-specific tests**: Different strategies per store
- **Statistical significance**: Run tests long enough for reliable data

### 3. Product Lifecycle
- **Inactive by default**: Create products inactive, activate after review
- **Gradual rollout**: Start with one store, expand after validation  
- **Regular optimization**: Use A/B testing for continuous improvement

### 4. Error Recovery
- **Retry mechanisms**: Handle temporary API failures
- **Partial success**: Continue operation even if one store fails
- **Monitoring**: Track creation success rates per store

## API Endpoints Reference

### Products
- `POST /api/store/products` - Create product
- `GET /api/store/products` - List products
- `GET /api/store/products/{id}` - Get product
- `PATCH /api/store/products/{id}` - Update product
- `DELETE /api/store/products/{id}` - Delete product
- `POST /api/store/products/batch` - Batch create products

### A/B Testing
- `POST /api/store/ab-tests` - Create A/B test
- `GET /api/store/ab-tests` - List A/B tests
- `POST /api/store/ab-tests/{id}/start` - Start test
- `POST /api/store/ab-tests/{id}/stop` - Stop test
- `GET /api/store/ab-tests/{id}/results` - Get results

This API enables Nandi's AI to programmatically create, test, and optimize in-app products across both major mobile platforms with fine-grained control over store targeting and testing strategies.