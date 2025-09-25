# Real Data Experiment Example

This example shows how to create and use experiments with your actual Clash Royale game data.

## Your Actual Data Being Used

**Game**: Clash Royale (ID: `2a193504-52ed-4412-bec1-ad1d9af88f79`)
- Bundle ID: `com.example.clash`
- Platform: `both` (iOS and Android)
- Status: `active`

**Virtual Item**: test product (ID: `28adf946-6ec5-4830-8b17-34b0b9f1f032`)
- Type: `consumable`
- Subtype: `currency`
- Category: `test`
- Description: `testing`

**Existing SKU Variants** (4 variants, all Android platform):
1. **test_product1** (`test_product`) - $1.00 - Control
2. **testProduct3** (`test_product_3`) - $2.00 
3. **test_product_4** (`test_product_4`) - $4.00
4. **test_product_5** (`test_product_5`) - $5.00

## Step 1: Create Experiment with Real Data

```bash
curl -X POST http://localhost:3000/api/experiments/create-sample \
  -H "Content-Type: application/json" \
  -d '{"gameId": "clash-royale"}'
```

**What gets created:**
- Experiment name: "test product Price Optimization"
- 4 experiment arms (25% traffic each):
  - `test_product1 - $1.00` (Control)
  - `testProduct3 - $2.00`
  - `test_product_4 - $4.00`
  - `test_product_5 - $5.00`

**Sample Response:**
```json
{
  "success": true,
  "message": "Experiment created successfully for clash royale",
  "experiment": {
    "name": "test product Price Optimization",
    "description": "Testing different price points for test product (testing) to maximize conversion rate",
    "status": "running",
    "game": {
      "name": "clash royale",
      "bundle_id": "com.example.clash"
    }
  },
  "realDataUsed": {
    "game": "clash royale",
    "virtualItem": "test product",
    "existingSkuVariants": 4,
    "platforms": ["android"]
  },
  "nextSteps": [
    "Experiment \"test product Price Optimization\" is now running with equal traffic allocation (25.0% each)",
    "SDK can request variants via /api/sdk/get-item-variant with gameId, virtualItemName, and platform",
    "Bandit algorithm will optimize traffic based on conversion performance"
  ]
}
```

## Step 2: SDK Integration

### Get Variant for Android Game
```javascript
const response = await fetch('/api/sdk/get-item-variant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: '2a193504-52ed-4412-bec1-ad1d9af88f79', // or 'clash-royale'
    virtualItemName: 'test product',
    userId: 'player123',
    platform: 'android'
  })
});

const result = await response.json();
```

**Sample Response** (Thompson Sampling might select the $2.00 variant):
```json
{
  "virtualItemId": "28adf946-6ec5-4830-8b17-34b0b9f1f032",
  "experimentId": "experiment-uuid",
  "experimentName": "test product Price Optimization", 
  "experimentArmId": "arm-uuid",
  "experimentArmName": "testProduct3 - $2.00",
  "variant": {
    "skuVariantId": "801d037b-1dc1-4460-9077-7f72ad67abb2",
    "productId": "test_product_3",
    "price": {
      "cents": 200,
      "dollars": 2.00,
      "currency": "USD",
      "formatted": "$2.00"
    },
    "quantity": 1,
    "platform": "android",
    "productType": "consumable"
  },
  "platformSpecific": {
    "productId": "test_product_3",
    "billingLibraryVersion": "8.0.0",
    "acknowledgmentRequired": true,
    "prorationMode": 1
  },
  "isExperiment": true,
  "isControl": false,
  "trafficWeight": 25.0
}
```

## Step 3: Display in Game

```javascript
// Use the returned data to display in your Clash Royale store
const { variant } = result;

displayStoreItem({
  title: `${variant.quantity} Test Currency`,
  price: variant.price.formatted, // "$2.00"
  productId: variant.productId,   // "test_product_3"
  platform: 'android'
});

// Track the view
await fetch('/api/sdk/log-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: '2a193504-52ed-4412-bec1-ad1d9af88f79',
    userId: 'player123',
    eventType: 'store_view',
    virtualItemId: result.virtualItemId,
    skuVariantId: result.variant.skuVariantId,
    experimentId: result.experimentId,
    experimentArmId: result.experimentArmId,
    properties: {
      platform: 'android',
      price_shown: result.variant.price.formatted
    }
  })
});
```

## Step 4: Track Purchase

```javascript
// After successful purchase through your colleague's system
await fetch('/api/sdk/log-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: '2a193504-52ed-4412-bec1-ad1d9af88f79',
    userId: 'player123',
    eventType: 'purchase_complete',
    virtualItemId: result.virtualItemId,
    skuVariantId: result.variant.skuVariantId,
    experimentId: result.experimentId,
    experimentArmId: result.experimentArmId,
    properties: {
      transactionId: 'google_play_transaction_id',
      priceCents: 200,
      currency: 'USD',
      quantity: 1,
      platform: 'android'
    }
  })
});
```

## Expected Optimization Behavior

**Day 1**: Equal traffic (25% each)
- `test_product1` ($1.00): 25% traffic - Low revenue, potentially high conversion
- `testProduct3` ($2.00): 25% traffic - Medium price point
- `test_product_4` ($4.00): 25% traffic - Higher price, potentially lower conversion  
- `test_product_5` ($5.00): 25% traffic - Highest price, likely lowest conversion

**After collecting data** (e.g., Day 3):
If $2.00 variant shows best conversion rate:
- `test_product1` ($1.00): 15% traffic
- `testProduct3` ($2.00): 50% traffic ⭐ (best performer gets more)
- `test_product_4` ($4.00): 20% traffic
- `test_product_5` ($5.00): 15% traffic

## Monitor Progress

```bash
# Check current experiment status
curl "http://localhost:3000/api/experiments/{experiment-id}/update-traffic"

# View detailed results
curl "http://localhost:3000/api/experiments/{experiment-id}/results?timeframe=7d"

# Trigger manual traffic update
curl -X POST "http://localhost:3000/api/experiments/{experiment-id}/update-traffic"
```

The system uses your actual Clash Royale game data and existing SKU variants, so this experiment would work with your real game infrastructure and existing product IDs in Google Play Console.