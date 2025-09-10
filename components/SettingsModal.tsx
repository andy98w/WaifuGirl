import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iapManager } from '../utils/inAppPurchase';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseRestored: () => void;
}

export default function SettingsModal({ visible, onClose, onPurchaseRestored }: SettingsModalProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const result = await iapManager.restorePurchases();
      if (result.hasPremium) {
        onPurchaseRestored();
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
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Waifu Girl',
      'App Store rating coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleTermsOfService = async () => {
    const url = 'https://andy98w.github.io/';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Unable to open Terms of Service');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Pressable
              style={[styles.option, isRestoring && styles.optionDisabled]}
              onPress={handleRestorePurchases}
              disabled={isRestoring}
            >
              {isRestoring ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="refresh" size={24} color="#ffffff" />
                  <Text style={styles.optionText}>Restore Purchases</Text>
                </>
              )}
            </Pressable>

            <Pressable style={styles.option} onPress={handleRateApp}>
              <Ionicons name="star" size={24} color="#ffffff" />
              <Text style={styles.optionText}>Rate Waifu Girl</Text>
            </Pressable>

            <Pressable style={styles.option} onPress={handleTermsOfService}>
              <Ionicons name="document-text" size={24} color="#ffffff" />
              <Text style={styles.optionText}>Terms of Service</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#3a3a3a',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    flex: 1,
  },
});