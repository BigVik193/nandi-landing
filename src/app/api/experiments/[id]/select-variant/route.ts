import { NextRequest, NextResponse } from 'next/server';
import { BanditService } from '@/lib/bandit/bandit-service';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const experimentId = params.id;
    const body = await request.json();
    const { userId } = body;

    const banditService = new BanditService();
    const selectedArmId = await banditService.selectVariantForUser(experimentId, userId);

    if (!selectedArmId) {
      return NextResponse.json(
        { error: 'No variant could be selected for this experiment' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      experimentId,
      selectedArmId,
      userId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Variant selection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const banditService = new BanditService();
    const selectedArmId = await banditService.selectVariantForUser(experimentId, userId || undefined);

    if (!selectedArmId) {
      return NextResponse.json(
        { error: 'No variant could be selected for this experiment' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      experimentId,
      selectedArmId,
      userId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Variant selection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}