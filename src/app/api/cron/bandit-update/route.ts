import { NextRequest, NextResponse } from 'next/server';
import { BanditService } from '@/lib/bandit/bandit-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authToken = searchParams.get('token');
    
    if (!authToken || authToken !== process.env.CRON_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const banditService = new BanditService();
    const results = await banditService.updateAllRunningExperiments();

    const totalExperiments = Object.keys(results).length;
    const successfulUpdates = Object.values(results).filter(updates => updates.length > 0).length;
    const failedUpdates = totalExperiments - successfulUpdates;

    console.log(`Bandit cron job completed: ${successfulUpdates}/${totalExperiments} experiments updated successfully`);

    return NextResponse.json({
      success: true,
      message: 'Bandit traffic weights updated',
      totalExperiments,
      successfulUpdates,
      failedUpdates,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bandit cron job error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}