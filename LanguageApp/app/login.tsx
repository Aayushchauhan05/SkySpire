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
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
};

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
      const response = await fetch('http://192.168.29.34:3000/api/auth/login', {
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
    focusedField === field ? Colors.primaryAccent : Colors.border;

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Blobs */}
      <View style={[styles.blob1, { top: -60, right: -80 }]} />
      <View style={[styles.blob2, { top: height * 0.3, left: -80 }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.primaryText} />
          </TouchableOpacity>

          {/* Brand Mark */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="language" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.brandText}>SKYSPIRE</Text>
          </View>

          {/* Headline */}
          <View style={styles.headlineContainer}>
            <Text style={styles.title}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue your streak</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email address</Text>
              <View style={[styles.inputBox, { borderColor: inputBorder('email') }]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={focusedField === 'email' ? Colors.primaryAccent : Colors.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.secondaryText}
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

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputBox, { borderColor: inputBorder('password') }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedField === 'password' ? Colors.primaryAccent : Colors.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.secondaryText}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={{ padding: 4 }}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={20} color={Colors.primaryText} />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.mainBg },
  blob1: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(37, 157, 122, 0.05)',
  },
  blob2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(244, 147, 32, 0.06)',
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  backButton: {
    marginTop: 8, marginBottom: 24, alignSelf: 'flex-start', padding: 10,
    backgroundColor: '#FFFFFF', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  brandContainer: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 64, height: 64, borderRadius: 22, backgroundColor: Colors.primaryAccent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: Colors.primaryAccent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8
  },
  brandText: { fontSize: 20, fontWeight: '900', letterSpacing: 4, color: Colors.primaryText },
  headlineContainer: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.primaryText, lineHeight: 38 },
  subtitle: { fontSize: 16, fontWeight: '500', color: Colors.secondaryText, marginTop: 8 },
  formContainer: { gap: 16, marginBottom: 12 },
  inputWrapper: { marginBottom: 4 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.secondaryText, marginBottom: 8, marginLeft: 4 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: Colors.cardBg,
    borderRadius: 16, paddingHorizontal: 16, borderWidth: 1.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.primaryText },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { fontSize: 14, fontWeight: '600', color: Colors.secondaryAccent },
  submitBtn: {
    height: 58, backgroundColor: Colors.primaryAccent, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: Colors.primaryAccent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 14, fontWeight: '500', color: Colors.secondaryText },
  socialContainer: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  socialBtn: {
    flex: 1, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.cardBg, borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1
  },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primaryText },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 24 },
  footerText: { fontSize: 14, fontWeight: '500', color: Colors.secondaryText },
  footerLink: { fontSize: 14, fontWeight: '800', color: Colors.primaryAccent }
});
