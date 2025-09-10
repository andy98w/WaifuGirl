import { Platform } from 'react-native';

// Conditionally import IAP only if available
let IAP: any = null;
try {
  IAP = require('react-native-iap');
} catch (error) {
  console.log('react-native-iap not available - running in Expo Go or development mode');
}

export const PRODUCT_IDS = {
  PREMIUM_LEVELS: 'com.andyw98.waifugirl.premium_levels',
};

class InAppPurchaseManager {
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;
  private products: any[] = [];
  private isInitialized: boolean = false;
  private purchaseCallback: ((success: boolean, productId?: string) => void) | null = null;
  private isDevelopment: boolean = !IAP;

  async initialize() {
    try {
      if (this.isDevelopment) {
        console.log('Running in development mode - IAP simulated');
        this.isInitialized = true;
        return;
      }

      if (Platform.OS !== 'ios') {
        console.log('IAP is only supported on iOS');
        return;
      }

      const connectionResult = await IAP.initConnection();
      console.log('IAP Connection initialized:', connectionResult);
      
      const productIds = [
        PRODUCT_IDS.PREMIUM_LEVELS,
      ];
      
      console.log('Fetching products:', productIds);
      this.products = await IAP.getProducts({ skus: productIds });
      console.log('Products fetched:', this.products.map(p => ({
        productId: p.productId,
        price: p.localizedPrice,
        title: p.title,
        description: p.description
      })));
      
      // Keep for IAP debugging
      if (__DEV__) {
        console.log('=== SANDBOX IAP DEBUG ===');
        console.log('Products available:', this.products.length);
        this.products.forEach(p => {
          console.log(`- ${p.productId}: ${p.localizedPrice}`);
        });
        console.log('========================');
      }
      
      if (this.products.length === 0) {
        console.warn('No products available from App Store. Check product IDs and App Store Connect configuration.');
      }
      
      this.purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase: any) => {
        await this.handlePurchaseUpdate(purchase);
      });

      this.purchaseErrorSubscription = IAP.purchaseErrorListener((error: any) => {
        this.handlePurchaseError(error);
      });
      
      await this.restorePurchases();
      
      this.isInitialized = true;
      console.log('IAP Manager initialized successfully');
      
    } catch (error: any) {
      console.error('Failed to initialize IAP:', error);
      console.error('Error details:', error.message, error.code);
      this.isInitialized = false;
      // Don't throw error to allow app to continue without IAP
    }
  }

  async cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
  }

  async purchasePremiumLevels(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        if (this.isDevelopment) {
          // Simulate purchase in development
          console.log('Development mode: Simulating premium purchase');
          setTimeout(() => {
            console.log('Development mode: Purchase simulated as successful');
            resolve(true);
          }, 1000);
          return;
        }

        if (Platform.OS !== 'ios') {
          throw new Error('Purchases are only available on iOS devices');
        }
        
        if (!this.isInitialized) {
          await this.initialize();
          if (!this.isInitialized) {
            throw new Error('App Store connection failed. Please check your internet connection and try again.');
          }
        }
        
        const product = this.products.find(p => p.productId === PRODUCT_IDS.PREMIUM_LEVELS);
        if (!product) {
          throw new Error('Premium levels not available in App Store');
        }
        
        this.purchaseCallback = (success, productId) => {
          if (productId === PRODUCT_IDS.PREMIUM_LEVELS) {
            resolve(success);
            this.purchaseCallback = null;
          }
        };
        
        console.log('Requesting purchase for:', PRODUCT_IDS.PREMIUM_LEVELS);
        await IAP.requestPurchase({
          sku: PRODUCT_IDS.PREMIUM_LEVELS,
          andDangerouslyFinishTransactionAutomaticallyIOS: false,
        });
        
      } catch (error: any) {
        console.error('Premium levels purchase failed:', error);
        console.error('Error code:', error.code, 'Message:', error.message);
        
        if (error.code === 'E_USER_CANCELLED') {
          console.log('User cancelled the purchase');
        }
        
        resolve(false);
        this.purchaseCallback = null;
      }
    });
  }

  private async handlePurchaseUpdate(purchase: any) {
    try {
      console.log('Purchase update received:', purchase.productId, purchase.transactionId);
      
      const receipt = purchase.transactionReceipt;
      if (!receipt) {
        throw new Error('No receipt found');
      }
      
      console.log('Finishing transaction for:', purchase.productId);
      await IAP.finishTransaction({
        purchase,
        isConsumable: false,
      });
      
      if (Platform.OS === 'ios') {
        await IAP.clearTransactionIOS();
      }
      
      console.log('Purchase completed successfully:', purchase.productId);
      
      if (this.purchaseCallback) {
        this.purchaseCallback(true, purchase.productId);
      }
      
    } catch (error: any) {
      console.error('Error processing purchase:', error);
      console.error('Error details:', error.message);
      
      if (this.purchaseCallback) {
        this.purchaseCallback(false, purchase.productId);
      }
    }
  }

  private handlePurchaseError(error: any) {
    console.error('Purchase error:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    if (this.purchaseCallback) {
      this.purchaseCallback(false);
      this.purchaseCallback = null;
    }
  }
  
  async restorePurchases() {
    try {
      if (this.isDevelopment) {
        console.log('Development mode: No purchases to restore');
        return { hasPremium: false, purchases: [] };
      }

      if (Platform.OS !== 'ios') {
        return { hasPremium: false, purchases: [] };
      }
      
      console.log('Restoring purchases...');
      const purchases = await IAP.getAvailablePurchases();
      console.log('Restored purchases:', purchases.map(p => p.productId));
      
      // Check if user has purchased premium levels
      const hasPremium = purchases.some(p => p.productId === PRODUCT_IDS.PREMIUM_LEVELS);
      return { hasPremium, purchases };
    } catch (error: any) {
      console.error('Failed to restore purchases:', error);
      return { hasPremium: false, purchases: [] };
    }
  }

  getProductPrice(productId?: string): string {
    if (!productId) return '$0.99';
    const product = this.products.find(p => p.productId === productId);
    return product?.localizedPrice || '$0.99';
  }

  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
  
  getProducts(): any[] {
    return this.products;
  }
  
  isAvailable(): boolean {
    return (this.isDevelopment || Platform.OS === 'ios') && this.isInitialized;
  }
}

export const iapManager = new InAppPurchaseManager();