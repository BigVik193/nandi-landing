# In-App Purchase Setup Guide

This guide explains how to set up and test in-app purchases in your Nandi Test App.

## Prerequisites

1. **App Published to Google Play Internal Testing**
   - Your app must be published to at least Internal Testing track
   - The app must have the BILLING permission (already added to app.json)

2. **Products Created in Google Play Console**
   - You need to create in-app products in Google Play Console
   - Or use your Nandi API to create them programmatically

## Product SKUs Expected by the App

The app is configured to look for these product SKUs:
- `gold_pack_100` - Small gold pack
- `gold_pack_500` - Medium gold pack  
- `gold_pack_1000` - Large gold pack
- `premium_subscription` - Premium subscription

## Setup Steps

### 1. Install Dependencies

```bash
cd nandi-expo-app
npm install
```

### 2. Create Products in Google Play Console

Go to Google Play Console > Your App > Monetization > Products and create products with the SKUs listed above.

**OR** use your Nandi API to create them:

```bash
curl -X POST http://localhost:3000/api/store/products \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "your-game-uuid",
    "targetStores": "google_play",
    "publishImmediately": true,
    "product": {
      "name": "100 Gold Coins",
      "description": "Get 100 gold coins to enhance your gameplay!",
      "price": 0.99,
      "currency": "USD",
      "type": "consumable"
    }
  }'
```

### 3. Build and Test

```bash
# Build development version
eas build --platform android --profile development

# Or build preview for testing
eas build --platform android --profile preview

# Install on device/emulator
adb install build-*.apk

# Start development server
npx expo start --dev-client
```

### 4. Testing Purchases

- **Internal Testing**: Real purchases but no money charged
- **Production**: Real money charged
- **Test Accounts**: Add test accounts in Google Play Console for safe testing

## App Features

### HomeScreen
- Welcome screen with app info
- Navigation to the store

### StoreScreen  
- Fetches available products from Google Play
- Displays products with prices in local currency
- Handles purchase flow
- Shows connection status

### Purchase Flow
1. User taps "Buy" button
2. Confirmation dialog appears
3. Google Play purchase dialog opens
4. Purchase is processed
5. Success/failure feedback shown
6. Purchase is acknowledged (required for Android)

## Troubleshooting

### "No products available"
- Check that products are created in Google Play Console
- Ensure product SKUs match what the app expects
- Verify app is published to at least Internal Testing

### "Not connected to Google Play"
- App must be installed from Google Play (not sideloaded APK)
- Device must have Google Play Services
- Must be signed with same keystore as uploaded to Play Console

### Purchase fails
- Ensure BILLING permission is in AndroidManifest
- Check that user account has payment method
- For testing, use test accounts from Play Console

## Next Steps

1. Build and upload new APK with in-app purchase functionality
2. Create products using your Nandi API
3. Test purchases on real device
4. Integrate with your backend for purchase validation
5. Add analytics and user state management

## Code Structure

```
src/
├── hooks/
│   └── useIAP.js          # In-app purchase hook
├── screens/
│   ├── HomeScreen.js      # Welcome/navigation screen
│   └── StoreScreen.js     # Product listing and purchase
```