import { NextRequest, NextResponse } from 'next/server';
import { GooglePlayStoreAPI } from '@/lib/integrations/google-play';
import { getGooglePlayCredentials, updateCredentialValidation } from '@/lib/store-credentials';

interface ValidationRequest {
  gameId: string;
}

interface ValidationResult {
  platform: 'google_play' | 'app_store';
  hasAccess: boolean;
  validatedAt?: Date;
  message?: string;
  error?: string;
  troubleshooting?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();
    const { gameId } = body;
    console.log('🧪 Validating credentials for game ID:', gameId);

    if (!gameId) {
      return NextResponse.json({
        success: false,
        error: 'Game ID is required',
      }, { status: 400 });
    }

    console.log(`🧪 Validating credentials for game ID: ${gameId}`);
    const validations: ValidationResult[] = [];

    // Get Google Play credentials from database
    const googlePlayCreds = await getGooglePlayCredentials(gameId);
    
    if (googlePlayCreds) {
      try {
        console.log(`🧪 Testing Google Play access for: ${googlePlayCreds.packageName}`);
        console.log(`🔑 Using service account from database`);

        const googlePlayAPI = new GooglePlayStoreAPI({
          serviceAccountKey: googlePlayCreds.serviceAccountKey,
          packageName: googlePlayCreds.packageName,
        });

        // Try to list products to validate access
        const result = await googlePlayAPI.listProducts();
        
        if (result.success) {
          validations.push({
            platform: 'google_play',
            hasAccess: true,
            validatedAt: new Date(),
            message: `Successfully connected to Google Play Console. Found ${result.data?.length || 0} existing products.`,
          });
          
          // Update credential validation status
          await updateCredentialValidation(googlePlayCreds.credentialId, 'valid');
          console.log(`✅ Google Play validation successful for ${googlePlayCreds.packageName}`);
        } else {
          validations.push({
            platform: 'google_play',
            hasAccess: false,
            error: result.error || 'Cannot access Google Play API',
            troubleshooting: [
              'Ensure the service account has "Google Play Android Developer API" enabled',
              'Verify the service account has the correct permissions',
              'Check that the package name matches your app in Play Console',
              'Make sure the service account key is not expired',
              'Wait a few minutes for permissions to propagate'
            ]
          });
          
          // Update credential validation status
          await updateCredentialValidation(googlePlayCreds.credentialId, 'invalid', result.error);
          console.log(`❌ Google Play validation failed for ${googlePlayCreds.packageName}: ${result.error}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        validations.push({
          platform: 'google_play',
          hasAccess: false,
          error: `Service account error: ${errorMessage}`,
          troubleshooting: [
            'Check that the service account JSON is valid',
            'Ensure the service account has the necessary permissions',
            'Verify that the Google Play Android Developer API is enabled',
            'Make sure the package name is correct'
          ]
        });
        
        await updateCredentialValidation(googlePlayCreds.credentialId, 'invalid', errorMessage);
        console.log(`💥 Google Play validation error for ${googlePlayCreds.packageName}:`, error);
      }
    } else {
      validations.push({
        platform: 'google_play',
        hasAccess: false,
        error: 'No Google Play credentials found for this game',
        troubleshooting: [
          'Upload Google Play service account credentials first',
          'Make sure the service account JSON is valid'
        ]
      });
    }

    // TODO: App Store validation would go here
    // For now, we only validate Google Play

    const hasAnyAccess = validations.some(v => v.hasAccess);

    return NextResponse.json({
      success: true,
      data: {
        validations,
        hasAccess: hasAnyAccess,
        summary: {
          total: validations.length,
          successful: validations.filter(v => v.hasAccess).length,
          failed: validations.filter(v => !v.hasAccess).length,
        }
      }
    });

  } catch (error) {
    console.error('Service account validation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}