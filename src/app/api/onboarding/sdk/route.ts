import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';

function generateAPIKey(): string {
  // Generate a secure API key
  const prefix = 'nandi_';
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}${randomBytes}`;
}

function hashAPIKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      developerId,
      gameId,
      platform,
      sdkInstalled,
      testMode,
      apiKeyGenerated
    } = body;

    if (!developerId || !gameId) {
      return NextResponse.json(
        { error: 'Developer ID and Game ID are required' },
        { status: 400 }
      );
    }

    // Verify developer and game exist
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id, developer_id, name')
      .eq('id', gameId)
      .eq('developer_id', developerId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update game with SDK information
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (sdkInstalled) {
      updateData.sdk_version = '1.0.0'; // Default SDK version
      updateData.integration_status = testMode ? 'tested' : 'configured';
      updateData.last_diagnostic_at = new Date().toISOString();
    }

    if (platform) {
      updateData.platform = platform;
    }

    const { error: updateError } = await supabaseAdmin
      .from('games')
      .update(updateData)
      .eq('id', gameId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update game SDK status: ' + updateError.message },
        { status: 400 }
      );
    }

    let apiKey = null;
    let apiKeyDetails = null;

    if (apiKeyGenerated) {
      // Check if API key already exists for this game
      const { data: existingKey } = await supabaseAdmin
        .from('api_keys')
        .select('id, key_prefix')
        .eq('game_id', gameId)
        .eq('is_active', true)
        .single();

      if (!existingKey) {
        // Generate new API key
        apiKey = generateAPIKey();
        const keyHash = hashAPIKey(apiKey);
        const keyPrefix = apiKey.substring(0, 12) + '...';

        const { data: newApiKey, error: apiKeyError } = await supabaseAdmin
          .from('api_keys')
          .insert({
            game_id: gameId,
            name: `${game.name} - Production Key`,
            key_hash: keyHash,
            key_prefix: keyPrefix,
            permissions: {
              read: true,
              write: true,
              analytics: true,
              experiments: true
            },
            is_active: true
          })
          .select()
          .single();

        if (apiKeyError) {
          return NextResponse.json(
            { error: 'Failed to generate API key: ' + apiKeyError.message },
            { status: 400 }
          );
        }

        apiKeyDetails = {
          id: newApiKey.id,
          key: apiKey, // Return full key only on creation
          prefix: keyPrefix,
          name: newApiKey.name
        };
      } else {
        // Return existing key info (without the actual key)
        apiKeyDetails = {
          id: existingKey.id,
          prefix: existingKey.key_prefix,
          message: 'API key already exists. Please retrieve it from your dashboard.'
        };
      }
    }

    return NextResponse.json({ 
      success: true,
      gameId,
      apiKey: apiKeyDetails,
      integrationStatus: updateData.integration_status || 'configured'
    });
  } catch (error) {
    console.error('SDK configuration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}