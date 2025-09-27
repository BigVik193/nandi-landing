import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getAuthInfo, createUnauthorizedResponse } from '@/lib/auth/api-key-utils';

export async function POST(request: NextRequest) {
  try {
    // Validate API key and get game ID
    const authInfo = await getAuthInfo(request);
    if (!authInfo.isValid) {
      console.error('API key validation failed:', authInfo.error);
      return createUnauthorizedResponse(authInfo.error || 'Invalid API key');
    }

    console.log('API key validated successfully, game ID:', authInfo.gameId);

    const body = await request.json();
    const { 
      externalPlayerId, 
      deviceId, 
      platform, 
      appVersion, 
      metadata = {}
    } = body;

    console.log('Player identification request:', { externalPlayerId, deviceId, platform, appVersion });

    // Basic validation
    if (!externalPlayerId) {
      return NextResponse.json(
        { success: false, error: 'externalPlayerId is required' },
        { status: 400 }
      );
    }

    const gameId = authInfo.gameId;
    console.log('Looking for player with external ID:', externalPlayerId, 'in game:', gameId);

    // Check if player already exists
    const { data: existingPlayer, error: findError } = await supabaseAdmin
      .from('players')
      .select('id, external_player_id, platform, app_version, sdk_version, first_seen_at')
      .eq('game_id', gameId)
      .eq('external_player_id', externalPlayerId)
      .maybeSingle();

    if (findError) {
      console.error('Error finding existing player:', findError);
    }

    console.log('Existing player lookup result:', existingPlayer ? 'FOUND' : 'NOT FOUND');

    if (existingPlayer) {
      console.log('Updating existing player:', existingPlayer.id);
      // Update last_seen_at and any new metadata
      const updateData: any = {
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Update platform, app_version if they've changed
      if (platform && platform !== existingPlayer.platform) {
        updateData.platform = platform;
      }
      if (appVersion && appVersion !== existingPlayer.app_version) {
        updateData.app_version = appVersion;
      }
      if (deviceId) {
        updateData.device_id = deviceId;
      }

      const { error: updateError } = await supabaseAdmin
        .from('players')
        .update(updateData)
        .eq('id', existingPlayer.id);

      if (updateError) {
        console.error('Failed to update existing player:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update player record' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: existingPlayer.id,
          externalPlayerId: existingPlayer.external_player_id,
          isNewPlayer: false,
          firstSeenAt: existingPlayer.first_seen_at
        }
      });
    }

    // Create new player
    console.log('Creating new player for external ID:', externalPlayerId);
    const playerData = {
      game_id: gameId,
      external_player_id: externalPlayerId,
      device_id: deviceId,
      platform: platform || 'web',
      app_version: appVersion,
      sdk_version: request.headers.get('X-SDK-Version') || 'unknown',
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    };
    console.log('Player data to insert:', playerData);

    const { data: newPlayer, error: createError } = await supabaseAdmin
      .from('players')
      .insert(playerData)
      .select('id, external_player_id, first_seen_at')
      .single();

    if (createError) {
      console.error('Failed to create new player:', createError);
      return NextResponse.json(
        { success: false, error: 'Failed to create player record: ' + createError.message },
        { status: 500 }
      );
    }

    console.log('New player created successfully:', newPlayer.id);

    return NextResponse.json({
      success: true,
      data: {
        id: newPlayer.id,
        externalPlayerId: newPlayer.external_player_id,
        isNewPlayer: true,
        firstSeenAt: newPlayer.first_seen_at
      }
    });

  } catch (error) {
    console.error('Player identification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}