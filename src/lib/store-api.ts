/**
 * Nandi Store API Middleware
 * Unified interface for managing in-app products across Google Play Store and App Store
 */

export interface ProductConfig {
  // Universal fields
  id: string; // Our internal ID
  name: string;
  description: string;
  price: number; // Base price in USD
  currency: string;
  type: 'consumable' | 'non_consumable' | 'subscription' | 'bundle';
  
  // Store-specific identifiers
  googlePlaySku?: string;
  appStoreProductId?: string;
  
  // Bundle configuration
  bundleItems?: BundleItem[];
  
  // A/B testing metadata
  abTestVariant?: string;
  abTestGroup?: string;
  isActive: boolean;
  
  // Localization
  localizations?: ProductLocalization[];
  
  // Metadata
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BundleItem {
  itemType: 'gold' | 'gems' | 'powerup' | 'booster' | 'lives' | 'custom';
  quantity: number;
  customName?: string; // For custom items
}

export interface ProductLocalization {
  locale: string; // e.g., 'en-US', 'es-ES'
  name: string;
  description: string;
}

export interface StoreCredentials {
  googlePlay?: {
    serviceAccountKey: string;
    packageName: string;
  };
  appStore?: {
    keyId: string;
    issuerId: string;
    privateKey: string;
    bundleId: string;
  };
}

export type TargetStore = 'google_play' | 'app_store' | 'both';

export interface ProductCreateRequest {
  product: Omit<ProductConfig, 'id' | 'createdAt' | 'updatedAt'>;
  targetStores: TargetStore[];
  publishImmediately?: boolean;
  // For Nandi-managed accounts
  clientId?: string;
  appId?: string;
}

export interface ProductUpdateRequest {
  productId: string;
  updates: Partial<ProductConfig>;
  targetStores: TargetStore[];
}

export interface ABTestConfig {
  name: string;
  productId: string;
  variants: ABTestVariant[];
  trafficSplit: number[]; // Percentages that should add up to 100
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface ABTestVariant {
  id: string;
  name: string;
  priceMultiplier: number; // 1.0 = original price, 0.8 = 20% off, 1.2 = 20% markup
  descriptionOverride?: string;
  bundleModifications?: BundleItem[];
}

export interface StoreApiResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: StoreApiError[];
}

export interface StoreApiError {
  store: 'google_play' | 'app_store';
  code: string;
  message: string;
  details?: any;
}

/**
 * Helper function to resolve target stores
 */
export function resolveTargetStores(targetStores: TargetStore[]): ('google_play' | 'app_store')[] {
  const resolved: ('google_play' | 'app_store')[] = [];
  
  for (const store of targetStores) {
    if (store === 'both') {
      resolved.push('google_play', 'app_store');
    } else if (store === 'google_play' || store === 'app_store') {
      resolved.push(store);
    }
  }
  
  // Remove duplicates
  return [...new Set(resolved)];
}

/**
 * Main Nandi Store API Class
 */
export class NandiStoreAPI {
  private credentials: StoreCredentials;
  private baseUrl: string;

  constructor(credentials: StoreCredentials, baseUrl = '/api/store') {
    this.credentials = credentials;
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new product across specified stores
   */
  async createProduct(request: ProductCreateRequest): Promise<StoreApiResponse<ProductConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          credentials: this.credentials,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(request: ProductUpdateRequest): Promise<StoreApiResponse<ProductConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${request.productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          credentials: this.credentials,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Delete a product from specified stores
   */
  async deleteProduct(productId: string, targetStores: TargetStore[]): Promise<StoreApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetStores,
          credentials: this.credentials,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * List all products
   */
  async listProducts(): Promise<StoreApiResponse<ProductConfig[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Get a specific product
   */
  async getProduct(productId: string): Promise<StoreApiResponse<ProductConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Create an A/B test for a product
   */
  async createABTest(config: ABTestConfig): Promise<StoreApiResponse<ABTestConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/ab-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          credentials: this.credentials,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Batch create multiple products
   */
  async batchCreateProducts(products: ProductCreateRequest[]): Promise<StoreApiResponse<ProductConfig[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products,
          credentials: this.credentials,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Sync product status from stores
   */
  async syncProductStatus(productId: string): Promise<StoreApiResponse<{ googlePlay?: any; appStore?: any }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: this.credentials,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        errors: [{
          store: 'google_play',
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }
}

/**
 * Store Selection Helpers
 */
export const StoreTargets = {
  GOOGLE_PLAY_ONLY: ['google_play'] as TargetStore[],
  APP_STORE_ONLY: ['app_store'] as TargetStore[],
  BOTH_STORES: ['both'] as TargetStore[],
  // Alternative way to specify both
  CROSS_PLATFORM: ['google_play', 'app_store'] as TargetStore[],
} as const;

/**
 * Helper functions for creating common product types
 */
export const ProductTemplates = {
  goldPack: (amount: number, price: number): Omit<ProductConfig, 'id'> => ({
    name: `${amount.toLocaleString()} Gold Coins`,
    description: `Get ${amount.toLocaleString()} gold coins to enhance your gameplay!`,
    price,
    currency: 'USD',
    type: 'consumable',
    bundleItems: [{ itemType: 'gold', quantity: amount }],
    isActive: true,
    tags: ['gold', 'currency'],
  }),

  starterBundle: (price: number): Omit<ProductConfig, 'id'> => ({
    name: 'Starter Bundle',
    description: 'Perfect for new players! Get gold, gems, and power-ups.',
    price,
    currency: 'USD',
    type: 'bundle',
    bundleItems: [
      { itemType: 'gold', quantity: 1000 },
      { itemType: 'gems', quantity: 100 },
      { itemType: 'powerup', quantity: 5 },
    ],
    isActive: true,
    tags: ['bundle', 'starter', 'popular'],
  }),

  premiumSubscription: (monthlyPrice: number): Omit<ProductConfig, 'id'> => ({
    name: 'Premium Monthly',
    description: 'Unlock premium features and get daily rewards!',
    price: monthlyPrice,
    currency: 'USD',
    type: 'subscription',
    bundleItems: [
      { itemType: 'gems', quantity: 500 }, // Daily gems
    ],
    isActive: true,
    tags: ['subscription', 'premium', 'monthly'],
  }),
};