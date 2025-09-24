import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Get API keys for the game
    const { data: apiKeys, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id,
        name,
        key_prefix,
        permissions,
        is_active,
        last_used_at,
        expires_at,
        created_at,
        game_id,
        games!inner (
          developer_id
        )
      `)
      .eq('game_id', gameId)
      .eq('games.developer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('API keys GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, name, permissions, expiresAt } = await request.json();

    if (!gameId || !name) {
      return NextResponse.json({ error: 'Game ID and name are required' }, { status: 400 });
    }

    // Verify user owns the game
    const { data: game, error: gameError } = await supabaseAdmin
      .from('games')
      .select('id')
      .eq('id', gameId)
      .eq('developer_id', user.id)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: 'Game not found or unauthorized' }, { status: 404 });
    }

    // Generate API key
    const apiKey = `nandi_${crypto.randomBytes(16).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 12) + '...';

    // Insert API key
    const { data: newApiKey, error: insertError } = await supabaseAdmin
      .from('api_keys')
      .insert({
        game_id: gameId,
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        permissions: permissions || { read: true, write: true },
        expires_at: expiresAt || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating API key:', insertError);
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
    }

    // Return the API key with the actual key (only shown once)
    return NextResponse.json({
      apiKey: {
        ...newApiKey,
        key: apiKey // Only returned on creation
      }
    });
  } catch (error) {
    console.error('API keys POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}