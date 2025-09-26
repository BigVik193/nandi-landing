import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

// Generate a secure session token
function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      playerId, 
      deviceId, 
      platform, 
      appVersion, 
      sdkVersion, 
      metadata = {} 
    } = body;

    // Basic validation
    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'playerId is required' },
        { status: 400 }
      );
    }

    // Validate API key
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key required' },
        { status: 401 }
      );
    }

    // Verify the player exists
    const { data: player } = await supabaseAdmin
      .from('players')
      .select('id, game_id')
      .eq('id', playerId)
      .single();

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    // Generate unique session token
    const sessionToken = generateSessionToken();
    
    // Get client IP and User-Agent for additional tracking
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create session record
    const { data: session, error: createError } = await supabaseAdmin
      .from('sessions')
      .insert({
        player_id: playerId,
        session_token: sessionToken,
        device_id: deviceId,
        platform: platform || 'web',
        app_version: appVersion,
        sdk_version: sdkVersion,
        ip_address: clientIP,
        user_agent: userAgent,
        metadata: {
          ...metadata,
          created_via: 'sdk_api',
          client_timestamp: metadata.clientTimestamp || new Date().toISOString()
        },
        started_at: new Date().toISOString()
      })
      .select('id, session_token, started_at')
      .single();

    if (createError) {
      console.error('Failed to create session:', createError);
      return NextResponse.json(
        { success: false, error: 'Failed to create session: ' + createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        sessionToken: session.session_token,
        startedAt: session.started_at
      }
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT endpoint to end a session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, sessionToken } = body;

    if (!sessionId || !sessionToken) {
      return NextResponse.json(
        { success: false, error: 'sessionId and sessionToken are required' },
        { status: 400 }
      );
    }

    // End the session
    const { data: session, error: updateError } = await supabaseAdmin
      .from('sessions')
      .update({
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('session_token', sessionToken)
      .select('id, ended_at')
      .single();

    if (updateError) {
      console.error('Failed to end session:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to end session: ' + updateError.message },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found or token mismatch' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        endedAt: session.ended_at
      }
    });

  } catch (error) {
    console.error('Session end error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}