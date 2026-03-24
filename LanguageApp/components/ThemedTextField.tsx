import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from './themed-text';
import { useState } from 'react';

export type ThemedTextFieldProps = TextInputProps & {
  label?: string;
  lightColor?: string;
  darkColor?: string;
  error?: string;
};

export function ThemedTextField({
  label,
  style,
  lightColor,
  darkColor,
  error,
  ...rest
}: ThemedTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const placeholderColor = useThemeColor({ light: '#9BA1A6', dark: '#687076' }, 'icon');

  return (
    <View style={styles.container}>
      {label && <ThemedText type="defaultSemiBold" style={styles.label}>{label}</ThemedText>}
      <TextInput
        style={[
          styles.input,
          {
            color,
            backgroundColor: isFocused ? backgroundColor : (backgroundColor === '#110E1A' ? '#1E1E1E' : '#F5F5F5'),
            borderColor: error ? '#FF3B30' : (isFocused ? tintColor : '#E0E0E0'),
            borderWidth: 1,
          },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
