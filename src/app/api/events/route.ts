import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Store events in Supabase database
    // For now, just log them
    console.log(`[Events API] Received ${batch.events.length} events:`, {
      batchTimestamp: batch.timestamp,
      events: batch.events.map(event => ({
        playerId: event.playerId,
        eventType: event.eventType,
        timestamp: event.timestamp,
        properties: event.properties
      }))
    });

    return NextResponse.json({
      success: true,
      data: {
        processed: batch.events.length,
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