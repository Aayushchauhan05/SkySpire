import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const LANGUAGE_PILLS = [
  { label: 'Hola', flag: '🇪🇸' },
  { label: 'Bonjour', flag: '🇫🇷' },
  { label: 'مرحبا', flag: '🇸🇦' },
  { label: '日本語', flag: '🇯🇵' },
  { label: 'Ciao', flag: '🇮🇹' },
  { label: 'Hallo', flag: '🇩🇪' },
];

export default function LandingScreen() {
  const router = useRouter();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const scaleBreath = useRef(new Animated.Value(0.97)).current;
  const pillsSlide = useRef(new Animated.Value(30)).current;
  const footerSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      // Fade everything in
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      // Pills slide up
      Animated.timing(pillsSlide, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      // Footer slide up
      Animated.timing(footerSlide, {
        toValue: 0,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
      // Breathing loop on logo
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleBreath, {
            toValue: 1.04,
            duration: 2800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBreath, {
            toValue: 0.97,
            duration: 2800,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-main-bg">

      {/* ── DECORATIVE BLOBS ── */}
      <View
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          top: -80,
          right: -80,
          backgroundColor: 'rgba(155,138,244,0.12)',
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          bottom: height * 0.22,
          left: -100,
          backgroundColor: 'rgba(255,138,102,0.1)',
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          bottom: height * 0.12,
          right: -40,
          backgroundColor: 'rgba(255,184,0,0.07)',
        }}
      />

      {/* ── CENTER LOGO ── */}
      <Animated.View
        className="flex-1 items-center justify-center"
        style={{ opacity: fadeIn }}
      >
        {/* Glow ring behind logo */}
        <View
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            backgroundColor: 'rgba(255,138,102,0.07)',
            borderWidth: 1,
            borderColor: 'rgba(255,138,102,0.15)',
          }}
        />

        <Animated.View
          className="items-center"
          style={{ transform: [{ scale: scaleBreath }] }}
        >
          {/* Icon badge */}
          <View
            className="items-center justify-center mb-6 rounded-[28px]"
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#FF8A66',
              shadowColor: '#FF8A66',
              shadowOpacity: 0.5,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
            }}
          >
            <Ionicons name="language" size={40} color="#FFFFFF" />
          </View>

          {/* Brand name */}
          <Text
            className="text-white font-black tracking-widest"
            style={{ fontSize: 38, letterSpacing: 5 }}
          >
            SKYSPIRE
          </Text>
          <Text
            className="text-muted font-semibold tracking-widest mt-2"
            style={{ fontSize: 13, letterSpacing: 7 }}
          >
            ACADEMY
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          className="text-muted text-center font-medium mt-8 px-10"
          style={{ fontSize: 15, lineHeight: 22, opacity: fadeIn }}
        >
          Master a new language with{'\n'}science-backed daily lessons
        </Animated.Text>

        {/* ── FLOATING LANGUAGE PILLS ── */}
        <Animated.View
          className="flex-row flex-wrap justify-center gap-2 mt-10 px-8"
          style={{
            opacity: fadeIn,
            transform: [{ translateY: pillsSlide }],
          }}
        >
          {LANGUAGE_PILLS.map((p) => (
            <View
              key={p.label}
              className="flex-row items-center gap-1.5 bg-card-bg rounded-2xl px-4 py-2"
              style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <Text style={{ fontSize: 16 }}>{p.flag}</Text>
              <Text className="text-white/70 font-semibold text-sm">{p.label}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      {/* ── FOOTER ACTIONS ── */}
      <Animated.View
        className="px-6 pb-8 gap-4"
        style={{
          opacity: fadeIn,
          transform: [{ translateY: footerSlide }],
        }}
      >
        {/* Get Started — primary */}
        <TouchableOpacity
          className="items-center justify-center rounded-2xl"
          style={{
            height: 60,
            backgroundColor: '#FF8A66',
            shadowColor: '#FF8A66',
            shadowOpacity: 0.4,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
          onPress={() => router.push('/onboarding')}
        >
          <Text
            className="text-white font-extrabold"
            style={{ fontSize: 17 }}
          >
            Get Started — It's Free
          </Text>
        </TouchableOpacity>

        {/* Log In — outlined */}
        <TouchableOpacity
          className="items-center justify-center rounded-2xl"
          style={{
            height: 56,
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.15)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-bold text-base">
            Already have an account?{' '}
            <Text className="text-coral font-extrabold">Log In</Text>
          </Text>
        </TouchableOpacity>

        {/* Guest */}
        <TouchableOpacity
          className="items-center py-2"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-muted font-semibold text-sm">
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
