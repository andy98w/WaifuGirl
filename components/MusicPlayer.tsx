import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { MusicTrack } from '../utils/musicManager';

interface MusicPlayerProps {
  tracks: MusicTrack[];
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Initialize audio
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    
    // Load first track if music is enabled
    if (tracks.length > 0 && musicEnabled) {
      loadAndPlayTrack(0);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [musicEnabled]);

  // Stop music when disabled
  useEffect(() => {
    if (!musicEnabled && soundRef.current) {
      soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  }, [musicEnabled]);

  const loadAndPlayTrack = async (index: number) => {
    if (!musicEnabled) return;
    
    
    // Stop and unload previous track
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
      }
      soundRef.current = null;
    }

    try {
      // Map track files to require statements
      let trackSource;
      switch (tracks[index].file) {
        case '1.mp3':
          trackSource = require('../assets/music/1.mp3');
          break;
        case '2.mp3':
          trackSource = require('../assets/music/2.mp3');
          break;
        case '3.mp3':
          trackSource = require('../assets/music/3.mp3');
          break;
        case '4.mp3':
          trackSource = require('../assets/music/4.mp3');
          break;
        case '5.mp3':
          trackSource = require('../assets/music/5.mp3');
          break;
        default:
          return;
      }

      const { sound } = await Audio.Sound.createAsync(
        trackSource,
        { 
          shouldPlay: true,
          isLooping: true 
        }
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (error) {
    }
  };

  const handleNextTrack = () => {
    if (!musicEnabled) return;
    
    
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    
    setCurrentTrackIndex(nextIndex);
    loadAndPlayTrack(nextIndex);
  };

  const handleLongPress = () => {
    setMusicEnabled(!musicEnabled);
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.musicButton, !musicEnabled && styles.musicButtonDisabled]}
        onPress={handleNextTrack}
        onLongPress={handleLongPress}
      >
        {musicEnabled ? (
          <Ionicons 
            name="musical-note" 
            size={24} 
            color="#ffffff" 
          />
        ) : (
          <View style={styles.disabledIconContainer}>
            <Ionicons 
              name="musical-note" 
              size={24} 
              color="#666" 
            />
            <View style={styles.slashOverlay} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    zIndex: 1000,
  },
  musicButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  musicButtonDisabled: {
    opacity: 0.5,
  },
  disabledIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slashOverlay: {
    position: 'absolute',
    width: 28,
    height: 2,
    backgroundColor: '#666',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  trackInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
    maxWidth: 150,
  },
  trackName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  trackStatus: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
});