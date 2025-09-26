import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d';

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Verify game exists
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

    // Calculate date range based on timeframe
    const now = new Date();
    const startDate = new Date(now);
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get events data for analytics
    const { data: events } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('game_id', gameId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());

    // Calculate metrics from events
    const storeViews = events?.filter(e => e.event_type === 'store_view').length || 0;
    const itemViews = events?.filter(e => e.event_type === 'item_view').length || 0;
    const purchases = events?.filter(e => e.event_type === 'purchase').length || 0;
    
    // Calculate revenue from purchase events
    const revenue = events?.filter(e => e.event_type === 'purchase')
      .reduce((sum, event) => {
        return sum + (event.metadata?.revenue_cents || 0);
      }, 0) || 0;

    // Calculate conversion rate
    const conversionRate = itemViews > 0 ? (purchases / itemViews) * 100 : 0;

    // Get unique users count
    const uniqueUsers = new Set(events?.map(e => e.user_id) || []).size;

    // Calculate ARPU (Average Revenue Per User)
    const arpu = uniqueUsers > 0 ? revenue / uniqueUsers : 0;

    // Get yesterday's data for comparison
    const yesterdayStart = new Date(startDate);
    yesterdayStart.setDate(yesterdayStart.getDate() - (timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90));
    
    const { data: previousEvents } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('game_id', gameId)
      .gte('created_at', yesterdayStart.toISOString())
      .lt('created_at', startDate.toISOString());

    // Calculate previous period metrics for comparison
    const prevStoreViews = previousEvents?.filter(e => e.event_type === 'store_view').length || 0;
    const prevItemViews = previousEvents?.filter(e => e.event_type === 'item_view').length || 0;
    const prevRevenue = previousEvents?.filter(e => e.event_type === 'purchase')
      .reduce((sum, event) => sum + (event.metadata?.revenue_cents || 0), 0) || 0;

    // Calculate percentage changes
    const storeViewsChange = prevStoreViews > 0 ? ((storeViews - prevStoreViews) / prevStoreViews) * 100 : 0;
    const itemViewsChange = prevItemViews > 0 ? ((itemViews - prevItemViews) / prevItemViews) * 100 : 0;
    const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Get active experiments count
    const { data: activeExperiments } = await supabaseAdmin
      .from('experiments')
      .select('id')
      .eq('game_id', gameId)
      .eq('status', 'running');

    return NextResponse.json({
      analytics: {
        overview: {
          revenue: revenue,
          revenueChange: revenueChange,
          conversionRate: conversionRate,
          conversionRateChange: 0, // Would need historical conversion rate data
          activeUsers: uniqueUsers,
          activeUsersChange: 0, // Would need historical user data
          arpu: arpu
        },
        recentActivity: {
          storeViews: storeViews,
          storeViewsChange: storeViewsChange,
          itemViews: itemViews,
          itemViewsChange: itemViewsChange,
          activeExperiments: activeExperiments?.length || 0,
          purchases: purchases
        },
        timeframe: timeframe,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}