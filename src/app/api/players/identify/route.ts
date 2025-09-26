import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      externalPlayerId, 
      deviceId, 
      platform, 
      appVersion, 
      metadata = {},
      gameId 
    } = body;

    // Basic validation
    if (!externalPlayerId) {
      return NextResponse.json(
        { success: false, error: 'externalPlayerId is required' },
        { status: 400 }
      );
    }

    // For now, we'll extract gameId from API key or require it in request
    // TODO: In production, validate API key and get gameId from it
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key required' },
        { status: 401 }
      );
    }

    // For MVP, we'll require gameId in the request body since API key validation isn't implemented
    if (!gameId) {
      return NextResponse.json(
        { success: false, error: 'gameId is required' },
        { status: 400 }
      );
    }

    // Check if player already exists
    const { data: existingPlayer } = await supabaseAdmin
      .from('players')
      .select('id, external_player_id, platform, app_version, sdk_version, first_seen_at')
      .eq('game_id', gameId)
      .eq('external_player_id', externalPlayerId)
      .maybeSingle();

    if (existingPlayer) {
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
    const { data: newPlayer, error: createError } = await supabaseAdmin
      .from('players')
      .insert({
        game_id: gameId,
        external_player_id: externalPlayerId,
        device_id: deviceId,
        platform: platform || 'web',
        app_version: appVersion,
        sdk_version: request.headers.get('X-SDK-Version') || 'unknown',
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString()
      })
      .select('id, external_player_id, first_seen_at')
      .single();

    if (createError) {
      console.error('Failed to create new player:', createError);
      return NextResponse.json(
        { success: false, error: 'Failed to create player record: ' + createError.message },
        { status: 500 }
      );
    }

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