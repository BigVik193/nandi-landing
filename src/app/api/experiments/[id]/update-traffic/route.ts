import { NextRequest, NextResponse } from 'next/server';
import { BanditService } from '@/lib/bandit/bandit-service';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const experimentId = params.id;

    const banditService = new BanditService();
    const updates = await banditService.updateTrafficWeights(experimentId);

    return NextResponse.json({
      experimentId,
      updates,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Traffic update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const experimentId = params.id;

    const banditService = new BanditService();
    
    const shouldStop = await banditService.shouldStopExperiment(experimentId);
    const experiments = await banditService.getRunningExperiments();
    const experiment = experiments.find(exp => exp.id === experimentId);

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found or not running' },
        { status: 404 }
      );
    }

    const metrics = await banditService.getArmMetrics(experimentId);

    return NextResponse.json({
      experimentId,
      currentTrafficWeights: experiment.arms.map(arm => ({
        armId: arm.id,
        name: arm.name,
        trafficWeight: arm.trafficWeight,
        isControl: arm.isControl
      })),
      metrics: metrics.map(metric => {
        const arm = experiment.arms.find(a => a.id === metric.armId);
        return {
          ...metric,
          armName: arm?.name || 'Unknown',
          conversionRate: metric.storeViews > 0 ? (metric.purchases / metric.storeViews) * 100 : 0
        };
      }),
      shouldStopExperiment: shouldStop,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Traffic status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}