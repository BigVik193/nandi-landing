import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { data: experimentArm, error } = await supabaseAdmin
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
      .eq('id', params.id)
      .single();

    if (error || !experimentArm) {
      return NextResponse.json(
        { error: 'Experiment arm not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ experimentArm });
  } catch (error) {
    console.error('Experiment arm fetch error:', error);
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
      trafficWeight,
      isControl,
      metadata
    } = body;

    // Get current experiment arm to check experiment ID
    const { data: currentArm } = await supabaseAdmin
      .from('experiment_arms')
      .select('experiment_id, is_control, traffic_weight')
      .eq('id', params.id)
      .single();

    if (!currentArm) {
      return NextResponse.json(
        { error: 'Experiment arm not found' },
        { status: 404 }
      );
    }

    // Check if setting as control and there's already a different control arm
    if (isControl && !currentArm.is_control) {
      const { data: existingControl } = await supabaseAdmin
        .from('experiment_arms')
        .select('id')
        .eq('experiment_id', currentArm.experiment_id)
        .eq('is_control', true)
        .neq('id', params.id)
        .maybeSingle();

      if (existingControl) {
        return NextResponse.json(
          { error: 'Experiment already has a control arm' },
          { status: 400 }
        );
      }
    }

    // Check that total traffic weight won't exceed 100%
    if (trafficWeight !== undefined && trafficWeight !== currentArm.traffic_weight) {
      const { data: existingArms } = await supabaseAdmin
        .from('experiment_arms')
        .select('traffic_weight')
        .eq('experiment_id', currentArm.experiment_id)
        .neq('id', params.id);

      const otherArmsWeight = existingArms?.reduce((sum, arm) => sum + arm.traffic_weight, 0) || 0;
      if (otherArmsWeight + trafficWeight > 100) {
        return NextResponse.json(
          { error: 'Total traffic weight would exceed 100%' },
          { status: 400 }
        );
      }
    }

    const { data: experimentArm, error } = await supabaseAdmin
      .from('experiment_arms')
      .update({
        name,
        traffic_weight: trafficWeight,
        is_control: isControl,
        metadata: metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
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
        { error: 'Failed to update experiment arm: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      experimentArm
    });
  } catch (error) {
    console.error('Experiment arm update error:', error);
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
      .from('experiment_arms')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete experiment arm: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Experiment arm deleted successfully'
    });
  } catch (error) {
    console.error('Experiment arm deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}