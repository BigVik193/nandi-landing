import { useEffect, useState } from 'react';
import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  acknowledgePurchaseAndroid,
} from 'react-native-iap';

const useIAP = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Product SKUs that we want to fetch
  const productSkus = [
    'gold_pack_100',
    'gold_pack_500',
    'gold_pack_1000',
    'premium_subscription',
  ];

  useEffect(() => {
    initializeIAP();
    return () => {
      endConnection();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      setLoading(true);
      
      // Initialize connection
      const connected = await initConnection();
      setConnected(connected);
      
      if (connected) {
        // Get available products
        await fetchProducts();
        
        // Setup purchase listeners
        setupPurchaseListeners();
      }
    } catch (error) {
      console.error('IAP initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const availableProducts = await getProducts({ skus: productSkus });
      console.log('Available products:', availableProducts);
      setProducts(availableProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const setupPurchaseListeners = () => {
    // Purchase success listener
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log('Purchase successful:', purchase);
      
      try {
        // Acknowledge the purchase (required for Android)
        if (purchase.purchaseToken) {
          await acknowledgePurchaseAndroid(purchase.purchaseToken);
        }
        
        // Finish the transaction
        await finishTransaction({ purchase });
        
        // Handle successful purchase
        handleSuccessfulPurchase(purchase);
        
      } catch (ackErr) {
        console.warn('Error acknowledging purchase:', ackErr);
      }
    });

    // Purchase error listener
    const purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.error('Purchase failed:', error);
      handlePurchaseError(error);
    });

    // Store subscriptions for cleanup
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  };

  const buyProduct = async (productId) => {
    try {
      setLoading(true);
      console.log('Attempting to purchase:', productId);
      
      // Request purchase
      await requestPurchase({ skus: [productId] });
      
    } catch (error) {
      console.error('Purchase request failed:', error);
      setLoading(false);
    }
  };

  const handleSuccessfulPurchase = (purchase) => {
    setLoading(false);
    console.log('Purchase completed successfully:', purchase.productId);
    
    // Here you would typically:
    // 1. Validate the purchase with your server
    // 2. Grant the user the purchased items
    // 3. Update local state
    
    // For now, just show success
    alert(`Purchase successful! You bought: ${purchase.productId}`);
  };

  const handlePurchaseError = (error) => {
    setLoading(false);
    
    if (error.code === 'E_USER_CANCELLED') {
      console.log('User cancelled purchase');
    } else {
      console.error('Purchase error:', error);
      alert(`Purchase failed: ${error.message}`);
    }
  };

  return {
    products,
    loading,
    connected,
    buyProduct,
    refreshProducts: fetchProducts,
  };
};

export default useIAP;