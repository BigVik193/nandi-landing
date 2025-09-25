# Experiment Creation and SDK Integration Flow

This document demonstrates how to create experiments with hardcoded data and integrate with the SDK for dynamic pricing.

## Step 1: Create a Sample Experiment

```bash
# Create a sample experiment for a game
curl -X POST http://localhost:3000/api/experiments/create-sample \
  -H "Content-Type: application/json" \
  -d '{"gameId": "your-game-id-here"}'
```

This will create:
- A virtual item called "Gold Pack"
- 4 SKU variants with different price/quantity combinations:
  - Control: $4.99, 1000 gold
  - Variant A: $3.99, 1000 gold (lower price)
  - Variant B: $4.99, 1200 gold (more gold)
  - Variant C: $5.99, 1000 gold (premium price)
- An experiment with equal traffic allocation (25% each)
- Experiment arms linking each variant

## Step 2: SDK Integration - Get Item Variant

When your game needs to display a store item, call:

```javascript
// From your game client
const response = await fetch('/api/sdk/get-item-variant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: 'your-game-id',
    virtualItemName: 'Gold Pack',  // or use virtualItemId
    userId: 'player123',
    platform: 'ios'  // or 'android' or 'both'
  })
});

const result = await response.json();
```

The response will contain:
```json
{
  "virtualItemId": "uuid",
  "experimentId": "uuid", 
  "experimentArmId": "uuid",
  "variant": {
    "skuVariantId": "uuid",
    "appStoreProductId": "game.gold_pack_variant_a",
    "price": {
      "cents": 399,
      "dollars": 3.99,
      "currency": "USD",
      "formatted": "$3.99"
    },
    "quantity": 1000,
    "platform": "both"
  },
  "isExperiment": true,
  "isControl": false,
  "trafficWeight": 25.0
}
```

## Step 3: Display the Item in Your Game

```javascript
// Use the returned data to display in your store
const { variant, experimentId, experimentArmId } = result;

// Display in your store UI
displayStoreItem({
  title: `${variant.quantity} Gold Coins`,
  price: variant.price.formatted,
  productId: variant.appStoreProductId
});

// Track the view
await logStoreView({
  experimentId,
  experimentArmId,
  skuVariantId: variant.skuVariantId
});
```

## Step 4: Track Events

### Store View Event
```javascript
await fetch('/api/sdk/log-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: 'your-game-id',
    userId: 'player123',
    eventType: 'store_view',
    virtualItemId: result.virtualItemId,
    skuVariantId: result.variant.skuVariantId,
    experimentId: result.experimentId,
    experimentArmId: result.experimentArmId,
    properties: {
      platform: 'ios',
      game_version: '1.0.0',
      sdk_version: '1.0.0'
    }
  })
});
```

### Purchase Event
```javascript
// After successful purchase
await fetch('/api/sdk/log-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: 'your-game-id',
    userId: 'player123',
    eventType: 'purchase_complete',
    virtualItemId: result.virtualItemId,
    skuVariantId: result.variant.skuVariantId,
    experimentId: result.experimentId,
    experimentArmId: result.experimentArmId,
    properties: {
      transactionId: 'platform_transaction_id',
      priceCents: result.variant.price.cents,
      currency: result.variant.price.currency,
      quantity: result.variant.quantity,
      platform: 'ios'
    }
  })
});
```

## Step 5: Bandit Algorithm in Action

### Manual Traffic Update
```bash
# Manually trigger traffic weight update for a specific experiment
curl -X POST http://localhost:3000/api/experiments/{experiment-id}/update-traffic
```

### Check Current Status
```bash
# See current traffic allocation and performance
curl http://localhost:3000/api/experiments/{experiment-id}/update-traffic
```

### Bulk Update (Cron Job)
```bash
# Update all running experiments
curl -X POST http://localhost:3000/api/bandit/update-all
```

## Step 6: Monitor Results

View experiment results:
```bash
curl http://localhost:3000/api/experiments/{experiment-id}/results?timeframe=7d
```

This shows:
- Conversion rates per arm
- Traffic allocation changes over time  
- Statistical significance
- Revenue metrics

## How the Bandit Algorithm Optimizes

1. **Initial State**: All variants get 25% traffic each
2. **Data Collection**: Store views and purchases tracked per variant
3. **Performance Calculation**: Conversion rate = purchases / store_views
4. **Traffic Reallocation**: Thompson Sampling assigns more traffic to better performers
5. **Continuous Learning**: Process repeats every hour/day automatically

## Example Evolution

**Day 1**: Equal traffic (25% each)
- Control: 10% conversion
- Variant A: 15% conversion ⭐
- Variant B: 8% conversion  
- Variant C: 12% conversion

**Day 3**: Bandit adjusts traffic
- Control: 20% traffic
- Variant A: 45% traffic ⭐ (best performer gets more)
- Variant B: 15% traffic
- Variant C: 20% traffic

**Day 7**: Further optimization
- Control: 15% traffic (minimum maintained)
- Variant A: 60% traffic ⭐ (clear winner)
- Variant B: 10% traffic
- Variant C: 15% traffic

This maximizes revenue while maintaining statistical validity and exploration of all variants.