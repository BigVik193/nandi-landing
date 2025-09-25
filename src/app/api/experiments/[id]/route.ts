import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { data: experiment, error } = await supabaseAdmin
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
      .eq('id', params.id)
      .single();

    if (error || !experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ experiment });
  } catch (error) {
    console.error('Experiment fetch error:', error);
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
      status,
      trafficAllocation,
      startDate,
      endDate,
      metadata
    } = body;

    const { data: experiment, error } = await supabaseAdmin
      .from('experiments')
      .update({
        name,
        description: description || null,
        status,
        traffic_allocation: trafficAllocation,
        start_date: startDate || null,
        end_date: endDate || null,
        metadata: metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
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
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update experiment: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      experiment
    });
  } catch (error) {
    console.error('Experiment update error:', error);
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
      .from('experiments')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete experiment: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Experiment deleted successfully'
    });
  } catch (error) {
    console.error('Experiment deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}