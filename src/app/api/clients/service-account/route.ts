import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ServiceAccountRequest {
  gameId: string;
  credentialName: string;
  googlePlayPackageName: string;
  appStoreBundleId?: string;
  serviceAccountJson: string;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body: ServiceAccountRequest = await request.json();
    const { gameId, credentialName, googlePlayPackageName, appStoreBundleId, serviceAccountJson } = body;

    // Validate input
    console.log('Received data:', { gameId, credentialName, googlePlayPackageName, hasServiceAccount: !!serviceAccountJson });
    
    if (!gameId || !credentialName || !googlePlayPackageName || !serviceAccountJson) {
      const missingFields = [];
      if (!gameId) missingFields.push('gameId');
      if (!credentialName) missingFields.push('credentialName');
      if (!googlePlayPackageName) missingFields.push('googlePlayPackageName');
      if (!serviceAccountJson) missingFields.push('serviceAccountJson');
      
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // Validate JSON format
    let parsedServiceAccount;
    try {
      parsedServiceAccount = JSON.parse(serviceAccountJson);
      
      // Validate it's actually a service account
      if (!parsedServiceAccount.type || parsedServiceAccount.type !== 'service_account') {
        throw new Error('Invalid service account format');
      }
      
      if (!parsedServiceAccount.client_email || !parsedServiceAccount.private_key) {
        throw new Error('Missing required service account fields');
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid service account JSON format',
      }, { status: 400 });
    }

    // Get the game to find the developer_id
    console.log(`🔍 Looking for game with ID: ${gameId}`);
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, developer_id')
      .eq('id', gameId)
      .single();

    console.log('Game query result:', { game, gameError });

    if (gameError) {
      console.error('Game query error:', gameError);
      return NextResponse.json({
        success: false,
        error: `Database error: ${gameError.message}`,
      }, { status: 500 });
    }

    if (!game) {
      // Let's also check what games exist
      const { data: allGames } = await supabase
        .from('games')
        .select('id, name')
        .limit(10);
      
      console.log('Available games:', allGames);
      
      return NextResponse.json({
        success: false,
        error: `Game with ID ${gameId} not found. Available games: ${allGames?.map(g => `${g.id}: ${g.name}`).join(', ') || 'none'}`,
      }, { status: 404 });
    }

    // Prepare metadata
    const metadata = {
      client_email: parsedServiceAccount.client_email,
      project_id: parsedServiceAccount.project_id,
      package_name: googlePlayPackageName,
      ...(appStoreBundleId && { bundle_id: appStoreBundleId })
    };

    // Deactivate any existing Google Play credentials for this game
    const { error: deactivateError } = await supabase
      .from('store_credentials')
      .update({ is_active: false })
      .eq('game_id', gameId)
      .eq('store_type', 'google_play')
      .eq('is_active', true);

    if (deactivateError) {
      console.error('Error deactivating existing credentials:', deactivateError);
    }

    // Insert new credentials
    const { data: credential, error: insertError } = await supabase
      .from('store_credentials')
      .insert({
        developer_id: game.developer_id,
        game_id: gameId,
        store_type: 'google_play',
        credential_name: credentialName,
        credential_data: parsedServiceAccount,
        metadata: metadata,
        validation_status: 'pending',
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save credentials',
      }, { status: 500 });
    }

    console.log(`📱 Google Play credentials saved for game ${gameId}`);
    console.log(`🔑 Service account: ${parsedServiceAccount.client_email}`);

    return NextResponse.json({
      success: true,
      data: {
        credentialId: credential.id,
        message: 'Google Play service account credentials saved successfully',
        metadata
      }
    });

  } catch (error) {
    console.error('Service account registration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const storeType = searchParams.get('storeType') || 'google_play';

    if (!gameId) {
      return NextResponse.json({
        success: false,
        error: 'Game ID is required',
      }, { status: 400 });
    }

    // Get credentials from database
    const { data: credentials, error } = await supabase
      .from('store_credentials')
      .select(`
        id,
        credential_name,
        store_type,
        is_active,
        validation_status,
        validation_error,
        metadata,
        last_validated_at,
        created_at,
        updated_at
      `)
      .eq('game_id', parseInt(gameId))
      .eq('store_type', storeType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch credentials',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: credentials || [],
    });

  } catch (error) {
    console.error('Get service account credentials error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}