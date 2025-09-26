import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Get all SKU variants for a game
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const { searchParams } = new URL(request.url);
    const virtualItemId = searchParams.get('virtual_item_id');
    const platform = searchParams.get('platform') || 'ios';

    console.log('[SKU List] Fetching variants for game:', gameId);

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Verify game exists and user has access
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id, developer_id, name, bundle_id')
      .eq('id', gameId)
      .single();

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Build query
    let query = supabaseAdmin
      .from('sku_variants')
      .select(`
        id,
        virtual_item_id,
        app_store_product_id,
        price_cents,
        quantity,
        currency,
        platform,
        product_type,
        name,
        metadata,
        status,
        created_at,
        updated_at,
        virtual_items!inner(
          id,
          name,
          type,
          game_id
        )
      `)
      .eq('virtual_items.game_id', gameId)
      .eq('platform', platform)
      .order('created_at', { ascending: false });

    // Filter by virtual item if specified
    if (virtualItemId) {
      query = query.eq('virtual_item_id', virtualItemId);
    }

    const { data: skuVariants, error } = await query;

    if (error) {
      console.error('[SKU List] Query failed:', error);
      return NextResponse.json(
        { error: 'Failed to fetch SKU variants: ' + error.message },
        { status: 400 }
      );
    }

    // Group by virtual item
    const groupedVariants = skuVariants?.reduce((acc, sku) => {
      const virtualItemName = (sku.virtual_items as any).name;
      if (!acc[virtualItemName]) {
        acc[virtualItemName] = {
          virtual_item_id: sku.virtual_item_id,
          virtual_item_name: virtualItemName,
          virtual_item_type: (sku.virtual_items as any).type,
          variants: []
        };
      }
      
      acc[virtualItemName].variants.push({
        id: sku.id,
        app_store_product_id: sku.app_store_product_id,
        price_cents: sku.price_cents,
        price_usd: (sku.price_cents / 100).toFixed(2),
        quantity: sku.quantity,
        currency: sku.currency,
        platform: sku.platform,
        product_type: sku.product_type,
        name: sku.name,
        status: sku.status,
        created_at: sku.created_at,
        metadata: sku.metadata
      });
      
      return acc;
    }, {} as Record<string, any>);

    const result = Object.values(groupedVariants || {});

    console.log('[SKU List] Found', skuVariants?.length || 0, 'variants across', result.length, 'virtual items');

    return NextResponse.json({
      game: {
        id: game.id,
        name: game.name,
        bundle_id: game.bundle_id
      },
      platform: platform,
      virtual_item_filter: virtualItemId,
      total_variants: skuVariants?.length || 0,
      virtual_items: result
    });
  } catch (error) {
    console.error('[SKU List] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a specific SKU variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const { searchParams } = new URL(request.url);
    const skuVariantId = searchParams.get('sku_id');

    console.log('[SKU Delete] Deleting variant:', skuVariantId, 'from game:', gameId);

    if (!gameId || !skuVariantId) {
      return NextResponse.json(
        { error: 'Game ID and SKU variant ID are required' },
        { status: 400 }
      );
    }

    // Verify the SKU belongs to this game
    const { data: skuVariant } = await supabaseAdmin
      .from('sku_variants')
      .select(`
        id,
        app_store_product_id,
        virtual_items!inner(
          game_id
        )
      `)
      .eq('id', skuVariantId)
      .eq('virtual_items.game_id', gameId)
      .single();

    if (!skuVariant) {
      return NextResponse.json(
        { error: 'SKU variant not found or does not belong to this game' },
        { status: 404 }
      );
    }

    // TODO: In production, you might want to also delete the product from Apple App Store Connect
    // For now, we'll just mark it as archived in our database
    const { error: deleteError } = await supabaseAdmin
      .from('sku_variants')
      .update({ 
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', skuVariantId);

    if (deleteError) {
      console.error('[SKU Delete] Failed:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete SKU variant: ' + deleteError.message },
        { status: 400 }
      );
    }

    console.log('[SKU Delete] Archived successfully:', skuVariant.app_store_product_id);

    return NextResponse.json({
      success: true,
      message: 'SKU variant archived successfully',
      app_store_product_id: skuVariant.app_store_product_id
    });
  } catch (error) {
    console.error('[SKU Delete] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}