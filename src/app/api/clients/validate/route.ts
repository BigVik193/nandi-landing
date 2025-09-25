import { NextRequest, NextResponse } from 'next/server';
import { ClientAppManager } from '@/lib/client-management';

interface ValidationRequest {
  appId: string;
  platform: 'google_play' | 'app_store';
  packageName?: string;
  bundleId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();
    const { appId, platform, packageName, bundleId } = body;

    if (!appId || !platform) {
      return NextResponse.json({
        success: false,
        error: 'App ID and platform are required',
      }, { status: 400 });
    }

    const clientManager = new ClientAppManager();
    let validationResult;

    // Validate based on platform
    if (platform === 'google_play') {
      if (!packageName) {
        return NextResponse.json({
          success: false,
          error: 'Package name is required for Google Play validation',
        }, { status: 400 });
      }
      
      validationResult = await clientManager.validateGooglePlayAccess(packageName);
    } else if (platform === 'app_store') {
      if (!bundleId) {
        return NextResponse.json({
          success: false,
          error: 'Bundle ID is required for App Store validation',
        }, { status: 400 });
      }
      
      validationResult = await clientManager.validateAppStoreAccess(bundleId);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid platform. Must be google_play or app_store',
      }, { status: 400 });
    }

    // Update app access status
    await clientManager.updateAppAccess(appId, platform, validationResult.hasAccess);

    return NextResponse.json({
      success: true,
      data: {
        platform,
        hasAccess: validationResult.hasAccess,
        validatedAt: validationResult.validatedAt,
        message: validationResult.message,
        error: validationResult.error,
        troubleshooting: validationResult.troubleshooting,
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}