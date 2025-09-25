import { NextRequest, NextResponse } from 'next/server';
import { ClientAppManager, PermissionGrantRequest } from '@/lib/client-management';

export async function POST(request: NextRequest) {
  try {
    const body: PermissionGrantRequest = await request.json();
    const { clientId, appName, googlePlayPackageName, appStoreBundleId } = body;

    // Validate input
    if (!clientId || !appName) {
      return NextResponse.json({
        success: false,
        error: 'Client ID and app name are required',
      }, { status: 400 });
    }

    if (!googlePlayPackageName && !appStoreBundleId) {
      return NextResponse.json({
        success: false,
        error: 'At least one store (Google Play or App Store) must be provided',
      }, { status: 400 });
    }

    const clientManager = new ClientAppManager();
    
    // Register the client app
    const app = await clientManager.registerClientApp(body);

    // Generate instructions for each platform
    const instructions: any = {};
    
    if (googlePlayPackageName) {
      instructions.googlePlay = clientManager.generateGooglePlayInstructions(googlePlayPackageName);
    }
    
    if (appStoreBundleId) {
      instructions.appStore = clientManager.generateAppStoreInstructions(appStoreBundleId);
    }

    return NextResponse.json({
      success: true,
      data: {
        app,
        instructions,
        nextSteps: [
          "Follow the platform-specific instructions below",
          "Grant permissions to Nandi in each store console", 
          "Return here and click 'Verify Connection' for each platform",
          "Start creating products!"
        ]
      }
    });

  } catch (error) {
    console.error('Client onboarding error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({
        success: false,
        error: 'Client ID is required',
      }, { status: 400 });
    }

    // Get client apps from database
    // const apps = await getClientAppsFromDatabase(clientId);
    
    // For now, return mock data
    const apps = [];

    return NextResponse.json({
      success: true,
      data: apps,
    });

  } catch (error) {
    console.error('Get client apps error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}