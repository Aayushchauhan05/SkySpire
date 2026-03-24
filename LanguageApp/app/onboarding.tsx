import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';

// Premium Matte Colors
const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66', // Warm Orange (Replaced neon green)
  secondaryAccent: '#9B8AF4',
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#F0EEF8',
  secondaryText: '#8E88B0',
};

const { width } = Dimensions.get('window');

const STEPS = [
  {
    id: 'language',
    title: 'What language do you want to learn?',
    options: ['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean'],
  },
  {
    id: 'level',
    title: 'What is your proficiency level?',
    options: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'],
  },
  {
    id: 'goal',
    title: 'Set your daily goal',
    options: ['5 mins / day', '10 mins / day', '20 mins / day', '30 mins / day'],
  },
  {
    id: 'motivation',
    title: 'What is your motivation?',
    options: ['Travel', 'Career', 'Culture', 'Brain Training', 'Education'],
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSelect = (option: string) => {
    const stepKey = STEPS[currentStep].id;
    setSelections({ ...selections, [stepKey]: option });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed onboarding logic here -> go to home screen (not logged in)
      console.log('Onboarding Complete:', selections);
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={{ color: Colors.secondaryText, fontSize: 16, fontWeight: '600' }}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{STEPS[currentStep].title}</Text>
        
        <View style={styles.optionsContainer}>
          {STEPS[currentStep].options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selections[STEPS[currentStep].id] === option && styles.optionButtonSelected
              ]}
              onPress={() => handleSelect(option)}
            >
              <Text 
                style={[
                  styles.optionText, 
                  selections[STEPS[currentStep].id] === option && styles.optionTextSelected
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primaryAccent,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 40,
    lineHeight: 36,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: Colors.cardBg,
    borderWidth: 2,
    borderColor: Colors.elevatedSurface,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: Colors.primaryAccent,
    backgroundColor: '#2D1F1A', // Warmer dark tint
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  optionTextSelected: {
    color: Colors.primaryAccent,
  },
});
