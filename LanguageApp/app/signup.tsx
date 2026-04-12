import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Alert, Text, TextInput, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  primaryAccent: '#259D7A',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
};

export default function SignupScreen() {
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.29.34:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password, name,
          targetLanguage: params.language,
          proficiencyLevel: params.level,
          dailyGoalMinutes: parseInt((params.goal as string)?.split(' ')[0] || '15'),
          motivation: params.motivation,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (field: string) =>
    focusedField === field ? Colors.primaryAccent : Colors.border;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.primaryText} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your language learning today</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Full Name Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputBox, { borderColor: inputBorder('name') }]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.secondaryText}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputBox, { borderColor: inputBorder('email') }]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.secondaryText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputBox, { borderColor: inputBorder('password') }]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.secondaryText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputBox, { borderColor: inputBorder('confirm') }]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.secondaryText}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSignup} disabled={loading}>
              <Text style={styles.submitBtnText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.mainBg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 },
  backButton: {
    marginBottom: 32, alignSelf: 'flex-start', padding: 10,
    backgroundColor: '#FFFFFF', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.primaryText, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.secondaryText, fontWeight: '500' },
  formContainer: { width: '100%', gap: 16 },
  inputWrapper: { marginBottom: 4 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.secondaryText, marginBottom: 8, marginLeft: 4 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: Colors.cardBg,
    borderRadius: 16, paddingHorizontal: 16, borderWidth: 1.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1
  },
  textInput: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.primaryText },
  submitBtn: {
    height: 58, backgroundColor: Colors.primaryAccent, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
    shadowColor: Colors.primaryAccent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 32 },
  footerText: { fontSize: 14, fontWeight: '500', color: Colors.secondaryText },
  footerLink: { fontSize: 14, fontWeight: '800', color: Colors.primaryAccent }
});
