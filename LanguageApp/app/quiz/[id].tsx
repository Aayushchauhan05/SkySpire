import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';

const { width } = Dimensions.get('window');

// Restored Premium Matte Colors
const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',     
  secondaryAccent: '#9B8AF4', 
  amber: '#FFB800',
  error: '#FF5C7A',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#110E1A',
  textMuted: '#8E88B0',
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
    }, 1200);
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.trophyWrapper}>
             <Ionicons name="trophy" size={100} color={Colors.amber} />
          </View>
          <ThemedText style={styles.resultTitle}>Quiz Completed!</ThemedText>
          <ThemedText style={styles.resultScore}>You scored {score}/{DUMMY_QUESTIONS.length}</ThemedText>
          
          <TouchableOpacity 
            style={styles.finishBtn}
            onPress={() => router.push('/course')}
          >
            <ThemedText style={styles.finishBtnText}>Back to Curriculum</ThemedText>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSmall}>
          <Ionicons name="close" size={32} color={Colors.textDark} />
        </TouchableOpacity>
        
        <View style={styles.progressCounter}>
          <ThemedText style={styles.progressText}>{currentQuestion + 1} / {DUMMY_QUESTIONS.length}</ThemedText>
        </View>
        
        <View style={{ width: 56 }} />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.questionText}>{question.question}</ThemedText>

        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const showFeedback = selectedOption !== null;
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswer;

            let cardStyle: any = [styles.optionCard];
            let textColor = Colors.textHeader;

            if (showFeedback) {
              if (isSelected && isCorrect) {
                 cardStyle.push(styles.optionCardCorrect);
                 textColor = Colors.textDark; // Invert text for light background
              }
              else if (isSelected && !isCorrect) {
                 cardStyle.push(styles.optionCardError);
              }
              else if (isCorrect) {
                 cardStyle.push(styles.optionCardCorrectBorder);
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={cardStyle}
                onPress={() => handleOptionSelect(idx)}
                disabled={selectedOption !== null}
                activeOpacity={0.8}
              >
                <ThemedText style={[styles.optionText, { color: textColor }]}>{option}</ThemedText>
                
                {showFeedback && isCorrect && isSelected && (
                   <View style={styles.iconCircleDark}>
                      <Ionicons name="checkmark" size={28} color={Colors.secondaryAccent} />
                   </View>
                )}
                {showFeedback && isCorrect && !isSelected && (
                   <View style={styles.iconCircleLight}>
                      <Ionicons name="checkmark" size={28} color={Colors.secondaryAccent} />
                   </View>
                )}
                {showFeedback && isSelected && !isCorrect && (
                   <View style={styles.iconCircleError}>
                      <Ionicons name="close" size={28} color={Colors.error} />
                   </View>
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
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  backBtnSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCounter: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
  },
  progressText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textHeader,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  questionText: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.textHeader,
    marginBottom: 40,
    lineHeight: 46,
    letterSpacing: -1,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
    minHeight: 90,
  },
  optionCardCorrect: {
    borderColor: Colors.secondaryAccent,
    backgroundColor: Colors.secondaryAccent,
  },
  optionCardError: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(255, 92, 122, 0.1)',
  },
  optionCardCorrectBorder: {
    borderColor: Colors.secondaryAccent,
  },
  optionText: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
  },
  iconCircleDark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  iconCircleLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(155, 138, 244, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  iconCircleError: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 92, 122, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  trophyWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  resultTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textHeader,
    letterSpacing: -1.5,
  },
  resultScore: {
    fontSize: 24,
    color: Colors.textMuted,
    marginTop: 12,
    fontWeight: '600',
    marginBottom: 60,
  },
  finishBtn: {
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 40,
    paddingVertical: 24,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
  },
  finishBtnText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
});
