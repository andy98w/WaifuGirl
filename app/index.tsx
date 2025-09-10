import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, StatusBar, Pressable, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PuzzleGrid from '@/components/PuzzleGrid';
import MusicPlayer from '@/components/MusicPlayer';
import HomeScreen from '@/components/HomeScreen';
import TestModeView from '@/components/TestModeView';
import { 
  createPuzzle, 
  PuzzleState,
  getDifficultyGridSize,
  getLevelGridDimensions
} from '@/utils/puzzleLogic';
import { MusicTrack } from '@/utils/musicManager';
import { Level, levels } from '@/utils/levels';


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
  const [currentScreen, setCurrentScreen] = useState<'home' | 'puzzle'>('home');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [puzzleState, setPuzzleState] = useState<PuzzleState | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [levelData, setLevelData] = useState(levels);
  const [isTestMode, setIsTestMode] = useState(false);

  // Initialize puzzle when a level is selected
  useEffect(() => {
    if (selectedLevel && !isTestMode) {
      initializePuzzle();
    } else if (selectedLevel && isTestMode) {
      // In test mode, show completed state
      setGameState('completed');
      setPuzzleState(null); // Don't show puzzle pieces in test mode
    }
  }, [selectedLevel, isTestMode]);

  const initializePuzzle = () => {
    if (!selectedLevel) return;
    
    const { rows, cols } = getLevelGridDimensions(selectedLevel.id);
    
    // Create a simple color grid for the puzzle logic (colors won't be used for display)
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
  };

  const handlePuzzleUpdate = (newState: PuzzleState) => {
    setPuzzleState(newState);
  };

  const handleWin = () => {
    if (!selectedLevel || !puzzleState) return;
    
    setGameState('completed');
    
    // Update level completion data
    const updatedLevels = levelData.map(level => {
      if (level.id === selectedLevel.id) {
        const newBestMoves = level.bestMoves ? Math.min(level.bestMoves, puzzleState.moves) : puzzleState.moves;
        return {
          ...level,
          completed: true,
          bestMoves: newBestMoves
        };
      }
      return level;
    });
    
    setLevelData(updatedLevels);
  };

  const handleLevelSelect = (level: Level, testMode = false) => {
    setSelectedLevel(level);
    setIsTestMode(testMode);
    setCurrentScreen('puzzle');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedLevel(null);
    setPuzzleState(null);
    setGameState('playing');
    setIsTestMode(false);
  };

  const handleNextLevel = () => {
    if (!selectedLevel) return;
    
    const nextLevel = levelData.find(level => level.id === selectedLevel.id + 1);
    if (nextLevel) {
      setSelectedLevel(nextLevel);
      setGameState('playing');
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
        <HomeScreen onLevelSelect={handleLevelSelect} levels={levelData} />
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBackToHome}>
              <Ionicons name="arrow-back" size={28} color="#ffffff" />
            </Pressable>
          </View>
          
          {isTestMode && selectedLevel ? (
            <TestModeView
              imageSource={selectedLevel.image}
              levelId={selectedLevel.id}
            />
          ) : puzzleState && selectedLevel && (
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
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
  loading: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});