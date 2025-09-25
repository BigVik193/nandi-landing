import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d'; // 7d, 30d, 90d, all

    // Get experiment details
    const { data: experiment, error: experimentError } = await supabaseAdmin
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

    if (experimentError || !experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    // Calculate date filter
    let dateFilter = '';
    const now = new Date();
    if (timeframe !== 'all') {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      dateFilter = `and timestamp >= '${startDate.toISOString()}'`;
    }

    // Get experiment performance data using raw SQL for better performance
    const { data: performanceData, error: performanceError } = await supabaseAdmin
      .rpc('get_experiment_performance', {
        p_experiment_id: params.id,
        p_timeframe: timeframe
      });

    if (performanceError) {
      // Fallback to individual queries if the RPC doesn't exist
      console.warn('RPC get_experiment_performance not found, using fallback queries');
      
      // Get event metrics per arm
      const { data: eventMetrics } = await supabaseAdmin
        .from('events')
        .select(`
          experiment_arm_id,
          event_type,
          count(*)
        `)
        .eq('experiment_id', params.id)
        .gte('timestamp', timeframe !== 'all' ? new Date(now.getTime() - (timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString() : '2020-01-01')
        .in('event_type', ['store_view', 'item_view', 'purchase_complete']);

      // Get purchase metrics per arm
      const { data: purchaseMetrics } = await supabaseAdmin
        .from('purchases')
        .select(`
          experiment_arm_id,
          price_cents,
          quantity,
          status
        `)
        .eq('experiment_id', params.id)
        .eq('status', 'verified')
        .gte('purchased_at', timeframe !== 'all' ? new Date(now.getTime() - (timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString() : '2020-01-01');

      // Process the data manually
      const armResults: any = {};
      
      // Initialize arm results
      experiment.experiment_arms?.forEach((arm: any) => {
        armResults[arm.id] = {
          armId: arm.id,
          armName: arm.name,
          isControl: arm.is_control,
          trafficWeight: arm.traffic_weight,
          skuVariant: arm.sku_variants,
          impressions: 0,
          views: 0,
          purchases: 0,
          revenue: 0,
          conversionRate: 0,
          averageRevenuePerUser: 0
        };
      });

      // Process event metrics
      eventMetrics?.forEach((metric: any) => {
        const armId = metric.experiment_arm_id;
        if (armResults[armId]) {
          if (metric.event_type === 'store_view') {
            armResults[armId].impressions = parseInt(metric.count);
          } else if (metric.event_type === 'item_view') {
            armResults[armId].views = parseInt(metric.count);
          } else if (metric.event_type === 'purchase_complete') {
            armResults[armId].purchases = parseInt(metric.count);
          }
        }
      });

      // Process purchase metrics
      purchaseMetrics?.forEach(purchase => {
        const armId = purchase.experiment_arm_id;
        if (armResults[armId]) {
          armResults[armId].revenue += (purchase.price_cents * purchase.quantity);
        }
      });

      // Calculate derived metrics
      Object.values(armResults).forEach((arm: any) => {
        if (arm.views > 0) {
          arm.conversionRate = (arm.purchases / arm.views) * 100;
        }
        if (arm.impressions > 0) {
          arm.averageRevenuePerUser = arm.revenue / arm.impressions;
        }
      });

      return NextResponse.json({
        experiment,
        results: Object.values(armResults),
        timeframe,
        generatedAt: now.toISOString()
      });
    }

    return NextResponse.json({
      experiment,
      results: performanceData || [],
      timeframe,
      generatedAt: now.toISOString()
    });

  } catch (error) {
    console.error('Experiment results fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}