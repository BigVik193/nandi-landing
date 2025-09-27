import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getAuthInfo, createUnauthorizedResponse } from '@/lib/auth/api-key-utils';

export async function POST(request: NextRequest) {
  try {
    // Validate API key and get game ID
    const authInfo = await getAuthInfo(request);
    if (!authInfo.isValid) {
      return createUnauthorizedResponse(authInfo.error || 'Invalid API key');
    }

    const body = await request.json();
    const {
      playerId, // This would be the actual player ID from your players table
      userId,   // This might be an external user ID
      eventType,
      itemId,   // Developer-friendly item ID
      skuVariantId,
      experimentId,
      experimentArmId,
      sessionId,
      properties = {}
    } = body;

    const gameId = authInfo.gameId;

    // Basic validation
    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = [
      'store_view', 'item_view', 'item_click', 'purchase_start', 
      'purchase_complete', 'purchase_fail', 'experiment_view'
    ];

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Resolve playerId if only userId provided
    let resolvedPlayerId = playerId;
    
    if (!playerId && userId) {
      // Try to find existing player by external user ID
      const { data: player } = await supabaseAdmin
        .from('players')
        .select('id')
        .eq('game_id', gameId)
        .eq('external_player_id', userId)
        .maybeSingle();

      if (player) {
        resolvedPlayerId = player.id;
      } else {
        // Create a new player record
        const { data: newPlayer, error: playerError } = await supabaseAdmin
          .from('players')
          .insert({
            game_id: gameId,
            external_player_id: userId,
            platform: 'unknown',
            first_seen_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (playerError) {
          console.error('Failed to create player:', playerError);
          return NextResponse.json(
            { error: 'Failed to create player record' },
            { status: 400 }
          );
        }

        resolvedPlayerId = newPlayer.id;
      }
    }

    if (!resolvedPlayerId) {
      return NextResponse.json(
        { error: 'Either playerId or userId must be provided' },
        { status: 400 }
      );
    }

    // Resolve itemId to virtualItemId (UUID) for database storage
    let resolvedVirtualItemId = null;
    if (itemId) {
      const { data: virtualItem } = await supabaseAdmin
        .from('virtual_items')
        .select('id')
        .eq('game_id', gameId)
        .eq('item_id', itemId)
        .eq('status', 'active')
        .maybeSingle();

      if (virtualItem) {
        resolvedVirtualItemId = virtualItem.id;
      }
    }

    // Insert the event
    const eventData = {
      player_id: resolvedPlayerId,
      event_type: eventType,
      virtual_item_id: resolvedVirtualItemId || null,
      sku_variant_id: skuVariantId || null,
      experiment_id: experimentId || null,
      experiment_arm_id: experimentArmId || null,
      session_id: sessionId || null,
      properties: {
        ...properties,
        sdk_version: properties.sdk_version || 'unknown',
        platform: properties.platform || 'unknown',
        game_version: properties.game_version || 'unknown'
      }
    };

    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (eventError) {
      console.error('Failed to insert event:', eventError);
      return NextResponse.json(
        { error: 'Failed to log event: ' + eventError.message },
        { status: 400 }
      );
    }

    // For purchase events, also handle purchase record creation
    if (eventType === 'purchase_complete' && skuVariantId) {
      const purchaseData = {
        player_id: resolvedPlayerId,
        sku_variant_id: skuVariantId,
        experiment_id: experimentId || null,
        experiment_arm_id: experimentArmId || null,
        transaction_id: properties.transactionId || `temp_${Date.now()}`,
        platform: properties.platform || 'unknown',
        price_cents: properties.priceCents || 0,
        currency: properties.currency || 'USD',
        quantity: properties.quantity || 1,
        status: 'pending', // Will be verified later
        purchased_at: new Date().toISOString(),
        metadata: {
          sdk_generated: true,
          original_event_id: event.id
        }
      };

      const { error: purchaseError } = await supabaseAdmin
        .from('purchases')
        .insert(purchaseData);

      if (purchaseError) {
        console.error('Failed to create purchase record:', purchaseError);
        // Don't fail the event logging, but log the error
      }
    }

    return NextResponse.json({
      success: true,
      eventId: event.id,
      playerId: resolvedPlayerId,
      timestamp: event.timestamp || event.created_at,
      message: 'Event logged successfully',
      metadata: {
        eventType,
        experimentId,
        experimentArmId,
        processingTime: Date.now()
      }
    });

  } catch (error) {
    console.error('SDK log event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Batch event logging for better performance
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, playerId, userId } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'events array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (events.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 events per batch request' },
        { status: 400 }
      );
    }

    // Process each event individually but in a transaction-like manner
    const results = [];
    const errors = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      try {
        const response = await POST(new NextRequest(request.url, {
          method: 'POST',
          body: JSON.stringify({
            ...event,
            playerId: event.playerId || playerId,
            userId: event.userId || userId
          }),
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          }
        }));

        const result = await response.json();
        results.push({ index: i, ...result });
      } catch (error) {
        errors.push({ index: i, error: error instanceof Error ? error.message : String(error) });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      processedEvents: results.length,
      failedEvents: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('SDK batch log events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}