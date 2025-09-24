import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gameId,
      name,
      description,
      type,
      subtype,
      priceTier,
      minPriceCents,
      maxPriceCents,
      category,
      tags,
      metadata = {},
      status = 'active'
    } = body;

    if (!gameId || !name || !type) {
      return NextResponse.json(
        { error: 'Game ID, name, and type are required' },
        { status: 400 }
      );
    }

    // Verify game exists
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id')
      .eq('id', gameId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    const { data: virtualItem, error } = await supabaseAdmin
      .from('virtual_items')
      .insert({
        game_id: gameId,
        name,
        description: description || null,
        type,
        subtype: subtype || null,
        price_tier: priceTier || null,
        min_price_cents: minPriceCents || null,
        max_price_cents: maxPriceCents || null,
        category: category || null,
        tags: tags || null,
        metadata,
        status
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create virtual item: ' + error.message },
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