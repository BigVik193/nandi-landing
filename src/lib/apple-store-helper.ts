import { SignJWT, importPKCS8 } from 'jose';

// Apple App Store Connect API base URL
const APP_STORE_CONNECT_API_BASE = 'https://api.appstoreconnect.apple.com/v1';

interface AppleStoreCredentials {
  app_name: string;
  bundle_id: string;
  p8_key_content: string;
  key_id: string;
  issuer_id: string;
}

// JWT tokens are required by Apple's App Store Connect API for authentication.
// Apple doesn't use simple API keys - they require ES256-signed JWT tokens
// that prove you have the private key (.p8 file) they gave you.
export async function createAppleStoreJWT(
  issuer_id: string,
  key_id: string,
  private_key: string
): Promise<string> {
  console.log('[JWT] Creating Apple Store Connect auth token');
  
  try {
    // Convert P8 key content to proper format if needed
    let privateKey = private_key.trim();
    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
    }

    // Import the private key using jose
    const privateKeyObject = await importPKCS8(privateKey, 'ES256');

    // Create JWT - Apple requires specific claims and ES256 signing
    const jwt = await new SignJWT({
      iss: issuer_id,
      aud: 'appstoreconnect-v1'
    })
      .setProtectedHeader({
        alg: 'ES256',
        kid: key_id,
        typ: 'JWT'
      })
      .setIssuedAt()
      .setExpirationTime('20m') // 20 minutes as per Apple's requirements
      .sign(privateKeyObject);

    console.log('[JWT] Token created successfully');
    return jwt;
  } catch (error) {
    console.error('[JWT] Failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to create Apple Store Connect JWT token: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Fetch Apple App ID for a bundle ID using Apple's API
export async function fetchAppleAppId(
  credentials: AppleStoreCredentials
): Promise<{ success: boolean; app_id?: string; error?: string }> {
  console.log('[Apple App] Fetching App ID for bundle:', credentials.bundle_id);
  
  try {
    // Create JWT token for Apple API authentication
    const jwt = await createAppleStoreJWT(
      credentials.issuer_id,
      credentials.key_id,
      credentials.p8_key_content
    );

    // Query Apple's API for apps with this bundle ID
    const response = await fetch(`${APP_STORE_CONNECT_API_BASE}/apps?filter[bundleId]=${credentials.bundle_id}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Apple App] API error:', response.status, errorText.substring(0, 200));
      return { 
        success: false, 
        error: `Apple API error (${response.status}): ${errorText.substring(0, 200)}` 
      };
    }

    const data = await response.json();
    const apps = data.data || [];
    
    console.log('[Apple App] Found', apps.length, 'apps for bundle ID');
    
    if (apps.length === 0) {
      return { 
        success: false, 
        error: `No app found with bundle ID '${credentials.bundle_id}' in your Apple Developer account` 
      };
    }

    // Find the app with matching bundle ID (should be exact match)
    const matchingApp = apps.find((app: any) => 
      app.attributes?.bundleId === credentials.bundle_id
    );

    if (!matchingApp) {
      return { 
        success: false, 
        error: `Bundle ID '${credentials.bundle_id}' not found in search results` 
      };
    }

    console.log('[Apple App] Found app ID:', matchingApp.id);
    return { 
      success: true, 
      app_id: matchingApp.id 
    };
  } catch (error) {
    console.error('[Apple App] Fetch failed:', error instanceof Error ? error.message : 'Unknown error');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}