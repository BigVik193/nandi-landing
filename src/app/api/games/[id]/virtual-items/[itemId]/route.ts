import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: gameId, itemId } = await params;
    const body = await request.json();
    
    const {
      itemId: newItemId,
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

    if (!gameId || !itemId) {
      return NextResponse.json(
        { error: 'Game ID and Item ID are required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Virtual item name is required' },
        { status: 400 }
      );
    }

    // Validate newItemId format if provided
    if (newItemId && !/^[a-z0-9_]+$/.test(newItemId)) {
      return NextResponse.json(
        { error: 'Item ID must contain only lowercase letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Verify that the virtual item exists and belongs to the game
    const { data: existingItem } = await supabaseAdmin
      .from('virtual_items')
      .select('id, game_id, item_id')
      .eq('id', itemId)
      .eq('game_id', gameId)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Virtual item not found or does not belong to this game' },
        { status: 404 }
      );
    }

    // If changing itemId, check for uniqueness
    if (newItemId && newItemId !== existingItem.item_id) {
      const { data: duplicateCheck } = await supabaseAdmin
        .from('virtual_items')
        .select('id')
        .eq('game_id', gameId)
        .eq('item_id', newItemId)
        .maybeSingle();

      if (duplicateCheck) {
        return NextResponse.json(
          { error: 'An item with this ID already exists in this game' },
          { status: 400 }
        );
      }
    }

    // Update the virtual item
    const updateData: any = {
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
      updated_at: new Date().toISOString()
    };

    // Only update item_id if a new one was provided
    if (newItemId) {
      updateData.item_id = newItemId;
    }

    const { data: virtualItem, error: updateError } = await supabaseAdmin
      .from('virtual_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('game_id', gameId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update virtual item: ' + updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      virtualItem
    });
  } catch (error) {
    console.error('Virtual item update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: gameId, itemId } = await params;

    if (!gameId || !itemId) {
      return NextResponse.json(
        { error: 'Game ID and Item ID are required' },
        { status: 400 }
      );
    }

    // Verify that the virtual item exists and belongs to the game
    const { data: existingItem } = await supabaseAdmin
      .from('virtual_items')
      .select('id, game_id')
      .eq('id', itemId)
      .eq('game_id', gameId)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Virtual item not found or does not belong to this game' },
        { status: 404 }
      );
    }

    // Delete the virtual item
    const { error: deleteError } = await supabaseAdmin
      .from('virtual_items')
      .delete()
      .eq('id', itemId)
      .eq('game_id', gameId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete virtual item: ' + deleteError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Virtual item delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}