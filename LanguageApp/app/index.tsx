import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/themed-text';
import { ThemedButton } from '../components/ThemedButton';

const { width } = Dimensions.get('window');

// Premium Matte Colors
const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66', // Warm Orange (Replaced neon green)
  secondaryAccent: '#9B8AF4', // Soft Purple
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#F0EEF8',
  secondaryText: '#8E88B0',
};

export default function LandingScreen() {
  const router = useRouter();
  
  // Animation values
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Breathing/Pulse Animation
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.95,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      )
    ]).start();
  }, [scaleValue, opacityValue]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Centered Animated Content */}
      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoContainer, { opacity: opacityValue, transform: [{ scale: scaleValue }] }]}>
          <View style={[styles.logoDot, { backgroundColor: Colors.primaryAccent }]} />
          <ThemedText style={styles.logoText}>SKYSPIRE</ThemedText>
        </Animated.View>
        <Animated.View style={{ opacity: opacityValue }}>
          <ThemedText style={styles.subtitleText}>ACADEMY</ThemedText>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <Animated.View style={[styles.footer, { opacity: opacityValue }]}>
        <ThemedButton 
          title="Get Started" 
          onPress={() => router.push('/onboarding')}
          style={styles.mainBtn}
          textColor={Colors.mainBg}
        />
        <TouchableOpacity 
          style={styles.ghostBtn} 
          onPress={() => router.push('/login')}
        >
          <ThemedText style={styles.ghostBtnText}>
            Already signed up? <ThemedText style={{ color: Colors.primaryAccent, fontWeight: '700' }}>Log In</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 4,
    color: Colors.primaryText,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 8,
    color: Colors.secondaryText,
    marginTop: 12,
    marginLeft: 8, // Optical alignment with the letter spacing
  },
  footer: {
    paddingHorizontal: 24,
    gap: 20,
    alignItems: 'center',
  },
  mainBtn: {
    height: 64,
    borderRadius: 20,
    width: '100%',
    backgroundColor: Colors.primaryAccent,
  },
  ghostBtn: {
    padding: 10,
  },
  ghostBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryText,
  },
});
