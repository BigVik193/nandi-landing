import { ApiMethod } from '../components/ApiMethod';

export function ApiReferenceSection() {
  return (
    <section id="api-reference" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">API Reference</h2>

      <div id="initialization-api" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Initialization Methods</h3>
        
        <ApiMethod
          name="new NandiSDK(config)"
          description="Creates a new instance of the SDK."
          parameters={[
            { name: 'apiKey', type: 'string', description: 'Your Nandi API key (contains game identification)', required: true },
            { name: 'baseUrl', type: 'string', description: 'API endpoint (defaults to production - rarely needed)' },
            { name: 'debug', type: 'boolean', description: 'Enable debug logging for development' }
          ]}
          example={{
            code: `const nandi = new NandiSDK({
  apiKey: 'your_api_key'
});`
          }}
        />

        <ApiMethod
          name="initialize(playerId, metadata?)"
          description="Initializes the SDK for a specific player."
          parameters={[
            { name: 'playerId', type: 'string', description: 'Unique player identifier', required: true },
            { name: 'metadata', type: 'object', description: 'Optional player metadata' }
          ]}
          returnType={{
            type: 'Promise<void>',
            description: 'Resolves when initialization is complete'
          }}
          example={{
            code: `await nandi.initialize('player_123', {
  level: 42,
  vip: false,
  country: 'US'
});`
          }}
        />
      </div>

      <div id="variant-api" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Getting Variants</h3>
        
        <ApiMethod
          name="getItemVariant(itemIdOrName, platform?)"
          description="Retrieves the optimal variant for a virtual item."
          parameters={[
            { name: 'itemIdOrName', type: 'string', description: 'Virtual item ID or name', required: true },
            { name: 'platform', type: "'ios' | 'android' | 'both'", description: 'Target platform (auto-detected by default)' }
          ]}
          returnType={{
            type: 'Promise<ItemVariantResponse>',
            description: 'The optimal variant with pricing and experiment context',
            example: `{
  virtualItemId: string,
  experimentId: string | null,
  variant: {
    skuVariantId: string,
    productId: string,        // App/Play Store ID
    price: {
      cents: number,
      dollars: number,
      currency: string,
      formatted: string       // e.g., "$0.99"
    },
    quantity: number,
    platform: string,
    productType: string
  },
  platformSpecific: { ... }, // iOS/Android specific data
  isExperiment: boolean,
  isControl: boolean
}`
          }}
          example={{
            code: `const variant = await nandi.getItemVariant('coins_pack');
console.log(variant.variant.price.formatted); // "$0.99"
console.log(variant.variant.quantity);        // 100`
          }}
        />
      </div>

      <div id="events-api" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Event Tracking</h3>
        
        <ApiMethod
          name="logEvent(eventType, properties?)"
          description="Logs a custom event with experiment context."
          parameters={[
            { name: 'eventType', type: "'store_view' | 'item_view' | 'item_click' | 'purchase_start' | 'purchase_complete' | 'purchase_fail'", description: 'Type of event to log', required: true },
            { name: 'properties', type: 'object', description: 'Additional event properties' }
          ]}
          returnType={{
            type: 'Promise<LogEventResponse>',
            description: 'Confirmation of logged event'
          }}
          example={{
            code: `await nandi.logEvent('store_view', {
  source: 'main_menu',
  items_shown: 5
});`
          }}
        />

        <ApiMethod
          name="trackStoreView(properties?)"
          description="Convenience method for tracking store views."
          parameters={[
            { name: 'properties', type: 'object', description: 'Additional event properties' }
          ]}
          returnType={{
            type: 'void',
            description: 'Synchronous method that queues the event'
          }}
          example={{
            code: `nandi.trackStoreView({
  source: 'level_complete'
});`
          }}
        />

        <ApiMethod
          name="trackItemView(itemId, properties?)"
          description="Convenience method for tracking item views."
          parameters={[
            { name: 'itemId', type: 'string', description: 'Virtual item ID', required: true },
            { name: 'properties', type: 'object', description: 'Additional event properties' }
          ]}
          returnType={{
            type: 'void',
            description: 'Synchronous method that queues the event'
          }}
          example={{
            code: `nandi.trackItemView('coins_pack', {
  position: 1,
  category: 'currency'
});`
          }}
        />

        <ApiMethod
          name="trackItemClick(variant, properties?)"
          description="Convenience method for tracking item clicks with experiment context."
          parameters={[
            { name: 'variant', type: 'ItemVariantResponse', description: 'The variant being clicked', required: true },
            { name: 'properties', type: 'object', description: 'Additional click properties' }
          ]}
          returnType={{
            type: 'Promise<LogEventResponse>',
            description: 'Confirmation of logged event'
          }}
          example={{
            code: `await nandi.trackItemClick(variant, {
  ui_element: 'store_button',
  screen: 'main_store'
});`
          }}
        />
      </div>

      <div id="purchase-api" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Purchase Tracking</h3>
        
        <ApiMethod
          name="trackPurchaseStart(variant, properties?)"
          description="Tracks when a user initiates a purchase."
          parameters={[
            { name: 'variant', type: 'ItemVariantResponse', description: 'The variant being purchased', required: true },
            { name: 'properties', type: 'object', description: 'Additional purchase properties' }
          ]}
          example={{
            code: `await nandi.trackPurchaseStart(variant, {
  source: 'store_page',
  user_action: 'button_click'
});`
          }}
        />

        <ApiMethod
          name="trackPurchaseComplete(variant, transactionId, properties?)"
          description="Tracks successful purchases with transaction details."
          parameters={[
            { name: 'variant', type: 'ItemVariantResponse', description: 'The variant that was purchased', required: true },
            { name: 'transactionId', type: 'string', description: 'Platform transaction ID', required: true },
            { name: 'properties', type: 'object', description: 'Additional purchase properties' }
          ]}
          example={{
            code: `await nandi.trackPurchaseComplete(variant, transaction.id, {
  receipt: transaction.receipt,
  verified: true
});`
          }}
        />

        <ApiMethod
          name="trackPurchaseFail(variant, error, properties?)"
          description="Tracks failed or cancelled purchases."
          parameters={[
            { name: 'variant', type: 'ItemVariantResponse', description: 'The variant that failed to purchase', required: true },
            { name: 'error', type: 'string', description: 'Error message or reason', required: true },
            { name: 'properties', type: 'object', description: 'Additional error properties' }
          ]}
          example={{
            code: `await nandi.trackPurchaseFail(variant, error.message, {
  error_code: 'USER_CANCELLED',
  step: 'payment_authorization'
});`
          }}
        />
      </div>
    </section>
  );
}