import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Level } from '../utils/levels';
import SettingsModal from './SettingsModal';

const { width: screenWidth } = Dimensions.get('window');
const COLUMNS = 4;
const CARD_MARGIN = 8;
const CARD_SIZE = (screenWidth - (CARD_MARGIN * (COLUMNS + 1))) / COLUMNS;

interface HomeScreenProps {
  onLevelSelect: (level: Level) => void;
  levels: Level[];
  hasPurchasedPremium: boolean;
  onPurchaseRestored?: () => void;
}

export default function HomeScreen({ onLevelSelect, levels, hasPurchasedPremium, onPurchaseRestored }: HomeScreenProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleLevelPress = (level: Level) => {
    // Only allow access to unlocked levels
    if (level.unlocked) {
      onLevelSelect(level);
    }
  };

  const renderLevel = ({ item }: { item: Level }) => {
    const isAccessible = item.unlocked && (!item.requiresPurchase || hasPurchasedPremium);
    const isPremiumLocked = item.requiresPurchase && !hasPurchasedPremium;
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.levelCard,
          pressed && styles.levelCardPressed,
          !isAccessible && styles.levelCardLocked
        ]}
        onPress={() => handleLevelPress(item)}
        disabled={!isAccessible && !isPremiumLocked}
      >
        {item.completed ? (
          <>
            <Image
              source={item.image}
              style={styles.previewImage}
              contentFit="cover"
            />
            <View style={styles.completedOverlay}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            {item.bestMoves && (
              <View style={styles.recordBadge}>
                <Text style={styles.recordText}>R:{item.bestMoves}</Text>
              </View>
            )}
          </>
        ) : isPremiumLocked ? (
          <Ionicons name="lock-closed" size={24} color="#666" />
        ) : !isAccessible ? (
          <Ionicons name="lock-closed" size={24} color="#666" />
        ) : (
          <Text style={styles.levelNumber}>{item.id}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.settingsButton} onPress={() => setShowSettings(true)}>
        <Ionicons name="settings" size={24} color="#ffffff" />
      </Pressable>
      
      <View style={styles.header}>
        <Text style={styles.title}>Waifu Girl</Text>
      </View>
      
      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={(item) => item.id.toString()}
        numColumns={COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
      />


      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onPurchaseRestored={onPurchaseRestored || (() => {})}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  grid: {
    paddingHorizontal: CARD_MARGIN / 2,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-evenly',
  },
  levelCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN / 2,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a3a3a',
  },
  levelCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  levelCardLocked: {
    opacity: 0.3,
  },
  levelNumber: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recordText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  completedOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});