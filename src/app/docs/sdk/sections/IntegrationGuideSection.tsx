import { CodeBlock } from '../components/CodeBlock';

export function IntegrationGuideSection() {
  return (
    <section id="integration-guide" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">Integration Guide</h2>

      <div id="store-integration" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Complete Store Integration</h3>
        <p className="text-gray-600 mb-4">
          Here's a complete example of integrating Nandi SDK with your in-game store:
        </p>
        <CodeBlock
          language="javascript"
          code={`import NandiSDK from '@nandi/sdk';

class GameStore {
  constructor() {
    this.nandi = new NandiSDK({
      apiKey: process.env.NANDI_API_KEY,
      gameId: process.env.NANDI_GAME_ID,
      debug: true
    });
  }

  async initialize(playerId) {
    // Initialize SDK with player
    await this.nandi.initialize(playerId, {
      level: this.getPlayerLevel(),
      vip: this.isVIPPlayer(),
      totalSpent: this.getPlayerLifetimeValue()
    });
  }

  async loadStoreItems() {
    // Track store view
    await this.nandi.trackStoreView({
      source: 'main_menu',
      items_count: this.items.length
    });

    // Get optimized variants for each item
    const variants = [];
    for (const item of this.items) {
      const variant = await this.nandi.getItemVariant(item.id);
      variants.push({
        ...item,
        variant
      });

      // Track item view
      await this.nandi.trackItemView(item.id, {
        position: variants.length,
        experimentId: variant.experimentId
      });
    }

    return variants;
  }

  async purchaseItem(variant) {
    try {
      // Track purchase start
      await this.nandi.trackPurchaseStart(variant);

      // Platform-specific purchase flow
      const transaction = await this.processPlatformPurchase(
        variant.variant.productId
      );

      // Track successful purchase
      await this.nandi.trackPurchaseComplete(
        variant, 
        transaction.id,
        {
          receipt: transaction.receipt,
          verified: await this.verifyReceipt(transaction)
        }
      );

      // Grant items to player
      this.grantItems(variant.variant.quantity);

      return { success: true, transaction };

    } catch (error) {
      // Track failed purchase
      await this.nandi.trackPurchaseFail(
        variant,
        error.message,
        {
          error_code: error.code,
          step: this.getPurchaseStep(error)
        }
      );

      return { success: false, error };
    }
  }

  async processPlatformPurchase(productId) {
    // Platform-specific implementation
    if (this.platform === 'ios') {
      return await this.processStoreKitPurchase(productId);
    } else if (this.platform === 'android') {
      return await this.processPlayBillingPurchase(productId);
    }
  }
}`}
          id="complete-integration"
        />
      </div>

      <div id="ios-storekit" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">iOS StoreKit Integration</h3>
        <p className="text-gray-600 mb-4">
          For iOS games using StoreKit 2:
        </p>
        <CodeBlock
          language="swift"
          code={`import StoreKit
import NandiSDK

class StoreManager {
    func purchaseItem(variant: ItemVariant) async {
        // Use the product ID from Nandi
        let productId = variant.variant.productId
        
        do {
            // StoreKit 2 purchase
            let result = try await Product.purchase(productId)
            
            switch result {
            case .success(let verification):
                // Track successful purchase
                await NandiSDK.trackPurchaseComplete(
                    variant: variant,
                    transactionId: verification.id,
                    properties: ["verified": true]
                )
                
            case .userCancelled:
                // Track cancellation
                await NandiSDK.trackPurchaseFail(
                    variant: variant,
                    error: "USER_CANCELLED"
                )
                
            case .pending:
                // Handle pending transaction
                break
            }
        } catch {
            // Track error
            await NandiSDK.trackPurchaseFail(
                variant: variant,
                error: error.localizedDescription
            )
        }
    }
}`}
        />
      </div>

      <div id="android-billing" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Android Play Billing Integration</h3>
        <p className="text-gray-600 mb-4">
          For Android games using Play Billing Library:
        </p>
        <CodeBlock
          language="kotlin"
          code={`import com.android.billingclient.api.*
import com.nandi.sdk.NandiSDK

class BillingManager : PurchasesUpdatedListener {
    private lateinit var billingClient: BillingClient
    private var currentVariant: ItemVariant? = null

    fun purchaseItem(variant: ItemVariant) {
        currentVariant = variant
        
        // Track purchase start
        NandiSDK.trackPurchaseStart(variant)
        
        // Use the product ID from Nandi
        val productDetails = ProductDetails.newBuilder()
            .setProductId(variant.variant.productId)
            .build()
            
        val flowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(listOf(productDetails))
            .build()
            
        val billingResult = billingClient.launchBillingFlow(activity, flowParams)
        
        if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
            // Track error
            NandiSDK.trackPurchaseFail(
                variant,
                "BILLING_ERROR_\${billingResult.responseCode}"
            )
        }
    }
    
    override fun onPurchasesUpdated(
        billingResult: BillingResult,
        purchases: List<Purchase>?
    ) {
        when (billingResult.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                purchases?.forEach { purchase ->
                    // Track successful purchase
                    currentVariant?.let { variant ->
                        NandiSDK.trackPurchaseComplete(
                            variant,
                            purchase.purchaseToken,
                            mapOf("orderId" to purchase.orderId)
                        )
                    }
                    
                    // Acknowledge purchase
                    acknowledgePurchase(purchase)
                }
            }
            
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                // Track cancellation
                currentVariant?.let { variant ->
                    NandiSDK.trackPurchaseFail(variant, "USER_CANCELLED")
                }
            }
            
            else -> {
                // Track other errors
                currentVariant?.let { variant ->
                    NandiSDK.trackPurchaseFail(
                        variant,
                        "BILLING_ERROR_\${billingResult.responseCode}"
                    )
                }
            }
        }
    }
}`}
        />
      </div>

      <div id="unity-iap" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Unity IAP Integration</h3>
        <p className="text-gray-600 mb-4">
          For Unity games using Unity IAP:
        </p>
        <CodeBlock
          language="csharp"
          code={`using UnityEngine;
using UnityEngine.Purchasing;
using Nandi;

public class UnityStoreManager : IStoreListener
{
    private IStoreController storeController;
    private NandiSDK nandi;
    private ItemVariant currentVariant;

    void Start()
    {
        nandi = new NandiSDK(apiKey, gameId);
        InitializePurchasing();
    }

    public async void PurchaseItem(string itemId)
    {
        // Get optimized variant from Nandi
        currentVariant = await nandi.GetItemVariant(itemId);
        
        // Track purchase start
        await nandi.TrackPurchaseStart(currentVariant);
        
        // Initiate Unity IAP purchase
        Product product = storeController.products.WithID(
            currentVariant.variant.productId
        );
        
        if (product != null && product.availableToPurchase)
        {
            storeController.InitiatePurchase(product);
        }
        else
        {
            await nandi.TrackPurchaseFail(
                currentVariant, 
                "Product not available"
            );
        }
    }

    public PurchaseProcessingResult ProcessPurchase(PurchaseEventArgs args)
    {
        // Track successful purchase
        nandi.TrackPurchaseComplete(
            currentVariant,
            args.purchasedProduct.transactionID,
            new Dictionary<string, object> {
                { "receipt", args.purchasedProduct.receipt }
            }
        );
        
        // Grant items to player
        GrantItems(currentVariant.variant.quantity);
        
        return PurchaseProcessingResult.Complete;
    }

    public void OnPurchaseFailed(Product product, PurchaseFailureReason reason)
    {
        // Track failed purchase
        nandi.TrackPurchaseFail(
            currentVariant,
            reason.ToString()
        );
    }
}`}
        />
      </div>
    </section>
  );
}