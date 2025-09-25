import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experimentId = searchParams.get('experimentId');

    if (!experimentId) {
      return NextResponse.json(
        { error: 'Experiment ID is required' },
        { status: 400 }
      );
    }

    const { data: experimentArms, error } = await supabaseAdmin
      .from('experiment_arms')
      .select(`
        *,
        sku_variants (
          id,
          app_store_product_id,
          price_cents,
          quantity,
          currency,
          platform,
          virtual_items (
            id,
            name,
            type,
            subtype
          )
        )
      `)
      .eq('experiment_id', experimentId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch experiment arms: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ experimentArms });
  } catch (error) {
    console.error('Experiment arms fetch error:', error);
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
      experimentId,
      skuVariantId,
      name,
      trafficWeight = 0,
      isControl = false,
      metadata = {}
    } = body;

    if (!experimentId || !skuVariantId || !name) {
      return NextResponse.json(
        { error: 'Experiment ID, SKU variant ID, and name are required' },
        { status: 400 }
      );
    }

    // Verify experiment exists
    const { data: experiment } = await supabaseAdmin
      .from('experiments')
      .select('id, virtual_item_id')
      .eq('id', experimentId)
      .single();

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    // Verify SKU variant exists and belongs to the same virtual item
    const { data: skuVariant } = await supabaseAdmin
      .from('sku_variants')
      .select('id, virtual_item_id')
      .eq('id', skuVariantId)
      .eq('virtual_item_id', experiment.virtual_item_id)
      .single();

    if (!skuVariant) {
      return NextResponse.json(
        { error: 'SKU variant not found or does not belong to the experiment\'s virtual item' },
        { status: 404 }
      );
    }

    // Check if setting as control and there's already a control arm
    if (isControl) {
      const { data: existingControl } = await supabaseAdmin
        .from('experiment_arms')
        .select('id')
        .eq('experiment_id', experimentId)
        .eq('is_control', true)
        .maybeSingle();

      if (existingControl) {
        return NextResponse.json(
          { error: 'Experiment already has a control arm' },
          { status: 400 }
        );
      }
    }

    // Check that total traffic weight won't exceed 100%
    const { data: existingArms } = await supabaseAdmin
      .from('experiment_arms')
      .select('traffic_weight')
      .eq('experiment_id', experimentId);

    const currentTotalWeight = existingArms?.reduce((sum, arm) => sum + arm.traffic_weight, 0) || 0;
    if (currentTotalWeight + trafficWeight > 100) {
      return NextResponse.json(
        { error: 'Total traffic weight would exceed 100%' },
        { status: 400 }
      );
    }

    const { data: experimentArm, error } = await supabaseAdmin
      .from('experiment_arms')
      .insert({
        experiment_id: experimentId,
        sku_variant_id: skuVariantId,
        name,
        traffic_weight: trafficWeight,
        is_control: isControl,
        metadata
      })
      .select(`
        *,
        sku_variants (
          id,
          app_store_product_id,
          price_cents,
          quantity,
          currency,
          platform,
          virtual_items (
            id,
            name,
            type,
            subtype
          )
        )
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create experiment arm: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      experimentArm
    });
  } catch (error) {
    console.error('Experiment arm creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}