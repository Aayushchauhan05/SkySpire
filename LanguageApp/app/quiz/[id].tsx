import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../../components/themed-text';
import { useAppStore } from '../../store/useAppStore';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Restored Premium Matte Colors
const Colors = {
  mainBg: '#121212',
  cardBg: '#1A1A1A',
  elevatedSurface: '#1A1A1A',
  primaryAccent: '#FF8660',     
  secondaryAccent: '#9A98FF', 
  amber: '#ECFF4D',
  error: '#FF5C7A',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#000000',
  textMuted: '#A0A0A0',
};

const DUMMY_QUESTIONS = [
  {
    id: 1,
    type: "MULTIPLE_CHOICE",
    question: "How do you say 'Good Morning' in Spanish?",
    options: ["Hola", "Buenos Días", "Buenas Noches", "Adiós"],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "TRUE_FALSE",
    question: "'La mujer' means 'The man'.",
    options: ["True", "False"],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: "SENTENCE_BUILDER",
    question: "Translate: 'The tall boy'",
    wordBank: ["El", "chico", "alto", "la", "chica", "alta"],
    correctAnswerArr: ["El", "chico", "alto"],
  },
  {
    id: 4,
    type: "TRANSLATION",
    question: "Translate into English: 'Tengo una manzana.'",
    options: ["I have an apple.", "I am an apple.", "I eat an apple.", "I want an apple."],
    correctAnswer: 0,
  }
];

export default function QuizScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const router = useRouter();
  
  // Gamification Hooks
  const addXP = useAppStore(state => state.addXP);
  const addStudyMinutes = useAppStore(state => state.addStudyMinutes);
  const checkAndUpdateStreak = useAppStore(state => state.checkAndUpdateStreak);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isWordFinished, setIsWordFinished] = useState(false);
  const [wordCorrect, setWordCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Use dummy questions for now, since quiz generation is out of scope for this specific UI change if it isn't dynamic yet
  const question = DUMMY_QUESTIONS[currentQuestion];

  const proceedToNext = () => {
    setTimeout(() => {
      setSelectedOption(null);
      setSelectedWords([]);
      setIsWordFinished(false);
      setWordCorrect(null);
      if (currentQuestion < DUMMY_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsFinished(true);
        // Reward global stats on completion
        addXP(50);
        addStudyMinutes(5); // Arbitrary 5 mins per quiz
        checkAndUpdateStreak();
      }
    }, 1200);
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    proceedToNext();
  };

  const handleWordSelect = (word: string) => {
    if (isWordFinished) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedWords(prev => [...prev, word]);
  };

  const checkSentence = () => {
    if (isWordFinished) return;
    setIsWordFinished(true);
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(question.correctAnswerArr);
    if (isCorrect) {
      setScore(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setWordCorrect(isCorrect);
    proceedToNext();
  };

  const submitRating = async () => {
    if (rating === 0) {
      router.push('/course');
      return;
    }
    setIsSubmittingRating(true);
    try {
      const apiURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3000/api';
      await axios.post(`${apiURL}/chapters/${id}/rate`, {
        userId: 'demo_user',
        rating,
        feedback
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
    setIsSubmittingRating(false);
    router.push('/course');
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
          
          {type === 'module' && (
             <View style={styles.ratingBox}>
               <ThemedText style={styles.ratingTitle}>How was this chapter?</ThemedText>
               <View style={styles.starsRow}>
                 {[1, 2, 3, 4, 5].map((star) => (
                   <TouchableOpacity key={star} onPress={() => setRating(star)}>
                     <Ionicons 
                       name={star <= rating ? "star" : "star-outline"} 
                       size={40} 
                       color={Colors.amber} 
                     />
                   </TouchableOpacity>
                 ))}
               </View>
               {rating > 0 && (
                 <TextInput
                   style={styles.feedbackInput}
                   placeholder="Any feedback? (Optional)"
                   placeholderTextColor={Colors.textMuted}
                   value={feedback}
                   onChangeText={setFeedback}
                 />
               )}
             </View>
          )}

          <TouchableOpacity 
            style={[styles.finishBtn, isSubmittingRating && { opacity: 0.7 }]}
            onPress={type === 'module' ? submitRating : () => router.push('/course')}
            disabled={isSubmittingRating}
          >
            {isSubmittingRating ? <ActivityIndicator color={Colors.white} /> : <ThemedText style={styles.finishBtnText}>{type === 'module' && rating > 0 ? 'Submit & ' : ''}Back to Curriculum</ThemedText>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <ThemedText style={styles.questionTitle}>{question.type.replace('_', ' ')}</ThemedText>
        <ThemedText style={styles.questionText}>{question.question}</ThemedText>

        {question.type === 'SENTENCE_BUILDER' ? (
          <View style={styles.builderContainer}>
             <View style={[styles.sentenceDropZone, wordCorrect === true && {borderColor: Colors.secondaryAccent}, wordCorrect === false && {borderColor: Colors.error}]}>
                {selectedWords.map((word, idx) => (
                  <View key={idx} style={styles.wordPill}>
                    <ThemedText style={styles.wordPillText}>{word}</ThemedText>
                  </View>
                ))}
             </View>
             
             <View style={styles.wordBank}>
                {question.wordBank?.map((word, idx) => {
                   const isSelected = selectedWords.includes(word);
                   return (
                     <TouchableOpacity 
                       key={idx} 
                       style={[styles.wordPillBank, isSelected && {opacity: 0.3}]}
                       disabled={isSelected || isWordFinished}
                       onPress={() => handleWordSelect(word)}
                     >
                        <ThemedText style={styles.wordPillText}>{word}</ThemedText>
                     </TouchableOpacity>
                   );
                })}
             </View>

             <TouchableOpacity 
                style={[styles.checkBtn, selectedWords.length === 0 && {backgroundColor: Colors.elevatedSurface}]}
                onPress={checkSentence}
                disabled={selectedWords.length === 0 || isWordFinished}
             >
                <ThemedText style={styles.checkBtnText}>CHECK</ThemedText>
             </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, idx) => {
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
                        <Ionicons name="checkmark" size={28} color={Colors.mainBg} />
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
        )}
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
    fontSize: 20,
    fontWeight: '900',
  },
  ratingBox: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  feedbackInput: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.mainBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.secondaryAccent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  builderContainer: {
    marginTop: 20,
    flex: 1,
  },
  sentenceDropZone: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: Colors.elevatedSurface,
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 40,
    backgroundColor: 'rgba(28, 24, 48, 0.5)',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 40,
  },
  wordPill: {
    backgroundColor: Colors.secondaryAccent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  wordPillBank: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  wordPillText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  checkBtn: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  checkBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
  }
});
