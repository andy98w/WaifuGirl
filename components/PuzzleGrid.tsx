import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, Share } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle, 
  runOnJS 
} from 'react-native-reanimated';
import ImagePuzzlePiece from './ImagePuzzlePiece';
import { 
  PuzzleState, 
  PuzzlePiece as PuzzlePieceType,
  rotatePiece,
  swapPieces,
  movePiece,
  checkWinCondition,
  getPieceAtPosition
} from '../utils/puzzleLogic';

const { width: screenWidth } = Dimensions.get('window');
const GRID_MARGIN = 10;
const GRID_PADDING = 10;

interface PuzzleGridProps {
  puzzleState: PuzzleState;
  onPuzzleUpdate: (newState: PuzzleState) => void;
  onWin: () => void;
  imageSource: any;
  gameState: 'playing' | 'completed';
  onNextLevel: () => void;
  onPlayAgain: () => void;
  hasNextLevel: boolean;
  levelId?: number;
}

export default function PuzzleGrid({ puzzleState, onPuzzleUpdate, onWin, imageSource, gameState, onNextLevel, onPlayAgain, hasNextLevel, levelId }: PuzzleGridProps) {
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // Reset win animation when gameState changes to playing
  React.useEffect(() => {
    if (gameState === 'playing') {
      setShowWinAnimation(false);
      puzzleOpacity.value = 1;
      imageOpacity.value = 0;
      imageScale.value = 1.1;
    }
  }, [gameState]);

  const gridRows = puzzleState.gridRows;
  const gridCols = puzzleState.gridCols;
  const pieceSize = Math.min(
    (screenWidth - GRID_MARGIN * 2 - GRID_PADDING * 2) / gridCols,
    (screenWidth * 1.2) / gridRows // Increased from 0.8 to 1.2 for larger puzzles
  );

  // Animation values for win sequence
  const puzzleOpacity = useSharedValue(1);
  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(1.1);

  const handleRotate = useCallback((pieceId: number) => {
    const pieceIndex = puzzleState.pieces.findIndex(p => p.id === pieceId);
    if (pieceIndex !== -1) {
      const newPieces = [...puzzleState.pieces];
      newPieces[pieceIndex] = rotatePiece(newPieces[pieceIndex]);
      
      const newState = {
        ...puzzleState,
        pieces: newPieces,
        moves: puzzleState.moves + 1,
        isComplete: checkWinCondition(newPieces)
      };
      
      onPuzzleUpdate(newState);
      
      if (newState.isComplete) {
        startWinAnimation();
      }
    }
  }, [puzzleState, onPuzzleUpdate, onWin]);

  const handleTap = useCallback((pieceId: number) => {
    if (selectedPieceId === null) {
      setSelectedPieceId(pieceId);
    } else if (selectedPieceId === pieceId) {
      setSelectedPieceId(null);
    } else {
      // Swap the two selected pieces
      const newPieces = swapPieces(puzzleState.pieces, selectedPieceId, pieceId);
      
      const newState = {
        ...puzzleState,
        pieces: newPieces,
        moves: puzzleState.moves + 1,
        isComplete: checkWinCondition(newPieces)
      };
      
      onPuzzleUpdate(newState);
      
      if (newState.isComplete) {
        startWinAnimation();
      }
      
      setSelectedPieceId(null);
    }
  }, [selectedPieceId, puzzleState, onPuzzleUpdate]);

  const startWinAnimation = () => {
    setShowWinAnimation(true);
    
    // Fade out puzzle pieces and fade in complete image
    puzzleOpacity.value = withTiming(0, { duration: 800 });
    imageOpacity.value = withTiming(1, { duration: 1000 });
    imageScale.value = withTiming(1, { duration: 1000 });
    
    // Call onWin after animation completes
    setTimeout(() => {
      runOnJS(onWin)();
    }, 1200);
  };

  const handleShare = async () => {
    try {
      // Try to share with image if possible
      const shareOptions = {
        message: `I just completed Level ${levelId || ''} in Waifu Girl puzzle game in ${puzzleState.moves} moves! 🧩✨`,
        url: imageSource, // This will include the image if the platform supports it
      };
      
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to text-only sharing if image sharing fails
      try {
        await Share.share({
          message: `I just completed Level ${levelId || ''} in Waifu Girl puzzle game in ${puzzleState.moves} moves! 🧩✨`,
        });
      } catch (fallbackError) {
        console.error('Fallback sharing also failed:', fallbackError);
      }
    }
  };

  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const piece = getPieceAtPosition(puzzleState.pieces, row, col);
        
        if (piece) {
          grid.push(
            <View
              key={`${row}-${col}`}
              style={[
                styles.pieceContainer,
                {
                  left: col * pieceSize,
                  top: row * pieceSize,
                  width: pieceSize,
                  height: pieceSize,
                }
              ]}
            >
              <ImagePuzzlePiece
                piece={piece}
                size={pieceSize - 1} // Very small gap between pieces
                imageSource={imageSource}
                onRotate={handleRotate}
                onTap={handleTap}
                isSelected={selectedPieceId === piece.id}
                gridRows={gridRows}
                gridCols={gridCols}
              />
            </View>
          );
        }
      }
    }
    
    return grid;
  };

  const puzzleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: puzzleOpacity.value,
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.movesText}>Moves: {puzzleState.moves}</Text>
      </View>
      
      <View style={styles.gridContainer}>
        <View 
          style={[
            styles.grid, 
            {
              width: gridCols * pieceSize,
              height: gridRows * pieceSize,
            }
          ]}
        >
          <Animated.View style={[styles.puzzleLayer, puzzleAnimatedStyle]}>
            {renderGrid()}
          </Animated.View>
          
          {showWinAnimation && (
            <Animated.View style={[styles.imageLayer, imageAnimatedStyle]}>
              <Image
                source={imageSource}
                style={[
                  styles.completeImage,
                  {
                    width: gridCols * pieceSize,
                    height: gridRows * pieceSize,
                  }
                ]}
                contentFit="cover"
              />
            </Animated.View>
          )}
        </View>
      </View>
      
      {gameState === 'completed' && (
        <View style={styles.completionButtons}>
          <Pressable style={styles.button} onPress={onPlayAgain}>
            <Ionicons name="refresh" size={32} color="#ffffff" />
          </Pressable>
          <Pressable style={styles.button} onPress={handleShare}>
            <Ionicons name="share" size={32} color="#ffffff" />
          </Pressable>
          {hasNextLevel && (
            <Pressable style={styles.button} onPress={onNextLevel}>
              <Ionicons name="arrow-forward" size={32} color="#ffffff" />
            </Pressable>
          )}
        </View>
      )}
      
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#1a1a1a',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  movesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sizeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  grid: {
    position: 'relative',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: GRID_PADDING,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  pieceContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    alignItems: 'center',
  },
  puzzleLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  imageLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  completeImage: {
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  completionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 30,
    paddingHorizontal: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});