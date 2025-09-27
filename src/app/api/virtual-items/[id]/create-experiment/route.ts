import { NextRequest, NextResponse } from 'next/server';
import { createExperimentForVirtualItem } from '@/lib/ai/auto-experiment-creator';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: virtualItemId } = await params;

    if (!virtualItemId) {
      return NextResponse.json(
        { error: 'Virtual item ID is required' },
        { status: 400 }
      );
    }

    console.log(`[AI Experiment API] Creating experiment for virtual item: ${virtualItemId}`);

    const result = await createExperimentForVirtualItem(virtualItemId);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          success: false 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'AI experiment created successfully',
      experimentId: result.experimentId,
      hypothesis: result.hypothesis,
      skuVariantsCreated: result.skuVariantsCreated,
      nextSteps: [
        'Experiment is now running with AI-generated hypothesis',
        'SKU variants have been created with Apple-compliant pricing',
        'Bandit algorithm will optimize traffic allocation based on performance',
        `View experiment results in the dashboard`,
        'AI will continue monitoring and can suggest optimizations'
      ]
    });

  } catch (error) {
    console.error('[AI Experiment API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}