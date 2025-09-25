/**
 * Google Play Store API Integration
 * Handles in-app product creation and management using Google Play Developer API
 */

import { google } from 'googleapis';

export interface GooglePlayCredentials {
  serviceAccountKey: string; // JSON string of service account key
  packageName: string;
}

export interface GooglePlayProduct {
  sku: string;
  packageName: string;
  productType: 'managed' | 'subscription';
  defaultPrice: {
    priceMicros: number; // Price in micros (1 USD = 1,000,000 micros)
    currency: string;
  };
  listings: {
    [locale: string]: {
      title: string;
      description: string;
    };
  };
  status: 'active' | 'inactive';
  prices?: {
    [country: string]: {
      priceMicros: number;
      currency: string;
    };
  };
}

export interface GooglePlayApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class GooglePlayStoreAPI {
  private credentials: GooglePlayCredentials;
  private publisherApi: any;

  constructor(credentials: GooglePlayCredentials) {
    this.credentials = credentials;
    this.initializeApi();
  }

  private async initializeApi() {
    try {
      // Parse service account key
      const serviceAccount = JSON.parse(this.credentials.serviceAccountKey);
      
      // Create JWT auth
      const auth = new google.auth.JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/androidpublisher']
      );

      // Initialize Google Play Developer API
      this.publisherApi = google.androidpublisher({
        version: 'v3',
        auth: auth,
      });

      await auth.authorize();
    } catch (error) {
      console.error('Failed to initialize Google Play API:', error);
      throw new Error('Google Play API initialization failed');
    }
  }

  /**
   * Create a new in-app product
   */
  async createProduct(product: GooglePlayProduct): Promise<GooglePlayApiResult> {
    try {
      await this.ensureApiInitialized();

      const inAppProduct = {
        sku: product.sku,
        productType: product.productType,
        status: product.status,
        defaultPrice: product.defaultPrice,
        listings: product.listings,
        prices: product.prices || {},
      };

      const result = await this.publisherApi.inappproducts.insert({
        packageName: product.packageName,
        requestBody: inAppProduct,
      });

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Google Play product creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(sku: string, updates: Partial<GooglePlayProduct>): Promise<GooglePlayApiResult> {
    try {
      await this.ensureApiInitialized();

      // First get the current product
      const currentProduct = await this.publisherApi.inappproducts.get({
        packageName: this.credentials.packageName,
        sku: sku,
      });

      // Merge updates with current product
      const updatedProduct = {
        ...currentProduct.data,
        ...updates,
      };

      const result = await this.publisherApi.inappproducts.update({
        packageName: this.credentials.packageName,
        sku: sku,
        requestBody: updatedProduct,
      });

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Google Play product update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(sku: string): Promise<GooglePlayApiResult> {
    try {
      await this.ensureApiInitialized();

      await this.publisherApi.inappproducts.delete({
        packageName: this.credentials.packageName,
        sku: sku,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Google Play product deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get a specific product
   */
  async getProduct(sku: string): Promise<GooglePlayApiResult> {
    try {
      await this.ensureApiInitialized();

      const result = await this.publisherApi.inappproducts.get({
        packageName: this.credentials.packageName,
        sku: sku,
      });

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Google Play product retrieval failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * List all products for the app
   */
  async listProducts(): Promise<GooglePlayApiResult> {
    try {
      await this.ensureApiInitialized();

      const result = await this.publisherApi.inappproducts.list({
        packageName: this.credentials.packageName,
      });

      return {
        success: true,
        data: result.data.inappproduct || [],
      };
    } catch (error: any) {
      console.error('Google Play products listing failed:', error);
      
      // Extract detailed error info
      let errorMessage = 'Unknown error';
      let errorDetails: string[] = [];
      
      if (error.response?.data?.error) {
        const gError = error.response.data.error;
        errorMessage = gError.message || 'Google Play API error';
        
        if (gError.errors) {
          errorDetails = gError.errors.map((e: any) => `${e.domain}: ${e.reason} - ${e.message}`);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('📋 Error details:', { 
        status: error.status,
        code: error.code,
        message: errorMessage,
        details: errorDetails,
        packageName: this.credentials.packageName
      });
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails.length > 0 ? errorDetails : undefined
      };
    }
  }

  /**
   * Batch update multiple products
   */
  async batchUpdateProducts(updates: { sku: string; product: Partial<GooglePlayProduct> }[]): Promise<GooglePlayApiResult> {
    try {
      await this.ensureApiInitialized();

      const batchRequests = updates.map(update => ({
        sku: update.sku,
        packageName: this.credentials.packageName,
        requestBody: update.product,
      }));

      // Google Play API doesn't have native batch update, so we'll do them sequentially
      const results = [];
      for (const request of batchRequests) {
        try {
          const result = await this.publisherApi.inappproducts.update(request);
          results.push({
            sku: request.sku,
            success: true,
            data: result.data,
          });
        } catch (error) {
          results.push({
            sku: request.sku,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      console.error('Google Play batch update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Activate a product (set status to active)
   */
  async activateProduct(sku: string): Promise<GooglePlayApiResult> {
    return this.updateProduct(sku, { status: 'active' });
  }

  /**
   * Deactivate a product (set status to inactive)
   */
  async deactivateProduct(sku: string): Promise<GooglePlayApiResult> {
    return this.updateProduct(sku, { status: 'inactive' });
  }

  /**
   * Update product pricing
   */
  async updateProductPricing(sku: string, pricing: GooglePlayProduct['defaultPrice'], countryPrices?: GooglePlayProduct['prices']): Promise<GooglePlayApiResult> {
    const updates: Partial<GooglePlayProduct> = {
      defaultPrice: pricing,
    };

    if (countryPrices) {
      updates.prices = countryPrices;
    }

    return this.updateProduct(sku, updates);
  }

  private async ensureApiInitialized() {
    if (!this.publisherApi) {
      await this.initializeApi();
    }
  }
}

/**
 * Helper functions for common Google Play operations
 */
export const GooglePlayHelpers = {
  /**
   * Convert USD price to micros
   */
  usdToMicros: (usdPrice: number): number => {
    return Math.round(usdPrice * 1000000);
  },

  /**
   * Convert micros to USD
   */
  microsToUsd: (micros: number): number => {
    return micros / 1000000;
  },

  /**
   * Generate common product types
   */
  createGoldPackProduct: (sku: string, packageName: string, goldAmount: number, priceUsd: number): GooglePlayProduct => ({
    sku,
    packageName,
    productType: 'managed',
    defaultPrice: {
      priceMicros: GooglePlayHelpers.usdToMicros(priceUsd),
      currency: 'USD',
    },
    listings: {
      'en-US': {
        title: `${goldAmount.toLocaleString()} Gold Coins`,
        description: `Get ${goldAmount.toLocaleString()} gold coins to enhance your gameplay experience!`,
      },
    },
    status: 'active',
  }),

  createSubscriptionProduct: (sku: string, packageName: string, name: string, description: string, monthlyPriceUsd: number): GooglePlayProduct => ({
    sku,
    packageName,
    productType: 'subscription',
    defaultPrice: {
      priceMicros: GooglePlayHelpers.usdToMicros(monthlyPriceUsd),
      currency: 'USD',
    },
    listings: {
      'en-US': {
        title: name,
        description: description,
      },
    },
    status: 'active',
  }),
};