import { Platform } from 'react-native';

// IAP is currently simulated - no native dependencies
const StoreKit: any = null;

export const PRODUCT_IDS = {
  PREMIUM_LEVELS: 'com.andyw98.waifugirl.premium_levels',
};

class InAppPurchaseManager {
  private products: any[] = [];
  private isInitialized: boolean = false;
  private isDevelopment: boolean = true; // Always development mode - no native IAP

  async initialize() {
    try {
      if (this.isDevelopment) {
        if (__DEV__) {
          console.log('Running in development mode - IAP simulated');
        }
        this.isInitialized = true;
        return;
      }

      if (Platform.OS !== 'ios') {
        if (__DEV__) {
          console.log('StoreKit is only supported on iOS');
        }
        return;
      }

      if (__DEV__) {
        console.log('StoreKit initializing...');
      }
      
      const productIds = [PRODUCT_IDS.PREMIUM_LEVELS];
      
      if (__DEV__) {
        console.log('Fetching products:', productIds);
      }
      
      this.products = await StoreKit.getProductsAsync(productIds);
      
      if (__DEV__) {
        console.log('Products fetched:', this.products.map(p => ({
          productId: p.productIdentifier,
          price: p.price,
          localizedPrice: p.priceLocale
        })));
      }
      
      if (this.products.length === 0 && __DEV__) {
        console.warn('No products available from App Store. Check product IDs and App Store Connect configuration.');
      }
      
      this.isInitialized = true;
      if (__DEV__) {
        console.log('StoreKit Manager initialized successfully');
      }
      
    } catch (error: any) {
      if (__DEV__) {
        console.error('Failed to initialize StoreKit:', error);
        console.error('Error details:', error.message);
      }
      this.isInitialized = false;
      // Don't throw error to allow app to continue without IAP
    }
  }

  async cleanup() {
    // StoreKit doesn't require explicit cleanup like react-native-iap
    if (__DEV__) {
      console.log('StoreKit cleanup completed');
    }
  }

  async purchasePremiumLevels(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        if (this.isDevelopment) {
          // Simulate purchase in development
          if (__DEV__) {
            console.log('Development mode: Simulating premium purchase');
          }
          setTimeout(() => {
            if (__DEV__) {
              console.log('Development mode: Purchase simulated as successful');
            }
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
        
        const product = this.products.find(p => p.productIdentifier === PRODUCT_IDS.PREMIUM_LEVELS);
        if (!product) {
          throw new Error('Premium levels not available in App Store');
        }
        
        if (__DEV__) {
          console.log('Requesting purchase for:', PRODUCT_IDS.PREMIUM_LEVELS);
        }
        
        const result = await StoreKit.purchaseItemAsync(PRODUCT_IDS.PREMIUM_LEVELS);
        
        if (__DEV__) {
          console.log('Purchase completed successfully:', result);
        }
        
        resolve(result?.responseCode === StoreKit.IAPResponseCode.OK);
        
      } catch (error: any) {
        if (__DEV__) {
          console.error('Premium levels purchase failed:', error);
          console.error('Error details:', error.message);
          
          if (error.code === 'UserCancel') {
            console.log('User cancelled the purchase');
          }
        }
        
        resolve(false);
      }
    });
  }
  
  async restorePurchases() {
    try {
      if (this.isDevelopment) {
        if (__DEV__) {
          console.log('Development mode: No purchases to restore');
        }
        return { hasPremium: false, purchases: [] };
      }

      if (Platform.OS !== 'ios') {
        return { hasPremium: false, purchases: [] };
      }
      
      if (__DEV__) {
        console.log('Restoring purchases...');
      }
      
      const purchases = await StoreKit.getReceiptAsync();
      
      if (__DEV__) {
        console.log('Restored purchases:', purchases);
      }
      
      // Check if user has purchased premium levels
      // Note: StoreKit receipt validation is more complex than this,
      // but this is a simplified version for demo purposes
      const hasPremium = purchases && purchases.length > 0;
      
      return { hasPremium, purchases: purchases || [] };
    } catch (error: any) {
      if (__DEV__) {
        console.error('Failed to restore purchases:', error);
      }
      return { hasPremium: false, purchases: [] };
    }
  }

  getProductPrice(productId?: string): string {
    if (!productId) return '$0.99';
    const product = this.products.find(p => p.productIdentifier === productId);
    return product?.price || '$0.99';
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