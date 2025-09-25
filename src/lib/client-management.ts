/**
 * Client App Management for Nandi-Managed Accounts
 * Handles client app registration and permission validation
 */

export interface ClientApp {
  id: string;
  clientId: string;
  appName: string;
  
  // Store identifiers
  googlePlay?: {
    packageName: string;
    hasAccess: boolean;
    grantedAt?: Date;
    lastValidated?: Date;
  };
  
  appStore?: {
    bundleId: string;
    hasAccess: boolean;
    grantedAt?: Date;
    lastValidated?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionGrantRequest {
  clientId: string;
  appName: string;
  googlePlayPackageName?: string;
  appStoreBundleId?: string;
}

export class ClientAppManager {
  /**
   * Register a new client app
   */
  async registerClientApp(request: PermissionGrantRequest): Promise<ClientApp> {
    const app: ClientApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId: request.clientId,
      appName: request.appName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add Google Play if provided
    if (request.googlePlayPackageName) {
      app.googlePlay = {
        packageName: request.googlePlayPackageName,
        hasAccess: false, // Will be validated after permission grant
      };
    }

    // Add App Store if provided  
    if (request.appStoreBundleId) {
      app.appStore = {
        bundleId: request.appStoreBundleId,
        hasAccess: false, // Will be validated after permission grant
      };
    }

    // Save to database
    // await saveClientAppToDatabase(app);

    return app;
  }

  /**
   * Generate permission grant instructions for Google Play
   */
  generateGooglePlayInstructions(packageName: string): PermissionInstructions {
    return {
      platform: 'google_play',
      steps: [
        {
          step: 1,
          title: "Open Google Play Console",
          description: "Go to Google Play Console and select your app",
          url: "https://play.google.com/console",
        },
        {
          step: 2,
          title: "Navigate to API Access",
          description: "Go to Setup → API Access",
          screenshot: "/instructions/google-play-api-access.png",
        },
        {
          step: 3,
          title: "Grant Access to Nandi",
          description: "Find 'Nandi AI Service Account' and grant these permissions:",
          permissions: [
            "View app information and download bulk reports (read-only)",
            "Manage orders and subscriptions",
            "Manage store presence"
          ],
          serviceAccountEmail: "nandi-ai@nandi-master.iam.gserviceaccount.com",
        },
        {
          step: 4,
          title: "Verify Connection",
          description: "Return to Nandi and click 'Verify Connection'",
          callToAction: true,
        }
      ],
      estimatedTime: "2-3 minutes",
    };
  }

  /**
   * Generate permission grant instructions for App Store
   */
  generateAppStoreInstructions(bundleId: string): PermissionInstructions {
    return {
      platform: 'app_store',
      steps: [
        {
          step: 1,
          title: "Open App Store Connect",
          description: "Go to App Store Connect and select your app",
          url: "https://appstoreconnect.apple.com",
        },
        {
          step: 2,
          title: "Navigate to Users and Access",
          description: "Go to Users and Access → API Keys",
          screenshot: "/instructions/app-store-users-access.png",
        },
        {
          step: 3,
          title: "Grant Access to Nandi",
          description: "Add Nandi AI as a user with these permissions:",
          permissions: [
            "App Manager",
            "Marketing", 
            "Developer"
          ],
          nandiAppleId: "nandi-ai@trynandi.com",
        },
        {
          step: 4,
          title: "Verify Connection", 
          description: "Return to Nandi and click 'Verify Connection'",
          callToAction: true,
        }
      ],
      estimatedTime: "3-4 minutes",
    };
  }

  /**
   * Validate that Nandi has access to client's Google Play app
   */
  async validateGooglePlayAccess(packageName: string): Promise<ValidationResult> {
    try {
      // Check if we have the required environment variables
      if (!process.env.NANDI_GOOGLE_PLAY_SERVICE_ACCOUNT) {
        return {
          hasAccess: false,
          error: "Google Play credentials not configured. Add NANDI_GOOGLE_PLAY_SERVICE_ACCOUNT environment variable.",
          troubleshooting: [
            "Create service account in Google Cloud Console",
            "Download JSON key file",
            "Set NANDI_GOOGLE_PLAY_SERVICE_ACCOUNT in .env.local",
            "Grant permissions in Google Play Console API access"
          ]
        };
      }

      // Use Nandi's master credentials to try accessing the app
      const googlePlayAPI = new GooglePlayStoreAPI({
        serviceAccountKey: process.env.NANDI_GOOGLE_PLAY_SERVICE_ACCOUNT!,
        packageName: packageName,
      });

      // Try to list products (this will fail if no access)
      const result = await googlePlayAPI.listProducts();
      
      if (result.success) {
        return {
          hasAccess: true,
          validatedAt: new Date(),
          message: "Successfully connected to Google Play Console",
        };
      } else {
        return {
          hasAccess: false,
          error: "Cannot access app. Please ensure Nandi service account has permissions.",
          troubleshooting: [
            "Verify the package name is correct",
            "Check that Nandi service account is granted permissions",
            "Wait 5-10 minutes for permissions to propagate"
          ]
        };
      }
    } catch (error) {
      return {
        hasAccess: false,
        error: error instanceof Error ? error.message : "Unknown validation error",
      };
    }
  }

  /**
   * Validate that Nandi has access to client's App Store app
   */
  async validateAppStoreAccess(bundleId: string): Promise<ValidationResult> {
    try {
      // Check if we have the required environment variables
      if (!process.env.NANDI_APP_STORE_KEY_ID || !process.env.NANDI_APP_STORE_ISSUER_ID || !process.env.NANDI_APP_STORE_PRIVATE_KEY) {
        return {
          hasAccess: false,
          error: "App Store credentials not configured. Add NANDI_APP_STORE_* environment variables.",
          troubleshooting: [
            "Set NANDI_APP_STORE_KEY_ID in .env.local",
            "Set NANDI_APP_STORE_ISSUER_ID in .env.local", 
            "Set NANDI_APP_STORE_PRIVATE_KEY in .env.local"
          ]
        };
      }

      // Use Nandi's master credentials to try accessing the app
      const appStoreAPI = new AppStoreAPI({
        keyId: process.env.NANDI_APP_STORE_KEY_ID!,
        issuerId: process.env.NANDI_APP_STORE_ISSUER_ID!,
        privateKey: process.env.NANDI_APP_STORE_PRIVATE_KEY!,
        bundleId: bundleId,
      });

      // Try to list products (this will fail if no access)
      const result = await appStoreAPI.listProducts();
      
      if (result.success) {
        return {
          hasAccess: true,
          validatedAt: new Date(),
          message: "Successfully connected to App Store Connect",
        };
      } else {
        return {
          hasAccess: false,
          error: "Cannot access app. Please ensure Nandi has App Store Connect permissions.",
          troubleshooting: [
            "Verify the bundle ID is correct",
            "Check that Nandi is added as a user with proper permissions", 
            "Wait 10-15 minutes for permissions to propagate"
          ]
        };
      }
    } catch (error) {
      return {
        hasAccess: false,
        error: error instanceof Error ? error.message : "Unknown validation error",
      };
    }
  }

  /**
   * Update app access status after validation
   */
  async updateAppAccess(appId: string, platform: 'google_play' | 'app_store', hasAccess: boolean): Promise<void> {
    // Update database with validation results
    // await updateClientAppAccess(appId, platform, hasAccess, new Date());
  }
}

export interface PermissionInstructions {
  platform: 'google_play' | 'app_store';
  steps: InstructionStep[];
  estimatedTime: string;
}

export interface InstructionStep {
  step: number;
  title: string;
  description: string;
  url?: string;
  screenshot?: string;
  permissions?: string[];
  serviceAccountEmail?: string;
  nandiAppleId?: string;
  callToAction?: boolean;
}

export interface ValidationResult {
  hasAccess: boolean;
  validatedAt?: Date;
  message?: string;
  error?: string;
  troubleshooting?: string[];
}

// Import the store APIs
import { GooglePlayStoreAPI } from './integrations/google-play';
import { AppStoreAPI } from './integrations/app-store';