import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Text, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Level } from '../utils/levels';

const { width: screenWidth } = Dimensions.get('window');
const COLUMNS = 4;
const CARD_MARGIN = 8;
const CARD_SIZE = (screenWidth - (CARD_MARGIN * (COLUMNS + 1))) / COLUMNS;

interface HomeScreenProps {
  onLevelSelect: (level: Level, testMode?: boolean) => void;
  levels: Level[];
}

export default function HomeScreen({ onLevelSelect, levels }: HomeScreenProps) {
  const [testMode, setTestMode] = useState(false);

  const handleLevelPress = (level: Level) => {
    onLevelSelect(level, testMode);
  };

  const renderLevel = ({ item }: { item: Level }) => (
    <Pressable
      style={({ pressed }) => [
        styles.levelCard,
        pressed && styles.levelCardPressed,
        !item.unlocked && styles.levelCardLocked
      ]}
      onPress={() => item.unlocked && handleLevelPress(item)}
      disabled={!item.unlocked}
    >
      {item.completed ? (
        <Text style={styles.checkmark}>✓</Text>
      ) : (
        <Text style={styles.levelNumber}>{item.id}</Text>
      )}
      {item.completed && item.bestMoves && (
        <View style={styles.recordBadge}>
          <Text style={styles.recordText}>R:{item.bestMoves}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waifu Girl</Text>
        <Pressable 
          style={[styles.testModeButton, testMode && styles.testModeActive]} 
          onPress={() => setTestMode(!testMode)}
        >
          <Ionicons 
            name={testMode ? "eye" : "eye-off"} 
            size={24} 
            color={testMode ? "#4CAF50" : "#666"} 
          />
          <Text style={[styles.testModeText, testMode && styles.testModeTextActive]}>
            Test Mode
          </Text>
        </Pressable>
      </View>
      
      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={(item) => item.id.toString()}
        numColumns={COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    color: '#4CAF50',
    fontSize: 48,
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
  testModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  testModeActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  testModeText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  testModeTextActive: {
    color: '#4CAF50',
  },
});