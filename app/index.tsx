import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Pressable, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  SlideInRight, 
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight 
} from 'react-native-reanimated';
import PuzzleGrid from '@/components/PuzzleGrid';
import MusicPlayer from '@/components/MusicPlayer';
import HomeScreen from '@/components/HomeScreen';
import PremiumModal from '@/components/PremiumModal';
import { Image } from 'expo-image';
import { 
  createPuzzle, 
  PuzzleState,
  getLevelGridDimensions
} from '@/utils/puzzleLogic';
import { MusicTrack } from '@/components/MusicPlayer';
import { Level, levels } from '@/utils/levels';
import { iapManager } from '@/utils/inAppPurchase';


const musicTracks: MusicTrack[] = [
  {
    name: "Track 1",
    file: "1.mp3",
    description: "Music track 1"
  },
  {
    name: "Track 2",
    file: "2.mp3", 
    description: "Music track 2"
  },
  {
    name: "Track 3",
    file: "3.mp3",
    description: "Music track 3"
  },
  {
    name: "Track 4",
    file: "4.mp3",
    description: "Music track 4"
  },
  {
    name: "Track 5",
    file: "5.mp3",
    description: "Music track 5"
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'puzzle' | 'loading'>('home');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [puzzleState, setPuzzleState] = useState<PuzzleState | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [levelData, setLevelData] = useState(levels);
  const [levelCompletionStates, setLevelCompletionStates] = useState<{[key: number]: {gameState: 'playing' | 'completed', puzzleState: PuzzleState | null}}>({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasPurchasedPremium, setHasPurchasedPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Development mode flag - set to false to test IAP flow in dev
  const DEV_MODE_BYPASS_IAP = __DEV__;

  // Save progress to persistent storage
  const saveProgress = async (levelDataToSave: Level[], completionStates: any) => {
    try {
      await AsyncStorage.setItem('levelProgress', JSON.stringify(levelDataToSave));
      await AsyncStorage.setItem('levelCompletionStates', JSON.stringify(completionStates));
      if (__DEV__) {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  // Load progress from persistent storage
  const loadProgress = async () => {
    try {
      const savedLevelData = await AsyncStorage.getItem('levelProgress');
      const savedCompletionStates = await AsyncStorage.getItem('levelCompletionStates');
      
      if (savedLevelData) {
        const parsedLevelData = JSON.parse(savedLevelData);
        setLevelData(parsedLevelData);
        if (__DEV__) {
          console.log('Level data loaded from storage');
        }
      }
      
      if (savedCompletionStates) {
        const parsedCompletionStates = JSON.parse(savedCompletionStates);
        setLevelCompletionStates(parsedCompletionStates);
        if (__DEV__) {
          console.log('Completion states loaded from storage');
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load progress:', error);
      }
    }
  };

  // Load progress on app start
  useEffect(() => {
    loadProgress();
  }, []);

  // Initialize IAP and restore purchases
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await iapManager.initialize();
        const result = await iapManager.restorePurchases();
        if (result.hasPremium) {
          setHasPurchasedPremium(true);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to initialize IAP:', error);
        }
      }
    };
    
    initializeIAP();
    
    return () => {
      iapManager.cleanup();
    };
  }, []);

  // Initialize puzzle when a level is selected
  useEffect(() => {
    if (selectedLevel) {
      // Check if this level has a saved completion state
      const savedState = levelCompletionStates[selectedLevel.id];
      if (savedState) {
        setGameState(savedState.gameState);
        setPuzzleState(savedState.puzzleState);
      } else {
        initializePuzzle();
      }
    }
  }, [selectedLevel]);

  const initializePuzzle = () => {
    if (!selectedLevel) return;
    initializePuzzleForLevel(selectedLevel);
  };

  const initializePuzzleForLevel = (level: Level) => {
    const { rows, cols } = getLevelGridDimensions(level.id);
    
    const colors = [];
    for (let row = 0; row < rows; row++) {
      const colorRow = [];
      for (let col = 0; col < cols; col++) {
        colorRow.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      }
      colors.push(colorRow);
    }
    
    const newPuzzle = createPuzzle(colors, rows, cols);
    setPuzzleState(newPuzzle);
    setGameState('playing');
    
    // Clear the saved completion state for this level since we're restarting
    setLevelCompletionStates(prev => {
      const newStates = { ...prev };
      delete newStates[level.id];
      return newStates;
    });
  };

  const handlePuzzleUpdate = (newState: PuzzleState) => {
    setPuzzleState(newState);
  };

  const handleWin = () => {
    if (!selectedLevel || !puzzleState) return;
    
    setGameState('completed');
    
    // Save completion state for this level
    const newCompletionStates = {
      ...levelCompletionStates,
      [selectedLevel.id]: {
        gameState: 'completed',
        puzzleState: puzzleState
      }
    };
    setLevelCompletionStates(newCompletionStates);
    
    // Check if user just completed level 12 and hasn't purchased premium
    if (selectedLevel.id === 12 && !hasPurchasedPremium && !DEV_MODE_BYPASS_IAP) {
      setTimeout(() => {
        Alert.alert(
          '🎉 Congratulations!',
          'You\'ve completed all free levels! Unlock levels 13-20 to continue your puzzle adventure with even more challenging and beautiful artwork.',
          [
            {
              text: 'Maybe Later',
              style: 'cancel'
            },
            {
              text: 'Unlock Premium Levels',
              onPress: () => setShowPremiumModal(true)
            }
          ]
        );
      }, 1500); // Show after win animation
    }
    
    // Update level completion data and unlock next level
    const updatedLevels = levelData.map(level => {
      if (level.id === selectedLevel.id) {
        const newBestMoves = level.bestMoves ? Math.min(level.bestMoves, puzzleState.moves) : puzzleState.moves;
        return {
          ...level,
          completed: true,
          bestMoves: newBestMoves
        };
      }
      // Unlock next level when current level is completed
      if (level.id === selectedLevel.id + 1) {
        return {
          ...level,
          unlocked: true
        };
      }
      return level;
    });
    
    setLevelData(updatedLevels);
    
    // Save progress to storage
    saveProgress(updatedLevels, newCompletionStates);
  };

  const handleLevelSelect = async (level: Level) => {
    // Check if level requires premium purchase (dev mode bypassed since IAP disabled)
    if (level.requiresPurchase && !hasPurchasedPremium && !DEV_MODE_BYPASS_IAP) {
      setShowPremiumModal(true);
      return;
    }
    
    setSelectedLevel(level);
    setImageLoaded(false);
    setCurrentScreen('loading');
    
    try {
      // Preload the image using Expo Image
      await Image.prefetch(level.image);
      setImageLoaded(true);
      setCurrentScreen('puzzle');
    } catch (error) {
      // If preload fails, still proceed after a short delay
      setTimeout(() => {
        setImageLoaded(true);
        setCurrentScreen('puzzle');
      }, 300);
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedLevel(null);
    setPuzzleState(null);
    setGameState('playing');
  };

  const handleNextLevel = () => {
    if (!selectedLevel) return;
    
    const nextLevel = levelData.find(level => level.id === selectedLevel.id + 1);
    if (nextLevel) {
      // Directly transition to next level
      setSelectedLevel(nextLevel);
      initializePuzzleForLevel(nextLevel);
    } else {
      // No more levels, go back to home
      handleBackToHome();
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <MusicPlayer tracks={musicTracks} />
      
      {currentScreen === 'home' ? (
        <Animated.View 
          key="home"
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.screenContainer}
        >
          <HomeScreen 
            onLevelSelect={handleLevelSelect} 
            levels={levelData} 
            hasPurchasedPremium={hasPurchasedPremium}
            onPurchaseRestored={() => setHasPurchasedPremium(true)}
          />
        </Animated.View>
      ) : currentScreen === 'loading' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <Animated.View 
          key="puzzle"
          entering={SlideInRight.duration(300)}
          exiting={SlideOutRight.duration(300)}
          style={styles.screenContainer}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Pressable style={styles.backButton} onPress={handleBackToHome}>
                <Ionicons name="arrow-back" size={28} color="#ffffff" />
              </Pressable>
            </View>
            
            {puzzleState && selectedLevel && (
              <PuzzleGrid
                puzzleState={puzzleState}
                onPuzzleUpdate={handlePuzzleUpdate}
                onWin={handleWin}
                imageSource={selectedLevel.image}
                gameState={gameState}
                onNextLevel={handleNextLevel}
                onPlayAgain={initializePuzzle}
                hasNextLevel={selectedLevel.id < levelData.length}
                levelId={selectedLevel.id}
              />
            )}
          </SafeAreaView>
        </Animated.View>
      )}
      
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchaseSuccess={() => {
          setHasPurchasedPremium(true);
          setShowPremiumModal(false);
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
});