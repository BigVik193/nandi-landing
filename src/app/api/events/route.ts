import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

interface Event {
  id?: string;
  playerId: string;
  sessionId?: string;
  eventType: 'store_view' | 'item_view' | 'item_click' | 'purchase_start' | 'purchase_complete' | 'custom';
  virtualItemId?: string;
  skuVariantId?: string;
  experimentId?: string;
  experimentArmId?: string;
  properties?: Record<string, any>;
  timestamp: string;
}

interface EventBatch {
  events: Event[];
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing API key' },
        { status: 401 }
      );
    }

    // TODO: Validate API key against database
    // For now, just check it's not empty
    if (!apiKey.trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const batch: EventBatch = await request.json();
    
    if (!batch.events || !Array.isArray(batch.events)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event batch format' },
        { status: 400 }
      );
    }

    // Validate each event
    for (const event of batch.events) {
      if (!event.playerId || !event.eventType || !event.timestamp) {
        return NextResponse.json(
          { success: false, error: 'Missing required event fields' },
          { status: 400 }
        );
      }
    }

    // Store events in Supabase database
    const eventsToInsert = batch.events.map(event => ({
      player_id: event.playerId,
      session_id: event.sessionId || null,
      event_type: event.eventType,
      virtual_item_id: event.virtualItemId || null,
      sku_variant_id: event.skuVariantId || null,
      experiment_id: event.experimentId || null,
      experiment_arm_id: event.experimentArmId || null,
      properties: event.properties || {},
      timestamp: event.timestamp
    }));

    const { data: insertedEvents, error: insertError } = await supabaseAdmin
      .from('events')
      .insert(eventsToInsert)
      .select('id');

    if (insertError) {
      console.error('[Events API] Failed to insert events:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to store events: ' + insertError.message },
        { status: 500 }
      );
    }

    console.log(`[Events API] Successfully stored ${insertedEvents?.length || 0} events`);

    return NextResponse.json({
      success: true,
      data: {
        processed: insertedEvents?.length || 0,
        eventIds: insertedEvents?.map(event => event.id) || [],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[Events API] Error processing events:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}