import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  elevatedSurface: '#F3F4F6',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
  error: '#FF5C7A',
};

export default function PracticeFlashcardsScreen() {
  const router = useRouter();
  const { tags } = useLocalSearchParams<{ tags?: string }>();
  const [examples, setExamples] = useState<any[]>([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const API_URL = 'http://192.168.29.34:3000/api/grammar'; // Update to local for testing if needed

  useEffect(() => {
    let url = `${API_URL}/examples/random?count=10`;
    if (tags) url += `&tags=${tags}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setExamples(data))
      .catch(console.error);
  }, [tags]);

  const nextCard = () => {
    setRevealed(false);
    if (currIdx < examples.length - 1) {
      setCurrIdx(currIdx + 1);
    } else {
      router.back();
    }
  };

  if (examples.length === 0) return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top', 'left', 'right', 'bottom']}>
      <ActivityIndicator size="large" color={Colors.primaryAccent} />
    </SafeAreaView>
  );

  const card = examples[currIdx];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.actionBtn}>
          <Ionicons name="close" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.progressText}>Card {currIdx + 1} of {examples.length}</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="options" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setRevealed(true)}
          style={[styles.flashcard, revealed ? styles.flashcardRevealed : null]}
        >
          <Text style={styles.spanishText}>{card.spanish}</Text>

          {!revealed ? (
            <Text style={styles.tapPrompt}>Tap to reveal translation</Text>
          ) : (
            <Text style={styles.englishText}>{card.english}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.tagsContainer}>
          {revealed && (
            <Text style={styles.tagsText}>
              Tags: {card.tags?.join(' · ')}
            </Text>
          )}
        </View>

        {revealed && (
          <View style={styles.evaluationContainer}>
            <TouchableOpacity style={styles.evalBtnHard} onPress={nextCard}>
              <Text style={{ fontSize: 24 }}>😕</Text>
              <Text style={styles.evalTextHard}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evalBtnOk} onPress={nextCard}>
              <Text style={{ fontSize: 24 }}>😐</Text>
              <Text style={styles.evalTextOk}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evalBtnEasy} onPress={nextCard}>
              <Text style={{ fontSize: 24 }}>😊</Text>
              <Text style={styles.evalTextEasy}>Easy</Text>
            </TouchableOpacity>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  flashcard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 40,
    padding: 32,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 8,
  },
  flashcardRevealed: {
    borderColor: Colors.primaryAccent,
    borderWidth: 2,
    shadowColor: Colors.primaryAccent,
  },
  spanishText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: 32,
  },
  tapPrompt: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondaryText,
    marginTop: 40,
  },
  englishText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryAccent,
    textAlign: 'center',
  },
  tagsContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  tagsText: {
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  evaluationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    gap: 16,
  },
  evalBtnHard: {
    flex: 1,
    backgroundColor: 'rgba(255, 92, 122, 0.1)',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  evalBtnOk: {
    flex: 1,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderWidth: 1,
    borderColor: Colors.amber,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  evalBtnEasy: {
    flex: 1,
    backgroundColor: 'rgba(37, 157, 122, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  evalTextHard: {
    color: Colors.error,
    fontWeight: '800',
    marginTop: 8,
    fontSize: 16,
  },
  evalTextOk: {
    color: Colors.amber,
    fontWeight: '800',
    marginTop: 8,
    fontSize: 16,
  },
  evalTextEasy: {
    color: Colors.primaryAccent,
    fontWeight: '800',
    marginTop: 8,
    fontSize: 16,
  },
});
