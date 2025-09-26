# Nandi SDK Data Flow & A/B Testing Implementation

## Overview

This document explains how the Nandi SDK administers data for pricing and SKU variants to enable A/B testing in mobile apps. The system uses bandit algorithms to automatically optimize in-game store prices and quantities without manual intervention.

## Database Structure

The system uses these key tables:

- **games**: Game configuration and metadata 
- **virtual_items**: Game items to be tested (coins, power-ups, etc.)
- **sku_variants**: Different price/quantity combinations for each virtual item
- **experiments**: A/B test configurations
- **experiment_arms**: Different variants within an experiment (each linked to a SKU variant)
- **assignments**: Tracks which users are assigned to which experiment arm
- **events**: Analytics events (views, purchases, etc.)
- **players**: Player identification and metadata
- **purchases**: Purchase records with verification status
- **sessions**: User session tracking
- **store_credentials**: Apple/Google API credentials for automatic product creation

## SDK Data Flow for A/B Testing

### 1. Item Variant Retrieval (`/api/sdk/get-item-variant`)

**What the SDK calls:**
```typescript
POST /api/sdk/get-item-variant
{
  "gameId": "uuid",
  "virtualItemId": "uuid", // or virtualItemName
  "userId": "external_user_id", 
  "platform": "ios|android|both",
  "apiKey": "your_api_key"
}
```

**What the backend returns:**
```typescript
{
  "virtualItemId": "uuid",
  "experimentId": "uuid", // null if no active experiment
  "experimentArmId": "uuid", // null if control/no experiment
  "variant": {
    "skuVariantId": "uuid",
    "productId": "com.yourgame.coins_v2_99c_100q", // App Store product ID
    "price": {
      "cents": 99,
      "dollars": 0.99,
      "currency": "USD",
      "formatted": "$0.99"
    },
    "quantity": 100,
    "platform": "ios",
    "productType": "consumable"
  },
  "platformSpecific": {
    "productIdentifier": "com.yourgame.coins_v2_99c_100q",
    "storeKitVersion": "2.0",
    "familyShareable": false
  },
  "isExperiment": true,
  "isControl": false,
  "instructions": {
    "displayInstructions": [
      "Display '100' units for '$0.99'",
      "Use iOS Product Identifier: 'com.yourgame.coins_v2_99c_100q' for StoreKit"
    ],
    "platformInstructions": [
      "Use StoreKit 2 for purchase flow",
      "Product ID format follows reverse domain naming"
    ],
    "trackingInstructions": [
      "Log store_view event when item is displayed",
      "Include experiment_id and experiment_arm_id in all events"
    ]
  }
}
```

**Backend Logic:**
1. Resolves `virtualItemName` to `virtualItemId` if needed
2. Checks for running experiments on this virtual item  
3. If experiment exists: Uses bandit algorithm (Thompson Sampling) to select optimal variant
4. If no experiment: Returns default/control SKU variant
5. Creates platform-specific response with proper App Store/Play Store product IDs
6. Records assignment in `assignments` table

### 2. Event Logging (`/api/sdk/log-event`)

**What the SDK calls:**
```typescript
POST /api/sdk/log-event
{
  "gameId": "uuid",
  "userId": "external_user_id",
  "eventType": "store_view|item_view|purchase_complete|purchase_fail",
  "virtualItemId": "uuid",
  "skuVariantId": "uuid", 
  "experimentId": "uuid",
  "experimentArmId": "uuid",
  "properties": {
    "platform": "ios",
    "transactionId": "1000000123456", // for purchases
    "priceCents": 99,
    "currency": "USD",
    "quantity": 100,
    "sdk_version": "1.0.0",
    "game_version": "2.1.3"
  }
}
```

**Valid Event Types:**
- `store_view`: User views the store
- `item_view`: User views specific item
- `item_click`: User taps on item
- `purchase_start`: Purchase initiated
- `purchase_complete`: Purchase verified
- `purchase_fail`: Purchase failed
- `experiment_view`: Experiment variant shown

**Backend Logic:**
1. Creates/finds player record using `external_player_id`
2. Logs event in `events` table with experiment context
3. For purchase events: Creates preliminary `purchases` record (pending verification)
4. Returns success confirmation with `eventId`

**Batch Event Logging:**
```typescript
PUT /api/sdk/log-event
{
  "gameId": "uuid",
  "events": [
    { /* event 1 */ },
    { /* event 2 */ }
    // Max 100 events per batch
  ]
}
```

### 3. SKU Variant Management (`/api/games/[id]/sku-variants/create`)

**For creating A/B test variants:**
```typescript
POST /api/games/{gameId}/sku-variants/create
{
  "virtual_item_id": "uuid",
  "price_variants": [
    {"price_cents": 99, "quantity": 100},
    {"price_cents": 199, "quantity": 250}, 
    {"price_cents": 299, "quantity": 400}
  ],
  "product_type": "consumable"
}
```

**Backend automatically:**
1. Generates unique App Store product IDs: `com.yourgame.coins_v1_99c_100q`
2. Creates products in Apple App Store Connect via API
3. Stores SKU variants in database
4. Returns created variants with Apple-assigned IDs

## Mobile App Integration Pattern

### 1. Startup/Store View
```typescript
// SDK call when user opens store
const variant = await NandiSDK.getItemVariant('coins_pack');

// Display the variant
displayItem({
  quantity: variant.variant.quantity,
  price: variant.variant.price.formatted,
  productId: variant.platformSpecific.productIdentifier
});

// Log the store view
await NandiSDK.logEvent('store_view', {
  virtualItemId: variant.virtualItemId,
  experimentId: variant.experimentId,
  experimentArmId: variant.experimentArmId
});
```

### 2. Purchase Flow
```typescript
// When user taps purchase
await NandiSDK.logEvent('purchase_start', {
  virtualItemId: variant.virtualItemId,
  experimentId: variant.experimentId,
  experimentArmId: variant.experimentArmId,
  skuVariantId: variant.variant.skuVariantId
});

// Use platform billing (iOS example)
const transaction = await StoreKit.purchase(variant.platformSpecific.productIdentifier);

if (transaction.success) {
  // Log completion
  await NandiSDK.logEvent('purchase_complete', {
    virtualItemId: variant.virtualItemId,
    experimentId: variant.experimentId,
    experimentArmId: variant.experimentArmId,
    skuVariantId: variant.variant.skuVariantId,
    transactionId: transaction.id,
    priceCents: variant.variant.price.cents,
    currency: variant.variant.price.currency,
    quantity: variant.variant.quantity
  });
} else {
  // Log failure
  await NandiSDK.logEvent('purchase_fail', {
    virtualItemId: variant.virtualItemId,
    experimentId: variant.experimentId,
    experimentArmId: variant.experimentArmId,
    skuVariantId: variant.variant.skuVariantId,
    error: transaction.error
  });
}
```

## Critical Endpoints & Data Exchange

### Primary SDK Endpoints

1. **GET/POST `/api/sdk/get-item-variant`** - Core variant selection
   - **Input**: `gameId`, `virtualItemId/Name`, `userId`, `platform` 
   - **Output**: SKU variant with pricing, experiment context, platform-specific data
   - **Used**: Every time store item is displayed

2. **POST `/api/sdk/log-event`** - Analytics tracking  
   - **Input**: Event type, user, item, experiment context, platform data
   - **Output**: Event confirmation with `eventId`
   - **Used**: Store views, purchases, clicks, failures

3. **PUT `/api/sdk/log-event`** - Batch analytics tracking
   - **Input**: Array of events (max 100)
   - **Output**: Batch processing results
   - **Used**: Offline event queue processing

### Experiment Management

4. **GET `/api/experiments`** - List experiments for game
   - Query params: `gameId`
   - Returns: All experiments with arms and performance data

5. **POST `/api/experiments`** - Create new A/B test
   - Creates experiment with multiple arms
   - Links to SKU variants for testing

6. **POST `/api/experiments/[id]/select-variant`** - Manual variant selection
   - For testing specific variants
   - Bypasses bandit algorithm

7. **GET `/api/experiments/[id]/results`** - Performance metrics
   - Conversion rates, revenue, statistical significance

### SKU Management 

8. **GET `/api/games/[id]/sku-variants`** - List all variants for game/item
   - Query params: `virtual_item_id`, `platform`
   - Returns: Grouped by virtual item

9. **POST `/api/games/[id]/sku-variants/create`** - Auto-create variants + Apple products
   - Creates products in App Store Connect
   - Stores variants in database

10. **DELETE `/api/games/[id]/sku-variants`** - Archive variants
    - Marks as archived (doesn't delete from Apple)

### Bandit Algorithm

11. **POST `/api/bandit/update-all`** - Update traffic weights based on performance
    - Runs Thompson Sampling algorithm
    - Updates experiment arm weights

12. **GET `/api/bandit/update-all`** - View current algorithm status
    - Shows running experiments and their performance

## Bandit Algorithm & Traffic Allocation

The system uses **Thompson Sampling** to automatically optimize traffic allocation:

### Algorithm Flow:
1. **Performance Tracking**: Events are aggregated into conversion metrics
2. **Bayesian Updates**: Algorithm updates beliefs about each variant's performance  
3. **Traffic Allocation**: More traffic goes to promising variants
4. **Automatic Stopping**: Experiments stop when statistical significance is reached

### Key Features:
- **Exploration vs Exploitation**: Balances trying new variants vs using proven winners
- **Real-time Adaptation**: Updates happen continuously as new data arrives
- **Multi-armed Bandit**: Handles multiple variants simultaneously
- **Statistical Rigor**: Considers confidence intervals and significance

## Data Requirements for Mobile Integration

### The mobile app needs to send:
- **User identification**: External user ID (your game's user system)  
- **Platform info**: iOS/Android, app version, SDK version
- **Purchase data**: Transaction IDs, receipt data for verification
- **Session tracking**: Device ID, session tokens
- **Event context**: Always include experiment IDs when available

### The backend provides:
- **Optimized pricing**: Based on real-time bandit algorithm decisions
- **Platform-specific product IDs**: Ready for StoreKit/Play Billing
- **Experiment context**: For proper analytics attribution  
- **Detailed instructions**: How to display and purchase each variant
- **Performance insights**: Real-time experiment results

## Platform-Specific Considerations

### iOS (StoreKit)
- Product IDs follow reverse domain format: `com.yourgame.item_v1_99c_100q`
- Uses StoreKit 2 for modern purchase flow
- Supports family sharing configuration
- Requires App Store Connect API credentials

### Android (Play Billing)  
- Product IDs are lowercase with underscores: `coins_pack_v1_99c_100q`
- Uses Google Play Billing Library
- Requires service account JSON credentials
- Supports proration for subscriptions

## Security & Authentication

- API keys authenticate SDK requests
- Store credentials are encrypted in database
- Purchase verification happens server-side
- Row Level Security (RLS) enabled on all tables
- Rate limiting on all endpoints

## Complete Automated Loop

The system creates a fully automated optimization cycle:

1. **Developer Setup**: Define virtual items once with price tolerance ranges
2. **Automatic Variant Creation**: Nandi generates SKU variants and creates App Store/Play Store products
3. **Intelligent Selection**: SDK uses bandit algorithms to show optimal pricing in real-time  
4. **Analytics Tracking**: All user interactions are logged with experiment context
5. **Continuous Optimization**: Algorithm automatically adjusts traffic to winning variants
6. **Performance Monitoring**: Real-time dashboards show experiment results

The mobile app only needs to make two main SDK calls:
1. **Get the current best variant** for each item
2. **Log user events** (views, purchases, failures)

Everything else is handled automatically by the Nandi backend system.