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

    const { data: experiments, error } = await supabaseAdmin
      .from('experiments')
      .select(`
        *,
        virtual_items (
          id,
          name,
          type,
          subtype
        ),
        experiment_arms (
          id,
          name,
          traffic_weight,
          is_control,
          sku_variants (
            id,
            app_store_product_id,
            price_cents,
            quantity,
            currency,
            platform
          )
        )
      `)
      .eq('game_id', gameId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch experiments: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ experiments });
  } catch (error) {
    console.error('Experiments fetch error:', error);
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
      virtualItemId,
      name,
      description,
      status = 'draft',
      trafficAllocation = 100,
      startDate,
      endDate,
      metadata = {},
      experimentArms = []
    } = body;

    if (!gameId || !virtualItemId || !name) {
      return NextResponse.json(
        { error: 'Game ID, virtual item ID, and name are required' },
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

    // Verify virtual item exists and belongs to game
    const { data: virtualItem } = await supabaseAdmin
      .from('virtual_items')
      .select('id')
      .eq('id', virtualItemId)
      .eq('game_id', gameId)
      .single();

    if (!virtualItem) {
      return NextResponse.json(
        { error: 'Virtual item not found or does not belong to this game' },
        { status: 404 }
      );
    }

    // Create experiment
    const { data: experiment, error: experimentError } = await supabaseAdmin
      .from('experiments')
      .insert({
        game_id: gameId,
        virtual_item_id: virtualItemId,
        name,
        description: description || null,
        status,
        traffic_allocation: trafficAllocation,
        start_date: startDate || null,
        end_date: endDate || null,
        metadata
      })
      .select()
      .single();

    if (experimentError) {
      return NextResponse.json(
        { error: 'Failed to create experiment: ' + experimentError.message },
        { status: 400 }
      );
    }

    // Create experiment arms if provided
    if (experimentArms.length > 0) {
      // Validate traffic weights
      const totalWeight = experimentArms.reduce((sum: number, arm: any) => sum + (arm.trafficWeight || 0), 0);
      if (totalWeight > 100) {
        return NextResponse.json(
          { error: 'Total traffic weight cannot exceed 100%' },
          { status: 400 }
        );
      }

      // Validate only one control arm
      const controlArms = experimentArms.filter((arm: any) => arm.isControl);
      if (controlArms.length > 1) {
        return NextResponse.json(
          { error: 'Only one control arm is allowed per experiment' },
          { status: 400 }
        );
      }

      // Verify SKU variants exist
      const skuVariantIds = experimentArms.map((arm: any) => arm.skuVariantId);
      const { data: skuVariants } = await supabaseAdmin
        .from('sku_variants')
        .select('id')
        .eq('virtual_item_id', virtualItemId)
        .in('id', skuVariantIds);

      if (!skuVariants || skuVariants.length !== skuVariantIds.length) {
        return NextResponse.json(
          { error: 'One or more SKU variants not found or do not belong to the virtual item' },
          { status: 404 }
        );
      }

      // Create experiment arms
      const armsData = experimentArms.map((arm: any) => ({
        experiment_id: experiment.id,
        sku_variant_id: arm.skuVariantId,
        name: arm.name,
        traffic_weight: arm.trafficWeight || 0,
        is_control: arm.isControl || false,
        metadata: arm.metadata || {}
      }));

      const { error: armsError } = await supabaseAdmin
        .from('experiment_arms')
        .insert(armsData);

      if (armsError) {
        // Rollback experiment creation
        await supabaseAdmin
          .from('experiments')
          .delete()
          .eq('id', experiment.id);

        return NextResponse.json(
          { error: 'Failed to create experiment arms: ' + armsError.message },
          { status: 400 }
        );
      }
    }

    // Return experiment with arms
    const { data: fullExperiment } = await supabaseAdmin
      .from('experiments')
      .select(`
        *,
        virtual_items (
          id,
          name,
          type,
          subtype
        ),
        experiment_arms (
          id,
          name,
          traffic_weight,
          is_control,
          sku_variants (
            id,
            app_store_product_id,
            price_cents,
            quantity,
            currency,
            platform
          )
        )
      `)
      .eq('id', experiment.id)
      .single();

    return NextResponse.json({ 
      success: true,
      experiment: fullExperiment
    });
  } catch (error) {
    console.error('Experiment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}