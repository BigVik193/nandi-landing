/**
 * App Store Connect API Integration
 * Handles in-app product creation and management using App Store Connect API
 */

import { sign } from 'jsonwebtoken';

export interface AppStoreCredentials {
  keyId: string;
  issuerId: string;
  privateKey: string;
  bundleId: string;
}

export interface AppStoreProduct {
  productId: string;
  bundleId: string;
  name: string;
  inAppPurchaseType: 'CONSUMABLE' | 'NON_CONSUMABLE' | 'AUTO_RENEWABLE_SUBSCRIPTION' | 'NON_RENEWING_SUBSCRIPTION';
  reviewNote?: string;
  familySharable?: boolean;
  availableInAllTerritories?: boolean;
  localizations: AppStoreLocalization[];
}

export interface AppStoreLocalization {
  locale: string;
  name: string;
  description: string;
}

export interface AppStoreApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AppStoreAPI {
  private credentials: AppStoreCredentials;
  private baseUrl = 'https://api.appstoreconnect.apple.com';

  constructor(credentials: AppStoreCredentials) {
    this.credentials = credentials;
  }

  /**
   * Generate JWT token for App Store Connect API authentication
   */
  private generateJWT(): string {
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      iss: this.credentials.issuerId,
      iat: now,
      exp: now + 1200, // 20 minutes
      aud: 'appstoreconnect-v1',
    };

    const header = {
      alg: 'ES256',
      kid: this.credentials.keyId,
      typ: 'JWT',
    };

    return sign(payload, this.credentials.privateKey, {
      algorithm: 'ES256',
      header,
    });
  }

  /**
   * Make authenticated request to App Store Connect API
   */
  private async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<AppStoreApiResult<T>> {
    try {
      const token = this.generateJWT();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorData.errors?.[0]?.detail || response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('App Store API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get app ID by bundle identifier
   */
  private async getAppId(): Promise<string | null> {
    try {
      const result = await this.makeRequest(`/v1/apps?filter[bundleId]=${this.credentials.bundleId}`);
      
      if (result.success && result.data?.data?.length > 0) {
        return result.data.data[0].id;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get app ID:', error);
      return null;
    }
  }

  /**
   * Create a new in-app purchase
   */
  async createProduct(product: AppStoreProduct): Promise<AppStoreApiResult> {
    try {
      const requestBody = {
        data: {
          type: 'inAppPurchases',
          attributes: {
            productId: product.productId,
            name: product.name,
            inAppPurchaseType: product.inAppPurchaseType,
            reviewNote: product.reviewNote || '',
            familySharable: product.familySharable || false,
            availableInAllTerritories: product.availableInAllTerritories || true,
          },
          relationships: {
            app: {
              data: {
                type: 'apps',
                id: await this.getAppId(),
              },
            },
          },
        },
      };

      const result = await this.makeRequest('/v2/inAppPurchases', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (!result.success) {
        return result;
      }

      // Create localizations for the product
      const productId = result.data?.data?.id;
      if (productId && product.localizations) {
        for (const localization of product.localizations) {
          await this.createLocalization(productId, localization);
        }
      }

      return result;
    } catch (error) {
      console.error('App Store product creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create localization for a product
   */
  async createLocalization(productId: string, localization: AppStoreLocalization): Promise<AppStoreApiResult> {
    try {
      const requestBody = {
        data: {
          type: 'inAppPurchaseLocalizations',
          attributes: {
            locale: localization.locale,
            name: localization.name,
            description: localization.description,
          },
          relationships: {
            inAppPurchaseV2: {
              data: {
                type: 'inAppPurchases',
                id: productId,
              },
            },
          },
        },
      };

      return await this.makeRequest('/v1/inAppPurchaseLocalizations', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('App Store localization creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, updates: Partial<AppStoreProduct>): Promise<AppStoreApiResult> {
    try {
      const requestBody = {
        data: {
          type: 'inAppPurchases',
          id: productId,
          attributes: {
            ...(updates.name && { name: updates.name }),
            ...(updates.reviewNote && { reviewNote: updates.reviewNote }),
            ...(updates.familySharable !== undefined && { familySharable: updates.familySharable }),
            ...(updates.availableInAllTerritories !== undefined && { availableInAllTerritories: updates.availableInAllTerritories }),
          },
        },
      };

      return await this.makeRequest(`/v2/inAppPurchases/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('App Store product update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<AppStoreApiResult> {
    try {
      return await this.makeRequest(`/v2/inAppPurchases/${productId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('App Store product deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get a specific product
   */
  async getProduct(productId: string): Promise<AppStoreApiResult> {
    try {
      return await this.makeRequest(`/v2/inAppPurchases/${productId}`);
    } catch (error) {
      console.error('App Store product retrieval failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * List all products for the app
   */
  async listProducts(): Promise<AppStoreApiResult> {
    try {
      const appId = await this.getAppId();
      if (!appId) {
        return {
          success: false,
          error: 'Could not find app ID for bundle identifier',
        };
      }

      return await this.makeRequest(`/v1/apps/${appId}/inAppPurchasesV2`);
    } catch (error) {
      console.error('App Store products listing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Submit product for review
   */
  async submitForReview(productId: string): Promise<AppStoreApiResult> {
    try {
      const requestBody = {
        data: {
          type: 'inAppPurchaseSubmissions',
          relationships: {
            inAppPurchaseV2: {
              data: {
                type: 'inAppPurchases',
                id: productId,
              },
            },
          },
        },
      };

      return await this.makeRequest('/v1/inAppPurchaseSubmissions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('App Store product submission failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Upload review screenshot for a product
   */
  async uploadReviewScreenshot(productId: string, fileName: string): Promise<AppStoreApiResult> {
    try {
      // First, create the screenshot placeholder
      const requestBody = {
        data: {
          type: 'inAppPurchaseAppStoreReviewScreenshots',
          attributes: {
            fileName: fileName,
          },
          relationships: {
            inAppPurchaseV2: {
              data: {
                type: 'inAppPurchases',
                id: productId,
              },
            },
          },
        },
      };

      return await this.makeRequest('/v1/inAppPurchaseAppStoreReviewScreenshots', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('App Store screenshot upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get product pricing information
   */
  async getProductPricing(productId: string): Promise<AppStoreApiResult> {
    try {
      return await this.makeRequest(`/v2/inAppPurchases/${productId}/relationships/pricePoints`);
    } catch (error) {
      console.error('App Store pricing retrieval failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Helper functions for common App Store operations
 */
export const AppStoreHelpers = {
  /**
   * Create common product configurations
   */
  createGoldPackProduct: (productId: string, bundleId: string, goldAmount: number): AppStoreProduct => ({
    productId,
    bundleId,
    name: `${goldAmount.toLocaleString()} Gold Coins`,
    inAppPurchaseType: 'CONSUMABLE',
    reviewNote: `In-game currency pack providing ${goldAmount.toLocaleString()} gold coins for enhanced gameplay.`,
    familySharable: false,
    availableInAllTerritories: true,
    localizations: [
      {
        locale: 'en-US',
        name: `${goldAmount.toLocaleString()} Gold Coins`,
        description: `Get ${goldAmount.toLocaleString()} gold coins to enhance your gameplay experience!`,
      },
    ],
  }),

  createPremiumUpgrade: (productId: string, bundleId: string): AppStoreProduct => ({
    productId,
    bundleId,
    name: 'Premium Upgrade',
    inAppPurchaseType: 'NON_CONSUMABLE',
    reviewNote: 'Permanent upgrade that unlocks premium features and removes advertisements.',
    familySharable: true,
    availableInAllTerritories: true,
    localizations: [
      {
        locale: 'en-US',
        name: 'Premium Upgrade',
        description: 'Unlock all premium features and enjoy an ad-free experience!',
      },
    ],
  }),

  createSubscription: (productId: string, bundleId: string, name: string, description: string): AppStoreProduct => ({
    productId,
    bundleId,
    name,
    inAppPurchaseType: 'AUTO_RENEWABLE_SUBSCRIPTION',
    reviewNote: `Auto-renewable subscription: ${description}`,
    familySharable: true,
    availableInAllTerritories: true,
    localizations: [
      {
        locale: 'en-US',
        name,
        description,
      },
    ],
  }),
};