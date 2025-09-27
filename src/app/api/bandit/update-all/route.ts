import { NextRequest, NextResponse } from 'next/server';
import { BanditService } from '@/lib/bandit/bandit-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { gameId } = body;

    const banditService = new BanditService();
    const results = await banditService.updateAllRunningExperiments(gameId);

    const totalExperiments = Object.keys(results).length;
    const successfulUpdates = Object.values(results).filter(updates => updates.length > 0).length;

    return NextResponse.json({
      success: true,
      totalExperiments,
      successfulUpdates,
      results,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bulk bandit update error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    const banditService = new BanditService();
    const experiments = await banditService.getRunningExperiments(gameId || undefined);

    const experimentSummaries = await Promise.all(
      experiments.map(async (experiment) => {
        const metrics = await banditService.getArmMetrics(experiment.id);
        const assignmentCounts = await banditService.getAssignmentCounts(experiment.id);
        const shouldStop = await banditService.shouldStopExperiment(experiment.id);
        
        return {
          experimentId: experiment.id,
          virtualItemId: experiment.virtualItemId,
          armsCount: experiment.arms.length,
          totalStoreViews: metrics.reduce((sum, m) => sum + m.storeViews, 0),
          totalPurchases: metrics.reduce((sum, m) => sum + m.purchases, 0),
          totalAssignments: Object.values(assignmentCounts).reduce((sum, count) => sum + count, 0),
          overallConversionRate: (() => {
            const totalViews = metrics.reduce((sum, m) => sum + m.storeViews, 0);
            const totalPurchases = metrics.reduce((sum, m) => sum + m.purchases, 0);
            return totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;
          })(),
          shouldStop,
          arms: experiment.arms.map(arm => {
            const metric = metrics.find(m => m.armId === arm.id);
            return {
              armId: arm.id,
              name: arm.name,
              trafficWeight: arm.trafficWeight,
              isControl: arm.isControl,
              assignments: assignmentCounts[arm.id] || 0,
              storeViews: metric?.storeViews || 0,
              purchases: metric?.purchases || 0,
              conversionRate: (metric && metric.storeViews > 0) 
                ? (metric.purchases / metric.storeViews) * 100 
                : 0
            };
          })
        };
      })
    );

    return NextResponse.json({
      experiments: experimentSummaries,
      totalRunningExperiments: experiments.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bandit status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}