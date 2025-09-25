# Build APK Instructions

This Expo project is configured to build an Android APK with package name `com.hbellala.nandi`.

## Prerequisites

1. **Create Expo Account**: Go to [expo.dev](https://expo.dev) and create a free account
2. **Install EAS CLI**: Already installed globally on this system

## Build Steps

### 1. Login to EAS
```bash
cd nandi-expo-app
eas login
```
Enter your Expo account credentials.

### 2. Build the APK
```bash
eas build --platform android --profile preview
```

This will:
- Upload your project to Expo's build servers
- Build an APK with package name `com.hbellala.nandi`
- Provide a download link when complete (usually takes 5-10 minutes)

### 3. Download the APK
Once the build completes, you'll get a download link. Download the APK file.

## Alternative: Local Build (if you have Android SDK)

If you have Android SDK installed:
```bash
cd nandi-expo-app
npx expo run:android --variant release
```

The APK will be in `android/app/build/outputs/apk/release/`

## Next Steps

1. Upload the downloaded APK to Google Play Console
2. Go to **Testing** → **Internal testing** → **Create new release**
3. Upload the APK
4. Click **Save** (don't publish)
5. Package name `com.hbellala.nandi` is now registered!

## App Details

- **Package Name**: com.hbellala.nandi
- **App Name**: Nandi Test App
- **Purpose**: Minimal app to register package name for Google Play API access

The app displays:
```
Nandi Test App
This is a minimal app for API testing.
Package: com.hbellala.nandi
```