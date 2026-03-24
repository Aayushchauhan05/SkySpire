import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const DUMMY_VOCAB = [
  { word: "Hola", translation: "Hello", level: "A1", category: "Greetings" },
  { word: "Gracias", translation: "Thank you", level: "A1", category: "Greetings" },
  { word: "Cerveza", translation: "Beer", level: "A1", category: "Food & Drink" },
  { word: "Biblioteca", translation: "Library", level: "A2", category: "Places" },
  { word: "Desafortunadamente", translation: "Unfortunately", level: "B2", category: "Adverbs" },
];

const FLASHCARDS = [
  { front: "The Morning", back: "La Mañana" },
  { front: "To Eat", back: "Comer" },
  { front: "Yellow", back: "Amarillo" },
];

export default function LexiconDetailScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  const renderVocabulary = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {DUMMY_VOCAB.map((item, idx) => (
        <View key={idx} style={styles.vocabRow}>
          <View style={styles.vocabInfo}>
            <ThemedText style={styles.vocabWord}>{item.word}</ThemedText>
            <ThemedText style={styles.vocabSub}>{item.category} • {item.level}</ThemedText>
          </View>
          <ThemedText style={styles.vocabTranslation}>{item.translation}</ThemedText>
        </View>
      ))}
    </ScrollView>
  );

  const renderFlashcards = () => (
    <View style={styles.flashcardContainer}>
      <TouchableOpacity 
        style={[styles.flashcard, flipped && styles.flashcardFlipped]} 
        onPress={() => setFlipped(!flipped)}
        activeOpacity={0.9}
      >
        <ThemedText style={styles.cardText}>
          {flipped ? FLASHCARDS[cardIdx].back : FLASHCARDS[cardIdx].front}
        </ThemedText>
        <ThemedText style={styles.flipLabel}>{flipped ? "TAP TO HIDE" : "TAP TO REVEAL"}</ThemedText>
      </TouchableOpacity>
      
      <View style={styles.cardControls}>
        <TouchableOpacity 
          style={styles.controlBtn} 
          onPress={() => { setFlipped(false); setCardIdx((cardIdx - 1 + FLASHCARDS.length) % FLASHCARDS.length); }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <ThemedText style={styles.counterText}>{cardIdx + 1} / {FLASHCARDS.length}</ThemedText>
        <TouchableOpacity 
          style={styles.controlBtn} 
          onPress={() => { setFlipped(false); setCardIdx((cardIdx + 1) % FLASHCARDS.length); }}
        >
          <Ionicons name="chevron-forward" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGenericList = (title: string, icon: any, color: string) => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.listItem}>
          <View style={[styles.itemIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View style={styles.itemInfo}>
            <ThemedText style={styles.itemTitle}>{title} Phrase {i}</ThemedText>
            <ThemedText style={styles.itemSub}>Used in common daily conversations.</ThemedText>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{type?.toString().replace('_', ' ')}</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {type === 'VOCABULARY' && renderVocabulary()}
      {type === 'FLASHCARDS' && renderFlashcards()}
      {type === 'IDIOMS' && renderGenericList('Idiom', 'chatbubbles', Colors.primaryAccent)}
      {type === 'PHRASAL_VERBS' && renderGenericList('Verb', 'book', ThemeColors.dark.error)}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  vocabRow: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  vocabInfo: {
    flex: 1,
  },
  vocabWord: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  vocabSub: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  vocabTranslation: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  flashcardContainer: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  flashcard: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.cardBg,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.elevatedSurface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  flashcardFlipped: {
    borderColor: Colors.secondaryAccent,
  },
  cardText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryText,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  flipLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 40,
    position: 'absolute',
    bottom: 40,
  },
  cardControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginTop: 40,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  listItem: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    marginLeft: 16,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  itemSub: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
});
