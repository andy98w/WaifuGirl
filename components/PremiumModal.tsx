import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iapManager } from '../utils/inAppPurchase';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

export default function PremiumModal({ visible, onClose, onPurchaseSuccess }: PremiumModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const success = await iapManager.purchasePremiumLevels();
      if (success) {
        onPurchaseSuccess();
        onClose();
        Alert.alert(
          'Purchase Successful!',
          'Premium levels have been unlocked. Enjoy the additional content!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Purchase Failed',
          'Unable to complete the purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        'Purchase Error',
        'Something went wrong. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await iapManager.restorePurchases();
      if (result.hasPremium) {
        onPurchaseSuccess();
        onClose();
        Alert.alert(
          'Purchases Restored!',
          'Your premium levels have been restored.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const price = iapManager.getProductPrice(iapManager.getProducts()[0]?.productId);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-open" size={48} color="#9C27B0" />
            </View>
            
            <Text style={styles.title}>Premium Levels</Text>
            <Text style={styles.subtitle}>
              Unlock levels 13-20 with even more challenging puzzles!
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>8 additional levels</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Higher difficulty puzzles</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>More beautiful artwork</Text>
              </View>
            </View>

            <Pressable
              style={[styles.purchaseButton, isPurchasing && styles.buttonDisabled]}
              onPress={handlePurchase}
              disabled={isPurchasing || isRestoring}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.purchaseButtonText}>
                    Unlock Premium Levels
                  </Text>
                  <Text style={styles.priceText}>{price}</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={[styles.restoreButton, isRestoring && styles.buttonDisabled]}
              onPress={handleRestore}
              disabled={isPurchasing || isRestoring}
            >
              {isRestoring ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 0,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  restoreButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#666',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});