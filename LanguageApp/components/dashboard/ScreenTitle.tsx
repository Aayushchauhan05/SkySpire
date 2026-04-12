import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const ScreenTitle = ({ firstName }: { firstName: string }) => {
  return (
    <Text style={styles.title}>
      What would you like to learn today, {firstName}?
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28, 
    fontWeight: '700', 
    color: '#2B2D42', 
    lineHeight: 34, 
    maxWidth: '85%', 
    marginBottom: 24
  }
});
