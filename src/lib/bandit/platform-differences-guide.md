# Platform-Specific Implementation Guide

This guide explains how the Nandi system handles differences between iOS App Store and Google Play Store for experiments and SKU variants.

## Key Platform Differences Handled

### 1. Product ID Format Differences

**iOS (App Store)**:
- Format: Alphanumeric characters (A-Z, a-z, 0-9), underscores (_), and periods (.)
- Case: Mixed case allowed
- Recommended: Reverse domain name style (e.g., `com.nandi.gameid.goldpack_control`)
- Example: `com.nandi.12345678.goldpack_control`

**Android (Google Play)**:
- Format: Lowercase letters (a-z), numbers (0-9), underscores (_), and periods (.)
- Case: Only lowercase allowed
- Must start: With lowercase letter or number
- Reserved: `android.test` and variations
- Example: `com.nandi.12345678.goldpack_control`

### 2. Platform-Specific SKU Generation

When creating experiments, the system automatically generates platform-specific SKU variants:

```javascript
// For each variant (control, lowerprice, moregold, premium):
// iOS variant
{
  app_store_product_id: "com.nandi.gameid.goldpack_control",
  platform: "ios",
  metadata: {
    ios_specific_settings: {
      family_shareable: false,
      content_version: "1.0"
    }
  }
}

// Android variant  
{
  app_store_product_id: "com.nandi.gameid.goldpack_control",
  platform: "android", 
  metadata: {
    android_specific_settings: {
      acknowledgment_required: true,
      proration_mode: 1
    }
  }
}
```

## SDK Integration Examples

### iOS Game Request

```javascript
const response = await fetch('/api/sdk/get-item-variant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: 'your-game-id',
    virtualItemName: 'Gold Pack',
    userId: 'player123',
    platform: 'ios'
  })
});

const result = await response.json();
```

**iOS Response**:
```json
{
  "variant": {
    "productId": "com.nandi.12345678.goldpack_lowerprice",
    "price": {
      "cents": 399,
      "dollars": 3.99,
      "currency": "USD",
      "formatted": "$3.99"
    },
    "quantity": 1000,
    "platform": "ios",
    "productType": "consumable"
  },
  "platformSpecific": {
    "productIdentifier": "com.nandi.12345678.goldpack_lowerprice",
    "storeKitVersion": "2.0",
    "familyShareable": false,
    "contentVersion": "1.0"
  },
  "instructions": {
    "displayInstructions": [
      "Display \"1000\" units for \"$3.99\"",
      "Use iOS Product Identifier: \"com.nandi.12345678.goldpack_lowerprice\" for StoreKit"
    ],
    "platformInstructions": [
      "Use StoreKit 2 for purchase flow",
      "Product ID format follows reverse domain naming",
      "Handle transaction verification with App Store Server API"
    ]
  }
}
```

### Android Game Request

```javascript
const response = await fetch('/api/sdk/get-item-variant', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: 'your-game-id',
    virtualItemName: 'Gold Pack',
    userId: 'player123',
    platform: 'android'
  })
});

const result = await response.json();
```

**Android Response**:
```json
{
  "variant": {
    "productId": "com.nandi.12345678.goldpack_lowerprice",
    "price": {
      "cents": 399,
      "dollars": 3.99,
      "currency": "USD", 
      "formatted": "$3.99"
    },
    "quantity": 1000,
    "platform": "android",
    "productType": "consumable"
  },
  "platformSpecific": {
    "productId": "com.nandi.12345678.goldpack_lowerprice",
    "billingLibraryVersion": "8.0.0",
    "acknowledgmentRequired": true,
    "prorationMode": 1
  },
  "instructions": {
    "displayInstructions": [
      "Display \"1000\" units for \"$3.99\"",
      "Use Android Product ID: \"com.nandi.12345678.goldpack_lowerprice\" for Play Billing"
    ],
    "platformInstructions": [
      "Use Google Play Billing Library for purchase flow",
      "Product ID is lowercase only with specific character restrictions", 
      "Acknowledge purchases after verification to avoid refunds"
    ]
  }
}
```

## Experiment Creation with Platform Support

When creating a sample experiment:

```bash
curl -X POST http://localhost:3000/api/experiments/create-sample \
  -H "Content-Type: application/json" \
  -d '{"gameId": "your-game-id"}'
```

**What gets created**:
1. **1 Virtual Item**: Gold Pack
2. **8 SKU Variants**: 4 variants × 2 platforms each
   - Control (iOS + Android)
   - Lower Price (iOS + Android) 
   - More Gold (iOS + Android)
   - Premium Price (iOS + Android)
3. **4 Experiment Arms**: One per variant group
   - Each arm contains metadata linking to both platform variants
   - Traffic allocation applies to the variant concept, not individual platforms

## Platform-Specific Considerations

### iOS Specific
- Product IDs use mixed case with reverse domain naming
- StoreKit 2 is assumed for modern implementation
- Family sharing settings can be configured
- Content versioning supported

### Android Specific  
- Product IDs are strictly lowercase
- Google Play Billing Library 8.0.0 compatibility
- Acknowledgment required for consumable purchases
- Proration modes for subscription handling

### Cross-Platform Experiments
- Bandit algorithm treats iOS and Android variants of the same concept as one arm
- Conversion rates are calculated across both platforms for each variant
- Traffic allocation applies to the variant concept, with platform selection handled automatically based on the requesting client

## Integration with Your Colleague's Purchase System

The SDK returns the correct platform-specific product ID format that your colleague's purchase verification system can use:

**For iOS**: Use the `platformSpecific.productIdentifier` for StoreKit calls
**For Android**: Use the `platformSpecific.productId` for Google Play Billing calls

The purchase verification happens outside our system - we just provide the right product identifiers for each platform and track the results for the bandit algorithm.

## Testing Platform Differences

You can test with different platforms:

```bash
# Test iOS variant selection
curl "http://localhost:3000/api/sdk/get-item-variant?gameId=test-game&virtualItemName=Gold%20Pack&userId=test-user&platform=ios"

# Test Android variant selection  
curl "http://localhost:3000/api/sdk/get-item-variant?gameId=test-game&virtualItemName=Gold%20Pack&userId=test-user&platform=android"
```

Both should return the same experiment arm but with platform-appropriate product IDs and metadata.