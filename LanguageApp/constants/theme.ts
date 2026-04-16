/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#6366F1'; // Indigo 500
const tintColorDark = '#818CF8'; // Indigo 400

export const Colors = {
  light: {
    text: '#000000',
    background: '#F5F5F5',
    tint: '#9A98FF',
    icon: '#A0A0A0',
    tabIconDefault: '#A0A0A0',
    tabIconSelected: '#9A98FF',
    primary: '#9A98FF',
    secondary: '#FF8660',
    accent: '#4FDBF0',
    highlight: '#ECFF4D',
    card: '#FFFFFF',
    border: '#E5E7EB',
    secondaryText: '#A0A0A0',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: '#9A98FF',
    icon: '#A0A0A0',
    tabIconDefault: '#A0A0A0',
    tabIconSelected: '#9A98FF',
    primary: '#9A98FF',
    secondary: '#FF8660',
    accent: '#4FDBF0',
    highlight: '#ECFF4D',
    card: '#1A1A1A',
    elevated: '#252040',
    border: '#1A1A1A',
    error: '#FF5C7A',
    secondaryText: '#A0A0A0',
  },
};

export const Fonts = {
  primary: 'Plus Jakarta Sans',
  reading: 'Lora',
  arabic: 'Noto Naskh Arabic',
};
