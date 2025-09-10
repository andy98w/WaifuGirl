import { Audio } from 'expo-av';

export interface MusicTrack {
  name: string;
  file: string;
  description: string;
}

export class MusicManager {
  private sound: Audio.Sound | null = null;
  private tracks: MusicTrack[] = [];
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;

  constructor(tracks: MusicTrack[]) {
    this.tracks = tracks;
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async loadTrack(index: number) {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }

    if (index >= 0 && index < this.tracks.length) {
      try {
        console.log(`Loading track: ${this.tracks[index].file}`);
        
        // Load actual audio files
        const trackPath = this.getTrackPath(this.tracks[index].file);
        console.log('Track path resolved:', trackPath);
        
        const { sound } = await Audio.Sound.createAsync(trackPath, {
          shouldPlay: false,
          isLooping: true,
        });
        this.sound = sound;
        
        this.currentTrackIndex = index;
        console.log('Track loaded successfully');
      } catch (error) {
        console.error('Failed to load track:', this.tracks[index].file, error);
        // For now, create a placeholder that won't crash
        this.currentTrackIndex = index;
      }
    }
  }

  private getTrackPath(filename: string) {
    // Map filenames to require statements
    switch (filename) {
      case '1.mp3':
        return require('../assets/music/1.mp3');
      case '2.mp3':
        return require('../assets/music/2.mp3');
      case '3.mp3':
        return require('../assets/music/3.mp3');
      case '4.mp3':
        return require('../assets/music/4.mp3');
      case '5.mp3':
        return require('../assets/music/5.mp3');
      default:
        return require('../assets/music/1.mp3');
    }
  }

  async play() {
    if (this.sound && !this.isPlaying) {
      try {
        await this.sound.playAsync();
        this.isPlaying = true;
      } catch (error) {
        console.error('Failed to play track:', error);
      }
    }
  }

  async pause() {
    if (this.sound && this.isPlaying) {
      try {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      } catch (error) {
        console.error('Failed to pause track:', error);
      }
    }
  }

  async nextTrack() {
    const nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    await this.loadTrack(nextIndex);
    if (this.isPlaying) {
      await this.play();
    }
  }

  async previousTrack() {
    const prevIndex = this.currentTrackIndex === 0 ? this.tracks.length - 1 : this.currentTrackIndex - 1;
    await this.loadTrack(prevIndex);
    if (this.isPlaying) {
      await this.play();
    }
  }

  getCurrentTrack(): MusicTrack | null {
    return this.tracks[this.currentTrackIndex] || null;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.isPlaying = false;
  }
}