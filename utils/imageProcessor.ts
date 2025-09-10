import { Image } from 'expo-image';

export interface ImagePuzzle {
  name: string;
  description: string;
  imageSource: any;
  colors?: string[][];
}

// For now, we'll use your actual image with placeholder colors
// In a real implementation, you could analyze the image to extract dominant colors
export const puzzleImages: ImagePuzzle[] = [
  {
    name: "Waifu Image",
    description: "Your custom puzzle image",
    imageSource: require('../assets/images/1.jpg'),
    // Generate a color grid based on typical anime/waifu color patterns
    colors: generateColorGridForImage()
  }
];

function generateColorGridForImage(): string[][] {
  // This creates a diverse color palette that would work well for a waifu/anime image
  // You can customize these colors based on your specific image
  return [
    ["#FFB6C1", "#FFC0CB", "#FFE4E1"], // Light pinks
    ["#DDA0DD", "#DA70D6", "#BA55D3"], // Purple tones
    ["#87CEEB", "#ADD8E6", "#B0E0E6"], // Light blues
    ["#F5DEB3", "#F0E68C", "#FFFFE0"], // Light yellows/creams
    ["#DEB887", "#D2B48C", "#BC8F8F"], // Skin tones
    ["#8FBC8F", "#98FB98", "#90EE90"], // Light greens
    ["#FFE4B5", "#FFDAB9", "#PEACHPUFF"], // Peach tones
    ["#E6E6FA", "#F0F8FF", "#F8F8FF"], // Very light colors
    ["#696969", "#778899", "#708090"]  // Darker accents
  ];
}