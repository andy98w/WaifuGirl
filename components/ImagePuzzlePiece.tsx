import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { PuzzlePiece as PuzzlePieceType } from '../utils/puzzleLogic';

interface ImagePuzzlePieceProps {
  piece: PuzzlePieceType;
  size: number;
  imageSource: any;
  onRotate: (pieceId: number) => void;
  onTap: (pieceId: number) => void;
  isSelected: boolean;
  gridRows: number;
  gridCols: number;
}

export default function ImagePuzzlePiece({
  piece,
  size,
  imageSource,
  onRotate,
  onTap,
  isSelected,
  gridRows,
  gridCols
}: ImagePuzzlePieceProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const visualRotation = useSharedValue(piece.rotation);
  const totalRotations = React.useRef(piece.rotation / 90);
  const currentPieceId = React.useRef(piece.id);
  const lastLogicalRotation = React.useRef(piece.rotation);

  // Handle piece changes and rotations
  React.useEffect(() => {
    if (currentPieceId.current !== piece.id) {
      // New piece (after swap) - sync visual rotation immediately without animation
      console.log(`🔄 Piece swap: ${currentPieceId.current} -> ${piece.id}, rotation: ${piece.rotation}`);
      visualRotation.value = piece.rotation;
      totalRotations.current = piece.rotation / 90;
      currentPieceId.current = piece.id;
      lastLogicalRotation.current = piece.rotation;
    } else if (currentPieceId.current === piece.id && piece.rotation !== lastLogicalRotation.current) {
      // Same piece, rotation changed (user rotated) - animate the change
      const rotationDiff = piece.rotation - lastLogicalRotation.current;
      console.log(`🔄 Piece ${piece.id} rotated: ${lastLogicalRotation.current} -> ${piece.rotation} (diff: ${rotationDiff})`);
      
      // Handle wrap-around from 270 to 0
      if (rotationDiff === -270) {
        totalRotations.current += 1;
      } else {
        totalRotations.current += rotationDiff / 90;
      }
      
      visualRotation.value = withSpring(totalRotations.current * 90, {
        damping: 15,
        stiffness: 200,
      });
      lastLogicalRotation.current = piece.rotation;
    }
  }, [piece.id, piece.rotation]);

  // Add selection animation when piece is selected
  React.useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.05, { damping: 15 });
      opacity.value = withTiming(0.9, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isSelected]);

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      // Single tap selects the piece for swapping - no tap feedback animation
      runOnJS(onTap)(piece.id);
    });

  const lastRotationTime = React.useRef(0);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const now = Date.now();
      const timeSinceLastRotation = now - lastRotationTime.current;
      
      // Only allow rotation if enough time has passed (500ms cooldown)
      if (timeSinceLastRotation >= 500) {
        lastRotationTime.current = now;
        runOnJS(onRotate)(piece.id);
      }
    });

  const combinedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${visualRotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Calculate the portion of the image this piece should show
  const pieceWidth = size;
  const pieceHeight = size;
  const imageWidth = gridCols * size;
  const imageHeight = gridRows * size;

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        style={[
          styles.piece,
          {
            width: pieceWidth,
            height: pieceHeight,
          },
          isSelected && styles.selected,
          animatedStyle,
        ]}
      >
        <View style={[styles.imageContainer, { width: pieceWidth, height: pieceHeight }]}>
          <Image
            source={imageSource}
            style={[
              styles.image,
              {
                width: imageWidth,
                height: imageHeight,
                left: -piece.correctCol * pieceWidth,
                top: -piece.correctRow * pieceHeight,
              }
            ]}
            contentFit="cover"
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  piece: {
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 0,
    overflow: 'hidden',
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
  imageContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    position: 'absolute',
  },
});