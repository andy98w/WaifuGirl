export const getMusicAsset = (filename: string) => {
  switch (filename) {
    case '1.mp3': return require('../assets/music/1.mp3');
    case '2.mp3': return require('../assets/music/2.mp3');
    case '3.mp3': return require('../assets/music/3.mp3');
    case '4.mp3': return require('../assets/music/4.mp3');
    case '5.mp3': return require('../assets/music/5.mp3');
    default: return require('../assets/music/1.mp3');
  }
};