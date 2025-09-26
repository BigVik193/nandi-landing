import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Get virtual items for the specific game
    const { data: virtualItems, error } = await supabaseAdmin
      .from('virtual_items')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch virtual items: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ virtualItems });
  } catch (error) {
    console.error('Virtual items fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      name,
      description,
      type,
      subtype,
      priceTier,
      minPriceCents,
      maxPriceCents,
      category,
      tags,
      status
    } = body;

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Virtual item name is required' },
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

    // Create the virtual item
    const { data: virtualItem, error: createError } = await supabaseAdmin
      .from('virtual_items')
      .insert({
        game_id: gameId,
        name,
        description,
        type,
        subtype,
        price_tier: priceTier,
        min_price_cents: minPriceCents,
        max_price_cents: maxPriceCents,
        category,
        tags,
        status,
        metadata: {}
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create virtual item: ' + createError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      virtualItem
    });
  } catch (error) {
    console.error('Virtual item creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}