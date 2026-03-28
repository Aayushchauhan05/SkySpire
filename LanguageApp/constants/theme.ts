/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#6366F1'; // Indigo 500
const tintColorDark = '#818CF8'; // Indigo 400

export const Colors = {
  light: {
    text: '#110E1A',
    background: '#F0EEF8',
    tint: '#9B8AF4',
    icon: '#8E88B0',
    tabIconDefault: '#8E88B0',
    tabIconSelected: '#9B8AF4',
    primary: '#FF8A66', // Warm Coral
    secondary: '#9B8AF4', // Soft Purple
    accent: '#FFB800',
    card: '#FFFFFF',
    border: '#E5E7EB',
  },
  dark: {
    text: '#F0EEF8', // Pale Purple White
    background: '#110E1A', // Deep Purple Black
    tint: '#FF8A66', // Warm Coral
    icon: '#8E88B0', // Muted Purple
    tabIconDefault: '#8E88B0',
    tabIconSelected: '#FF8A66',
    primary: '#FF8A66', // Warm Coral
    secondary: '#9B8AF4', // Soft Purple
    accent: '#FFB800', // Warm Amber
    card: '#1C1830', // Deep Purple
    elevated: '#252040', // Medium Purple
    border: '#252040',
    error: '#FF5C7A', // Coral Pink
    secondaryText: '#8E88B0',
  },
};

export const Fonts = {
  primary: 'Plus Jakarta Sans',
  reading: 'Lora',
  arabic: 'Noto Naskh Arabic',
};
