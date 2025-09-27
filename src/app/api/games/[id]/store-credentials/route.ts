import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const body = await request.json();
    const {
      app_name,
      bundle_id,
      p8_key_content,
      key_id,
      issuer_id
    } = body;

    // Validate required fields
    if (!gameId || !app_name || !bundle_id || !p8_key_content || !key_id || !issuer_id) {
      return NextResponse.json(
        { error: 'All fields are required: gameId, app_name, bundle_id, p8_key_content, key_id, issuer_id' },
        { status: 400 }
      );
    }

    // Validate that the game exists and get its developer
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id, developer_id, bundle_id')
      .eq('id', gameId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if bundle_id matches the game's bundle_id (if set)
    if (game.bundle_id && game.bundle_id !== bundle_id) {
      return NextResponse.json(
        { error: `Bundle ID mismatch. Game has bundle ID "${game.bundle_id}" but you provided "${bundle_id}"` },
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
        { error: `Apple Store credentials validation failed: ${validation.error}` },
        { status: 400 }
      );
    }

    // Check if credentials already exist for this game and store type
    const { data: existingCredentials } = await supabaseAdmin
      .from('store_credentials')
      .select('id')
      .eq('game_id', gameId)
      .eq('store_type', 'app_store')
      .eq('is_active', true)
      .maybeSingle();

    if (existingCredentials) {
      // Update existing credentials
      const { data: updatedCredentials, error: updateError } = await supabaseAdmin
        .from('store_credentials')
        .update({
          credential_name: `${app_name} - App Store`,
          credential_data: {
            app_name,
            bundle_id,
            p8_key_content,
            key_id,
            issuer_id
          },
          validation_status: 'valid',
          last_validated_at: new Date().toISOString(),
          validation_error: null,
          metadata: {
            apps_count: validation.apps?.length || 0
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCredentials.id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update store credentials:', updateError);
        return NextResponse.json(
          { error: 'Failed to update store credentials: ' + updateError.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Apple Store credentials updated successfully',
        credential_id: updatedCredentials.id
      });
    } else {
      // Create new credentials
      const { data: newCredentials, error: createError } = await supabaseAdmin
        .from('store_credentials')
        .insert({
          developer_id: game.developer_id,
          game_id: gameId,
          store_type: 'app_store',
          credential_name: `${app_name} - App Store`,
          credential_data: {
            app_name,
            bundle_id,
            p8_key_content,
            key_id,
            issuer_id
          },
          is_active: true,
          validation_status: 'valid',
          last_validated_at: new Date().toISOString(),
          validation_error: null,
          metadata: {
            apps_count: validation.apps?.length || 0
          }
        })
        .select()
        .single();

      if (createError) {
        console.error('Failed to create store credentials:', createError);
        return NextResponse.json(
          { error: 'Failed to create store credentials: ' + createError.message },
          { status: 400 }
        );
      }

      // Update the game's bundle_id if not set
      if (!game.bundle_id) {
        await supabaseAdmin
          .from('games')
          .update({ bundle_id })
          .eq('id', gameId);
      }

      return NextResponse.json({
        success: true,
        message: 'Apple Store credentials validated and stored successfully',
        credential_id: newCredentials.id
      });
    }
  } catch (error) {
    console.error('Store credentials API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get store credentials for a game
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const { searchParams } = new URL(request.url);
    const storeType = searchParams.get('store_type') || 'app_store';

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Verify that the game exists
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id, developer_id')
      .eq('id', gameId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Get store credentials (without sensitive data)
    const { data: credentials, error } = await supabaseAdmin
      .from('store_credentials')
      .select(`
        id,
        credential_name,
        store_type,
        is_active,
        validation_status,
        last_validated_at,
        validation_error,
        metadata,
        created_at,
        updated_at,
        apple_app_id
      `)
      .eq('game_id', gameId)
      .eq('store_type', storeType)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch store credentials: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ credentials });
  } catch (error) {
    console.error('Store credentials fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete store credentials for a game
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const { searchParams } = new URL(request.url);
    const credentialId = searchParams.get('sku_id'); // Using sku_id for consistency with frontend

    console.log('[Delete Credentials] Starting deletion for game:', gameId, 'credential:', credentialId);

    if (!gameId || !credentialId) {
      return NextResponse.json(
        { error: 'Game ID and credential ID are required' },
        { status: 400 }
      );
    }

    // Verify that the game exists
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id, developer_id')
      .eq('id', gameId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Verify the credential belongs to this game
    const { data: credential } = await supabaseAdmin
      .from('store_credentials')
      .select('id, credential_name, game_id')
      .eq('id', credentialId)
      .eq('game_id', gameId)
      .single();

    if (!credential) {
      return NextResponse.json(
        { error: 'Store credential not found or does not belong to this game' },
        { status: 404 }
      );
    }

    // Delete the credential
    const { error: deleteError } = await supabaseAdmin
      .from('store_credentials')
      .delete()
      .eq('id', credentialId);

    if (deleteError) {
      console.error('[Delete Credentials] Database error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete store credentials: ' + deleteError.message },
        { status: 400 }
      );
    }

    console.log('[Delete Credentials] Successfully deleted:', credential.credential_name);

    return NextResponse.json({
      success: true,
      message: `Store credentials "${credential.credential_name}" deleted successfully`
    });
  } catch (error) {
    console.error('[Delete Credentials] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}