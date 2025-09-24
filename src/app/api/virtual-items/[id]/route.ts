import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { data: virtualItem, error } = await supabaseAdmin
      .from('virtual_items')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !virtualItem) {
      return NextResponse.json(
        { error: 'Virtual item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ virtualItem });
  } catch (error) {
    console.error('Virtual item fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
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
      metadata,
      status
    } = body;

    const { data: virtualItem, error } = await supabaseAdmin
      .from('virtual_items')
      .update({
        name,
        description: description || null,
        type,
        subtype: subtype || null,
        price_tier: priceTier || null,
        min_price_cents: minPriceCents || null,
        max_price_cents: maxPriceCents || null,
        category: category || null,
        tags: tags || null,
        metadata: metadata || {},
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update virtual item: ' + error.message },
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { error } = await supabaseAdmin
      .from('virtual_items')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete virtual item: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Virtual item deleted successfully'
    });
  } catch (error) {
    console.error('Virtual item deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}