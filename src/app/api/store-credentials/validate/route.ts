import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';

// Apple App Store Connect API base URL
const APP_STORE_CONNECT_API_BASE = 'https://api.appstoreconnect.apple.com/v1';

// Types for Apple Store credentials
interface AppleStoreCredentials {
  app_name: string;
  bundle_id: string;
  p8_key_content: string;
  key_id: string;
  issuer_id: string;
}

// Helper function to create JWT token for Apple App Store Connect API
// JWT tokens are required by Apple's App Store Connect API for authentication.
// Apple doesn't use simple API keys - they require ES256-signed JWT tokens
// that prove you have the private key (.p8 file) they gave you.
async function createAppleStoreJWT(
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

// Helper function to validate Apple Store credentials by calling their API
async function validateAppleStoreCredentials(
  credentials: AppleStoreCredentials
): Promise<{ valid: boolean; error?: string; apps?: any[]; matched_app?: any; total_apps_in_account?: number }> {
  console.log('[Apple] Validating credentials for:', credentials.app_name, credentials.bundle_id);
  
  try {
    // Create JWT token for Apple API authentication
    const jwt = await createAppleStoreJWT(
      credentials.issuer_id,
      credentials.key_id,
      credentials.p8_key_content
    );

    // Test the credentials by calling Apple's API
    const response = await fetch(`${APP_STORE_CONNECT_API_BASE}/apps`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Apple] API error:', response.status, errorText.substring(0, 200));
      return {
        valid: false,
        error: `Apple Store Connect API error: ${response.status} ${errorText}`
      };
    }

    const data = await response.json();
    const apps = data.data || [];
    console.log('[Apple] Found', apps.length, 'apps in account');
    
    // Check if the bundle ID exists in the apps
    console.log('[Apple] Searching for bundle ID:', credentials.bundle_id);
    console.log('[Apple] Available apps:', apps.map((app: any) => ({ 
      id: app.id, 
      name: app.attributes?.name, 
      bundleId: app.attributes?.bundleId 
    })));
    
    const bundleApp = apps.find((app: any) => 
      app.attributes?.bundleId === credentials.bundle_id
    );
    
    console.log('[Apple] Found matching app:', bundleApp ? {
      id: bundleApp.id,
      name: bundleApp.attributes?.name,
      bundleId: bundleApp.attributes?.bundleId
    } : 'null');

    if (!bundleApp && credentials.bundle_id) {
      console.warn('[Apple] Bundle ID not found:', credentials.bundle_id);
      return {
        valid: false,
        error: `Bundle ID "${credentials.bundle_id}" not found in your App Store Connect account`
      };
    }

    console.log('[Apple] Validation successful');
    return {
      valid: true,
      apps,
      matched_app: bundleApp ? {
        id: bundleApp.id,
        name: bundleApp.attributes?.name,
        bundleId: bundleApp.attributes?.bundleId,
        sku: bundleApp.attributes?.sku
      } : null,
      total_apps_in_account: apps.length
    };
  } catch (error) {
    console.error('[Apple] Validation failed:', error instanceof Error ? error.message : 'Unknown error');
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      app_name,
      bundle_id,
      p8_key_content,
      key_id,
      issuer_id
    } = body;

    // Validate required fields
    if (!app_name || !bundle_id || !p8_key_content || !key_id || !issuer_id) {
      return NextResponse.json(
        { error: 'All fields are required: app_name, bundle_id, p8_key_content, key_id, issuer_id' },
        { status: 400 }
      );
    }

    // Validate Apple Store credentials
    const validation = await validateAppleStoreCredentials({
      app_name,
      bundle_id,
      p8_key_content,
      key_id,
      issuer_id
    });

    if (!validation.valid) {
      return NextResponse.json(
        { 
          valid: false,
          error: validation.error 
        },
        { status: 200 } // Return 200 for validation failures, not 400
      );
    }

    return NextResponse.json({
      valid: true,
      apps: validation.apps,
      matched_app: validation.matched_app,
      total_apps_in_account: validation.total_apps_in_account
    });
  } catch (error) {
    console.error('Store credentials validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}