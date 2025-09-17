# Nandi Demo Onboarding and User Journey  
Source :contentReference[oaicite:0]{index=0}

## 1) Account
- User creates an account and signs in.

## 2) Initial Questionnaire
Capture the basics so the setup can be tailored:
- Game genre.
- Platform (iOS, Android).
- Language or engine (Unity, Swift, Kotlin, Godot, etc.).
- Goal: design a new in-game store from scratch vs augment or optimize an existing store.
- Channels: in-app only (minimum) or also a full web-based store linked from the in-app store (similar to Clash Royale).
- Any other relevant details as needed.

## 3) SDK Installation
- Install the SDK with options for different languages and game frameworks.

## 4) Codebase and UI Understanding (AI Assist)
- For 1–2 minutes, analyze how their code is organized (for example, where payment logic lives) and learn their UI look and structure.  
- Implementation approaches to consider:
  - Scrape or fetch structure after the SDK is added.
  - Connect to their GitHub for deeper analysis.

## 5) Branching Onboarding Paths
Depending on whether they already have an in-game store:

### A) They already have a dynamic in-game store (Server-Driven Store Config or Remote Config / Cloud Content Delivery)
1. Render their existing in-game store so they can preview it.
2. Let them click specific sections or layout areas to grant the SDK live access for future changes and testing.
3. Ask them to define game entities and map them to code assets (images, icons, etc.) and meanings. This is crucial:
   - In-game currencies (for example, gems, coins). Example values: $1 to $2 per 100 gems, $1 to $2 per 1,000 coins.
   - Cosmetics (for example, skins, tower skins, emotes) with rarity tiers. Example values: rare $1 to $2, epic $2 to $5, legendary or limited $5+.
   - Ability or progression items (for example, upgrades for different cards), purchased via in-game currency or real money.
4. Ask them to define pricing tolerances in real money for each entity type.

### B) They need a new in-game store from scratch
1. Ask them to define game entities and map to their code assets (images, icons, etc.) and meanings (same as above).
2. Ask them to define pricing tolerances in real money for each entity type.
3. Provide a Lovable-like interface (look up how this looks/works if needed... there's an ai agent panel on the left and the live render on the right) connected to their GitHub. They can prompt AI to build the store structure, which is live rendered and already uses their styling and entities.
4. Let them click specific sections or layout areas to grant the SDK live access for future changes and testing.

## 6) Analytics Integration (Optional)
- Let them connect an existing analytics platform such as Unity Analytics, GameAnalytics, or Google Analytics via Firebase.
- If connected, also access consumer groups and user profiles to inform how bundles and purchase options are optimized.

## 8) Main Dashboard (Post-Onboarding)
- Top section shows key analytics: revenue so far, conversion rate, and how it has changed.
- Below that, show currently running tests. Clicking a test opens a test-specific analytics view:
  1. Show before/after variants (pricing, layout, bundles or offers).
  2. Show conversion lifts and results.
