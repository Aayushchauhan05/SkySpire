import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { useLexiconStore } from '../../store/useLexiconStore';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',
  secondaryAccent: '#9B8AF4',
  amber: '#FFB800',
  cyan: '#00E5FF',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#110E1A',
  textMuted: '#8E88B0',
};

export default function FlashcardsScreen() {
  const router = useRouter();
  const { entries, isLoading, fetchDueReviews, submitGrade } = useLexiconStore();
  const userId = 'demo_user';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetchDueReviews(userId);
  }, []);

  const activeEntry = entries[currentIndex];

  const handleGrade = (grade: number) => {
    if (!activeEntry) return;

    submitGrade(userId, activeEntry._id, grade);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentIndex < entries.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Done with all available reviews array will empty soon
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </View>
    );
  }

  if (!activeEntry) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
               <Ionicons name="close" size={28} color={Colors.white} />
            </TouchableOpacity>
         </View>
         <View style={styles.emptyContainer}>
            <Ionicons name="sparkles" size={64} color={Colors.amber} />
            <ThemedText style={styles.emptyTitle}>You're all caught up!</ThemedText>
            <ThemedText style={styles.emptySub}>No reviews due today. Excellent work.</ThemedText>
            <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
               <ThemedText style={styles.doneBtnText}>Return to Dashboard</ThemedText>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.progressWrap}>
           <ThemedText style={styles.progressText}>{currentIndex + 1} / {entries.length}</ThemedText>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Flashcard Area */}
      <View style={styles.cardArea}>
         <TouchableOpacity 
           style={styles.flashcard}
           activeOpacity={0.9}
           onPress={() => {
              setFlipped(!flipped);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
           }}
         >
           {!flipped ? (
              // FRONT
              <View style={styles.cardInner}>
                 <ThemedText style={styles.cardLanguage}>FRENCH</ThemedText>
                 <ThemedText style={styles.cardTerm}>{activeEntry.term}</ThemedText>
                 <ThemedText style={styles.cardInstruction}>Tap to reveal meaning</ThemedText>
              </View>
           ) : (
              // BACK
              <View style={styles.cardInner}>
                 <ThemedText style={styles.cardLanguage}>ENGLISH</ThemedText>
                 <ThemedText style={styles.cardTranslation}>{activeEntry.translation}</ThemedText>
                 {activeEntry.definition ? (
                    <ThemedText style={styles.cardDefinition}>{activeEntry.definition}</ThemedText>
                 ) : null}
                 {activeEntry.example ? (
                    <ThemedText style={styles.cardContext}>"{activeEntry.example}"</ThemedText>
                 ) : null}
              </View>
           )}
         </TouchableOpacity>
      </View>

      {/* Grading Controls - only show when flipped */}
      {flipped ? (
        <View style={styles.gradingContainer}>
           <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: '#3B3559' }]} onPress={() => handleGrade(1)}>
              <ThemedText style={styles.gradeBtnText}>Again</ThemedText>
              <ThemedText style={styles.gradeBtnSub}>&lt; 1d</ThemedText>
           </TouchableOpacity>
           
           <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: '#FF8A66' }]} onPress={() => handleGrade(3)}>
              <ThemedText style={styles.gradeBtnText}>Hard</ThemedText>
              <ThemedText style={styles.gradeBtnSub}>2d</ThemedText>
           </TouchableOpacity>
           
           <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: '#00E5FF' }]} onPress={() => handleGrade(4)}>
              <ThemedText style={[styles.gradeBtnText, { color: '#000' }]}>Good</ThemedText>
              <ThemedText style={[styles.gradeBtnSub, { color: 'rgba(0,0,0,0.6)' }]}>4d</ThemedText>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: '#4ADE80' }]} onPress={() => handleGrade(5)}>
              <ThemedText style={[styles.gradeBtnText, { color: '#000' }]}>Easy</ThemedText>
              <ThemedText style={[styles.gradeBtnSub, { color: 'rgba(0,0,0,0.6)' }]}>1wk</ThemedText>
           </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderBottom} />
      )}
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
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrap: {
    backgroundColor: 'rgba(255, 138, 102, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryAccent,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  flashcard: {
    width: '100%',
    height: height * 0.5,
    backgroundColor: Colors.cardBg,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: Colors.elevatedSurface,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardLanguage: {
    position: 'absolute',
    top: 0,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  cardTerm: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
  },
  cardTranslation: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.cyan,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardDefinition: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  cardContext: {
    fontSize: 16,
    color: Colors.amber,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  cardInstruction: {
    position: 'absolute',
    bottom: 0,
    fontSize: 14,
    color: Colors.textMuted,
  },
  gradingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 8,
  },
  gradeBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  gradeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  gradeBtnSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  placeholderBottom: {
    height: 90, 
    marginBottom: 40
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: Colors.secondaryAccent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.mainBg,
  }
});
