import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login failed', data.message || 'Please try again.');
      }
    } catch {
      Alert.alert('Connection error', 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (field: 'email' | 'password') =>
    focusedField === field
      ? 'rgba(255,138,102,0.7)'
      : 'rgba(255,255,255,0.08)';

  return (
    <SafeAreaView className="flex-1 bg-main-bg">

      {/* ── DECORATIVE BLOBS ── */}
      <View
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          top: -60,
          right: -80,
          backgroundColor: 'rgba(155,138,244,0.1)',
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          top: height * 0.3,
          left: -80,
          backgroundColor: 'rgba(255,138,102,0.08)',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── BACK BUTTON ── */}
          <TouchableOpacity
            className="mt-2 mb-6 self-start p-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* ── BRAND MARK ── */}
          <View className="items-center mb-10">
            <View
              className="items-center justify-center rounded-[22px] mb-4"
              style={{
                width: 64,
                height: 64,
                backgroundColor: '#FF8A66',
                shadowColor: '#FF8A66',
                shadowOpacity: 0.45,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 6 },
                elevation: 10,
              }}
            >
              <Ionicons name="language" size={30} color="#FFFFFF" />
            </View>
            <Text
              className="text-white font-black tracking-widest"
              style={{ fontSize: 20, letterSpacing: 4 }}
            >
              SKYSPIRE
            </Text>
          </View>

          {/* ── HEADLINE ── */}
          <View className="mb-8">
            <Text
              className="text-white font-extrabold"
              style={{ fontSize: 32, lineHeight: 38 }}
            >
              Welcome back 👋
            </Text>
            <Text className="text-muted mt-2 text-base font-medium">
              Sign in to continue your streak
            </Text>
          </View>

          {/* ── FORM ── */}
          <View className="gap-4 mb-3">

            {/* Email field */}
            <View>
              <Text className="text-white/60 text-sm font-semibold mb-2 ml-1">
                Email address
              </Text>
              <View
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  height: 56,
                  backgroundColor: '#1C1830',
                  borderWidth: 1.5,
                  borderColor: inputBorder('email'),
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={focusedField === 'email' ? '#FF8A66' : '#8E88B0'}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-white font-medium"
                  style={{ fontSize: 15 }}
                  placeholder="name@example.com"
                  placeholderTextColor="#4A4570"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password field */}
            <View>
              <Text className="text-white/60 text-sm font-semibold mb-2 ml-1">
                Password
              </Text>
              <View
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  height: 56,
                  backgroundColor: '#1C1830',
                  borderWidth: 1.5,
                  borderColor: inputBorder('password'),
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedField === 'password' ? '#FF8A66' : '#8E88B0'}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-white font-medium"
                  style={{ fontSize: 15 }}
                  placeholder="••••••••"
                  placeholderTextColor="#4A4570"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  className="p-1"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8E88B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <TouchableOpacity className="self-end">
              <Text className="text-coral font-semibold text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── SIGN IN BUTTON ── */}
          <TouchableOpacity
            className="items-center justify-center rounded-2xl mt-2"
            style={{
              height: 58,
              backgroundColor: loading ? 'rgba(255,138,102,0.5)' : '#FF8A66',
              shadowColor: '#FF8A66',
              shadowOpacity: loading ? 0 : 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-extrabold text-base">
              {loading ? 'Signing in…' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* ── DIVIDER ── */}
          <View className="flex-row items-center gap-3 my-7">
            <View className="flex-1 h-px bg-white/10" />
            <Text className="text-muted text-sm font-medium">or continue with</Text>
            <View className="flex-1 h-px bg-white/10" />
          </View>

          {/* ── SOCIAL BUTTONS ── */}
          <View className="flex-row gap-4 mb-10">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl"
              style={{
                height: 52,
                backgroundColor: '#1C1830',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text className="text-white font-semibold text-sm">Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl"
              style={{
                height: 52,
                backgroundColor: '#1C1830',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm">Apple</Text>
            </TouchableOpacity>
          </View>

          {/* ── FOOTER ── */}
          <View className="flex-row justify-center items-center pb-6">
            <Text className="text-muted text-sm font-medium">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-coral font-extrabold text-sm">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
