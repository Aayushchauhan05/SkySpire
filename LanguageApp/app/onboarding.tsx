import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Animated, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, CheckCircle, AirplaneTilt, Briefcase, Student, Users, Heart, GraduationCap } from 'phosphor-react-native';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  elevatedSurface: '#F3F4F6',
  primaryAccent: '#259D7A', 
  secondaryAccent: '#F49320', 
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
};

// Wizard Data
const LANGUAGES = ['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean'];
const GOALS = [
  { id: 'Travel', icon: AirplaneTilt },
  { id: 'Work', icon: Briefcase },
  { id: 'Study', icon: Student },
  { id: 'Family', icon: Users },
  { id: 'Personal', icon: Heart },
  { id: 'Exam', icon: GraduationCap },
];
const DAILY_MINS = ['5 mins / day', '10 mins / day', '15 mins / day', '30 mins / day'];

export default function OnboardingScreen() {
  const router = useRouter();
  const setUserProfile = useAppStore(state => state.setUserProfile);
  
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    language: '',
    goal: '',
    dailyMins: '',
    placement: '', // 'take_test' or 'start_beginning'
  });

  // Auth fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const updateSelection = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    setTimeout(handleNext, 300); // Auto-advance layout wrapper
  };

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
      const dailyMins = parseInt(selections.dailyMins?.split(' ')[0] || '15');
      const motivation = selections.goal || 'Personal';
      const targetLanguage = selections.language || 'Spanish';

      // Save to global local Zustand store
      setUserProfile({
        name,
        targetLanguage,
        dailyGoalMinutes: dailyMins,
        motivation,
        cefrLevel: 'A1' // Default, placement test might override this
      });

      const response = await fetch('http://192.168.29.34:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          targetLanguage,
          proficiencyLevel: 'Beginner', 
          dailyGoalMinutes: dailyMins,
          motivation,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        if (selections.placement === 'take_test') {
          router.replace('/placement-test' as any);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      // Proceed gracefully for UI demo purposes if backend isn't up
      if (selections.placement === 'take_test') {
        router.replace('/placement-test' as any);
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setLoading(false);
    }
  };

  // Views
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>What language do you want to learn?</Text>
      <ScrollView contentContainerStyle={styles.listGrid} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map(lang => {
          const isSelected = selections.language === lang;
          return (
            <TouchableOpacity 
              key={lang} 
              style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
              onPress={() => updateSelection('language', lang)}
            >
              <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>{lang}</Text>
              {isSelected && <CheckCircle size={24} color={Colors.primaryAccent} weight="fill" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Why are you learning?</Text>
      <View style={styles.cardsGrid}>
        {GOALS.map(goalItem => {
          const isSelected = selections.goal === goalItem.id;
          const IconComponent = goalItem.icon;
          return (
            <TouchableOpacity 
              key={goalItem.id} 
              style={[styles.goalCard, isSelected && styles.goalCardActive]}
              onPress={() => updateSelection('goal', goalItem.id)}
            >
              <IconComponent 
                size={32} 
                color={isSelected ? Colors.primaryAccent : Colors.primaryText} 
                weight={isSelected ? "duotone" : "regular"} 
              />
              <Text style={[styles.goalCardText, isSelected && styles.selectBtnTextActive]}>{goalItem.id}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Set your daily goal</Text>
      <Text style={styles.subtitle}>Consistency is key. You can always change this later.</Text>
      <View style={{gap: 16}}>
        {DAILY_MINS.map(min => {
          const isSelected = selections.dailyMins === min;
          return (
            <TouchableOpacity 
              key={min} 
              style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
              onPress={() => updateSelection('dailyMins', min)}
            >
              <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>{min}</Text>
              {isSelected && <CheckCircle size={24} color={Colors.primaryAccent} weight="fill" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Find your starting point</Text>
      
      <TouchableOpacity 
        style={[styles.placementCard, selections.placement === 'take_test' && styles.placementCardActive]}
        onPress={() => updateSelection('placement', 'take_test')}
      >
        <Text style={[styles.placementTitle, selections.placement === 'take_test' && {color: Colors.mainBg}]}>Take Placements Test</Text>
        <Text style={[styles.placementSub, selections.placement === 'take_test' && {color: Colors.cardBg}]}>Answer 20 questions to find your exact level.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.placementCard, { backgroundColor: Colors.elevatedSurface }, selections.placement === 'start_beginning' && styles.selectBtnActive]}
        onPress={() => updateSelection('placement', 'start_beginning')}
      >
        <Text style={[styles.placementTitle, selections.placement === 'start_beginning' && {color: Colors.primaryAccent}]}>Start from scratch</Text>
        <Text style={[styles.placementSub, selections.placement === 'start_beginning' && {color: Colors.primaryAccent}]}>Perfect for absolute beginners.</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
       <Text style={styles.title}>Create your profile</Text>
       <Text style={styles.subtitle}>Save your progress and start your journey.</Text>
       
       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Maria Garcia" placeholderTextColor={Colors.secondaryText} value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput style={styles.input} placeholder="maria@example.com" placeholderTextColor={Colors.secondaryText} keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.secondaryText} secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.secondaryText} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.mainBg} /> : <Text style={styles.submitBtnText}>Create Account</Text>}
            </TouchableOpacity>

             <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{marginTop: 20, alignSelf: 'center'}}>
                <Text style={{fontFamily: 'Plus Jakarta Sans', color: Colors.secondaryText, fontSize: 16, fontWeight: '600'}}>Skip and Browse as Guest</Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => router.push('/login')} style={{marginTop: 24, alignSelf: 'center'}}>
                <Text style={styles.loginSwitchText}>Already have an account? <Text style={{color: Colors.primaryAccent, fontWeight: '700'}}>Log In</Text></Text>
            </TouchableOpacity>
          </ScrollView>
       </KeyboardAvoidingView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <CaretLeft size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={{width: 44}} />
      </View>

      {/* Dynamic Content */}
      <View style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 3,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryAccent,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryText,
    marginBottom: 32,
  },
  listGrid: {
    gap: 16,
    paddingBottom: 40,
  },
  selectBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectBtnActive: {
    borderColor: Colors.primaryAccent,
    backgroundColor: 'rgba(37, 157, 122, 0.05)',
  },
  selectBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  selectBtnTextActive: {
    color: Colors.primaryAccent,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 40,
  },
  goalCard: {
    width: (width - 48 - 16) / 2,
    backgroundColor: Colors.cardBg,
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    gap: 16,
  },
  goalCardActive: {
    borderColor: Colors.primaryAccent,
    backgroundColor: 'rgba(37, 157, 122, 0.05)',
  },
  goalCardText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  placementCard: {
    backgroundColor: Colors.primaryAccent,
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  placementCardActive: {
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  placementTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.mainBg,
    marginBottom: 8,
  },
  placementSub: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mainBg,
    opacity: 0.8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 16,
    color: Colors.primaryText,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  submitBtn: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.mainBg,
  },
  loginSwitchText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: Colors.secondaryText,
  }
});
