import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, Animated, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  elevatedSurface: '#F3F4F6',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  amber: '#FFB800',
  cyan: '#00ACC1',
  primaryText: '#2B2D42',
  textHeader: '#2B2D42',
  textDark: '#FFFFFF',
  textMuted: '#A0AABF',
  border: '#E2E8F0',
};

const DUMMY_PLACEMENT = [
  { id: 1, question: "Identify the correct formal greeting:", options: ["¿Qué onda?", "Hola, tío", "Buenos días", "¡Chao!"], type: "A1" },
  { id: 2, question: "Conjugate 'Nosotros' (We) for 'Comer' (to eat) in present tense.", options: ["Como", "Comes", "Comemos", "Comen"], type: "A1" },
  { id: 3, question: "Select the past tense equivalent: 'I spoke'", options: ["Hablo", "Hablé", "Hablabamos", "Hablaré"], type: "A2" },
  { id: 4, question: "Which phrase suggests subjunctive mood?", options: ["Yo creo que vamos", "Espero que vayas", "Él corre", "Nosotros somos"], type: "B1" },
  { id: 5, question: "Choose the correct preposition: 'Pensar ___ ti'", options: ["a", "con", "en", "por"], type: "B2" },
];

export default function PlacementTestScreen() {
  const router = useRouter();
  const setUserProfile = useAppStore(state => state.setUserProfile);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [placementLevel, setPlacementLevel] = useState('A1');

  const question = DUMMY_PLACEMENT[currentIdx];
  const progressPercent = ((currentIdx) / DUMMY_PLACEMENT.length) * 100;

  const handleSelect = (idx: number) => {
    setAnswers(prev => [...prev, idx]);
    
    // Auto advance
    setTimeout(() => {
      if (currentIdx < DUMMY_PLACEMENT.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        calculatePlacement();
      }
    }, 400);
  };

  const calculatePlacement = () => {
    // Dummy logic: random placement for demo
    const levels = ['A1', 'A2', 'B1', 'B2'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    setPlacementLevel(randomLevel);
    
    // Save to Zustand
    setUserProfile({ cefrLevel: randomLevel });

    setIsFinished(true);
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.cefrBadge}>
             <Text style={styles.cefrText}>{placementLevel}</Text>
          </View>
          <Text style={styles.resultTitle}>You're Level {placementLevel}</Text>
          <Text style={styles.resultDesc}>
            Based on your test results, we've calibrated your curriculum to match your proficiency.
          </Text>
          <TouchableOpacity 
            style={styles.finishBtn} 
            onPress={() => router.replace('/(tabs)' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.finishBtnText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.quitBtn} onPress={() => router.replace('/(tabs)' as any)}>
           <Ionicons name="close" size={28} color={Colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
           <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.counterText}>{currentIdx + 1}/20</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>Grammar & Vocab</Text>
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.optionsWrap}>
          {question.options.map((opt, idx) => (
             <TouchableOpacity 
               key={idx}
               style={styles.optionBtn}
               onPress={() => handleSelect(idx)}
               activeOpacity={0.7}
             >
               <Text style={styles.optionText}>{opt}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  quitBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryAccent,
    borderRadius: 4,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryAccent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryText,
    lineHeight: 40,
    letterSpacing: -1,
    marginBottom: 40,
  },
  optionsWrap: {
    gap: 16,
  },
  optionBtn: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  resultContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cefrBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(37, 157, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 8,
    borderColor: 'rgba(37, 157, 122, 0.2)',
  },
  cefrText: {
    fontSize: 56,
    fontWeight: '900',
    color: Colors.primaryAccent,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultDesc: {
    fontSize: 18,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 60,
  },
  finishBtn: {
    backgroundColor: Colors.primaryAccent,
    width: '100%',
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  finishBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  }
});
