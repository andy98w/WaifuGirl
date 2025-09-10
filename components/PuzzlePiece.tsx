import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { PuzzlePiece as PuzzlePieceType } from '../utils/puzzleLogic';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  size: number;
  onRotate: (pieceId: number) => void;
  onDragStart: (pieceId: number) => void;
  onDragEnd: (pieceId: number, x: number, y: number) => void;
  onTap: (pieceId: number) => void;
  isSelected: boolean;
  isDraggable: boolean;
}

export default function PuzzlePiece({
  piece,
  size,
  onRotate,
  onDragStart,
  onDragEnd,
  onTap,
  isSelected,
  isDraggable
}: PuzzlePieceProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(piece.rotation);

  // Update rotation when piece rotation changes
  React.useEffect(() => {
    rotation.value = withSpring(piece.rotation);
  }, [piece.rotation]);

  const panGesture = Gesture.Pan()
    .enabled(isDraggable)
    .onStart(() => {
      runOnJS(onDragStart)(piece.id);
      scale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const finalX = event.absoluteX;
      const finalY = event.absoluteY;
      
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      
      runOnJS(onDragEnd)(piece.id, finalX, finalY);
    });

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (!isDraggable) {
        // Single tap rotates the piece
        runOnJS(onRotate)(piece.id);
      } else {
        // In draggable mode, tap selects the piece
        runOnJS(onTap)(piece.id);
      }
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.piece,
          {
            width: size,
            height: size,
            backgroundColor: piece.color,
          },
          isSelected && styles.selected,
          animatedStyle,
        ]}
      >
        <View style={[styles.innerBorder, { backgroundColor: piece.color }]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  piece: {
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
  },
  innerBorder: {
    width: '80%',
    height: '80%',
    borderRadius: 2,
    opacity: 0.8,
  },
});