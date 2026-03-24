import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { Colors as ThemeColors } from '../../constants/theme';

const { width } = Dimensions.get('window');

const Colors = {
  mainBg: ThemeColors.dark.background,
  cardBg: ThemeColors.dark.card,
  elevatedSurface: ThemeColors.dark.elevated,
  primaryAccent: ThemeColors.dark.primary,
  secondaryAccent: ThemeColors.dark.secondary,
  amber: ThemeColors.dark.accent,
  primaryText: ThemeColors.dark.text,
  secondaryText: ThemeColors.dark.secondaryText,
};

const DUMMY_QUESTIONS = [
  {
    id: 1,
    question: "How do you say 'Good Morning' in Spanish?",
    options: ["Hola", "Buenos Días", "Buenas Noches", "Adiós"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which of these is informal?",
    options: ["¿Cómo está usted?", "Hola, ¿qué tal?", "Mucho gusto", "Encantado"],
    correctAnswer: 1,
  },
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === DUMMY_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < DUMMY_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons name="trophy" size={80} color={Colors.amber} />
          <ThemedText style={styles.resultTitle}>Quiz Completed!</ThemedText>
          <ThemedText style={styles.resultScore}>You scored {score}/{DUMMY_QUESTIONS.length}</ThemedText>
          <TouchableOpacity 
            style={styles.finishBtn}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.finishBtnText}>Back to Chapter</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const question = DUMMY_QUESTIONS[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.progressCounter}>
          <ThemedText style={styles.progressText}>Question {currentQuestion + 1} of {DUMMY_QUESTIONS.length}</ThemedText>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.questionText}>{question.question}</ThemedText>

        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const showFeedback = selectedOption !== null;
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswer;

            let cardStyle: any = [styles.optionCard];
            if (showFeedback) {
              if (isSelected && isCorrect) cardStyle.push(styles.optionCardCorrect);
              else if (isSelected && !isCorrect) cardStyle.push(styles.optionCardError);
              else if (isCorrect) cardStyle.push(styles.optionCardCorrectBorder);
            }

            return (
              <TouchableOpacity
                key={idx}
                style={cardStyle}
                onPress={() => handleOptionSelect(idx)}
                disabled={selectedOption !== null}
              >
                <ThemedText style={styles.optionText}>{option}</ThemedText>
                {showFeedback && isCorrect && (
                   <Ionicons name="checkmark-circle" size={24} color={Colors.secondaryAccent} />
                )}
                {showFeedback && isSelected && !isCorrect && (
                   <Ionicons name="close-circle" size={24} color={ThemeColors.dark.error} />
                )}
              </TouchableOpacity>
            );
          })}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCounter: {
    backgroundColor: Colors.elevatedSurface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 40,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardCorrect: {
    borderColor: Colors.secondaryAccent,
    backgroundColor: 'rgba(155, 138, 244, 0.1)',
  },
  optionCardError: {
    borderColor: ThemeColors.dark.error,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
  },
  optionCardCorrectBorder: {
    borderColor: Colors.secondaryAccent,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryText,
    marginTop: 24,
  },
  resultScore: {
    fontSize: 20,
    color: Colors.secondaryText,
    marginTop: 8,
    marginBottom: 40,
  },
  finishBtn: {
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  finishBtnText: {
    color: Colors.mainBg,
    fontSize: 18,
    fontWeight: '800',
  },
});
