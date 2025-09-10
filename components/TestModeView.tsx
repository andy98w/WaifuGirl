import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const { width: screenWidth } = Dimensions.get('window');

interface TestModeViewProps {
  imageSource: any;
  levelId: number;
}

export default function TestModeView({ imageSource, levelId }: TestModeViewProps) {
  const imageSize = Math.min(screenWidth * 0.9, 400);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Level {levelId} - Test Mode</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize * 1.2, // Maintain portrait aspect ratio
            }
          ]}
          contentFit="cover"
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>This is how the completed puzzle looks</Text>
      </View>
    </View>
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
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});