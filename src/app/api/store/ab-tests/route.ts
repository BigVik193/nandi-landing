import { NextRequest, NextResponse } from 'next/server';
import { ABTestConfig, StoreApiResponse, StoreCredentials } from '@/lib/store-api';
import { ABTestManager } from '@/lib/ab-testing/manager';

interface CreateABTestRequest extends ABTestConfig {
  credentials: StoreCredentials;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateABTestRequest = await request.json();
    const { credentials, ...abTestConfig } = body;

    // Validate A/B test configuration
    const validation = validateABTestConfig(abTestConfig);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        errors: [{
          store: 'google_play',
          code: 'VALIDATION_ERROR',
          message: validation.error,
        }],
      }, { status: 400 });
    }

    // Create A/B test using our manager
    const abTestManager = new ABTestManager(credentials);
    const result = await abTestManager.createABTest(abTestConfig);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('A/B Test API Error:', error);
    return NextResponse.json({
      success: false,
      errors: [{
        store: 'google_play',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal server error',
      }],
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const isActive = searchParams.get('isActive');

    // Get all A/B tests from database
    // const abTests = await getABTestsFromDatabase({ productId, isActive });
    
    // For now, return empty array
    const response: StoreApiResponse<ABTestConfig[]> = {
      success: true,
      data: [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('A/B Test API Error:', error);
    return NextResponse.json({
      success: false,
      errors: [{
        store: 'google_play',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal server error',
      }],
    }, { status: 500 });
  }
}

function validateABTestConfig(config: ABTestConfig): { isValid: boolean; error?: string } {
  // Check traffic split adds up to 100
  const totalTraffic = config.trafficSplit.reduce((sum, split) => sum + split, 0);
  if (Math.abs(totalTraffic - 100) > 0.1) {
    return {
      isValid: false,
      error: `Traffic split must add up to 100%, got ${totalTraffic}%`,
    };
  }

  // Check number of variants matches traffic split
  if (config.variants.length !== config.trafficSplit.length) {
    return {
      isValid: false,
      error: 'Number of variants must match number of traffic split values',
    };
  }

  // Check variant IDs are unique
  const variantIds = config.variants.map(v => v.id);
  const uniqueIds = new Set(variantIds);
  if (variantIds.length !== uniqueIds.size) {
    return {
      isValid: false,
      error: 'Variant IDs must be unique',
    };
  }

  // Check date validity
  if (config.startDate && config.endDate && config.startDate >= config.endDate) {
    return {
      isValid: false,
      error: 'End date must be after start date',
    };
  }

  return { isValid: true };
}