import { StyleSheet, TouchableOpacity, type TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from './themed-text';
import React from 'react';

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  lightColor?: string;
  darkColor?: string;
  textColor?: string;
};

export function ThemedButton({
  title,
  variant = 'primary',
  loading = false,
  style,
  lightColor,
  darkColor,
  disabled,
  textColor,
  ...rest
}: ThemedButtonProps) {
  const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const backgroundColor = variant === 'primary' ? tintColor : 'transparent';
  const computedTextColor = textColor || (variant === 'primary' ? '#f5f7f7ff' : tintColor);
  const borderColor = variant === 'outline' ? tintColor : 'transparent';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth: variant === 'outline' ? 1 : 0 },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={computedTextColor} />
      ) : (
        <ThemedText style={[styles.text, { color: computedTextColor }]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
