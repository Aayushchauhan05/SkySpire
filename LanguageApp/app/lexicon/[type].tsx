import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

// Restored Premium Matte Colors
const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',     // Warm coral
  secondaryAccent: '#9B8AF4', // Soft purple
  amber: '#FFB800',
  cyan: '#00E5FF',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#110E1A',
  textMuted: '#8E88B0',
};

const DUMMY_VOCAB = [
  { word: "Hola", translation: "Hello", level: "Lv.1", category: "Greetings" },
  { word: "Gracias", translation: "Thank you", level: "Lv.1", category: "Greetings" },
  { word: "Desarrollar", translation: "Develop", level: "Lv.2", category: "Daily" },
  { word: "Biblioteca", translation: "Library", level: "Lv.2", category: "Places" },
  { word: "Desafortunadamente", translation: "Unfortunately", level: "Lv.3", category: "Adverbs" },
];

const FLASHCARDS = [
  { front: "The Morning", back: "La Mañana" },
  { front: "To Eat", back: "Comer" },
  { front: "Yellow", back: "Amarillo" },
];

export default function LexiconDetailScreen() {
  const { type } = useLocalSearchParams<{type: string}>();
  const router = useRouter();
  
  const saveWordToVault = useAppStore(state => state.saveWordToVault);
  const savedWords = useAppStore(state => state.savedWords);

  const [flipped, setFlipped] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  const getThemeColor = () => {
    if (type === 'FLASHCARDS') return '#F4A261'; // Peach mapping from Home
    if (type === 'VOCABULARY') return Colors.secondaryAccent; // Soft Purple
    return Colors.amber; // Idioms / default
  };

  const themeColor = getThemeColor();

  const handleBack = () => {
    // Return to the Lexicon Hub explicitly so we don't accidentally fall out of the stack
    router.push('/lexicon/index' as any);
  };

  const renderVocabulary = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {DUMMY_VOCAB.map((item, idx) => {
        const isSaved = savedWords.some(w => w.word === item.word);
        return (
        <View key={idx} style={styles.vocabRow}>
          <View style={styles.vocabInfo}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
               <ThemedText style={styles.vocabWord}>{item.word}</ThemedText>
               <TouchableOpacity style={{marginLeft: 8, padding: 4}} activeOpacity={0.6}>
                  <Ionicons name="volume-medium" size={18} color={themeColor} />
               </TouchableOpacity>
            </View>
            <ThemedText style={styles.vocabSub}>{item.category}</ThemedText>
          </View>

          <View style={{alignItems: 'flex-end', flexDirection: 'row', gap: 16}}>
             <View style={{alignItems: 'flex-end'}}>
                <ThemedText style={[styles.vocabTranslation, { color: themeColor }]}>{item.translation}</ThemedText>
                <View style={styles.levelBadgeMini}>
                   <ThemedText style={styles.levelBadgeText}>{item.level}</ThemedText>
                </View>
             </View>
             <TouchableOpacity 
                style={[styles.addToListBtn, isSaved && {backgroundColor: Colors.secondaryAccent}]}
                onPress={() => saveWordToVault(item)}
                disabled={isSaved}
             >
                <Ionicons name={isSaved ? "checkmark" : "add"} size={20} color={Colors.white} />
             </TouchableOpacity>
          </View>
        </View>
        );
      })}

      {/* Mini Quiz CTA */}
      <TouchableOpacity 
        style={[styles.miniQuizCard, { borderColor: themeColor }]}
        onPress={() => router.push(`/quiz/${type}` as any)}
        activeOpacity={0.9}
      >
        <View style={[styles.quizIconWrap, { backgroundColor: themeColor + '20' }]}>
           <Ionicons name="star" size={28} color={themeColor} />
        </View>
        <View style={{flex: 1, marginLeft: 16}}>
           <ThemedText style={styles.quizTitle}>Category Mini-Quiz</ThemedText>
           <ThemedText style={styles.quizSub}>Test your retention on {DUMMY_VOCAB.length} terms</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderFlashcards = () => (
    <View style={styles.flashcardContainer}>
      <TouchableOpacity 
        style={[styles.flashcard, flipped && { borderColor: themeColor, backgroundColor: 'rgba(244, 162, 97, 0.05)' }]} 
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
          <Ionicons name="chevron-back" size={32} color={Colors.white} />
        </TouchableOpacity>
        
        <View style={styles.counterPill}>
          <ThemedText style={styles.counterText}>{cardIdx + 1} / {FLASHCARDS.length}</ThemedText>
        </View>

        <TouchableOpacity 
          style={styles.controlBtn} 
          onPress={() => { setFlipped(false); setCardIdx((cardIdx + 1) % FLASHCARDS.length); }}
        >
          <Ionicons name="chevron-forward" size={32} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGenericList = (title: string, icon: any, color: string) => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.vocabRow}>
          <View style={[styles.itemIcon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
            <Ionicons name={icon} size={28} color={color} />
          </View>
          <View style={styles.itemInfo}>
            <ThemedText style={styles.itemTitle}>{title} Expression {i}</ThemedText>
            <ThemedText style={styles.itemSubText}>Used in daily conversation.</ThemedText>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{type?.replace('_', ' ')}</ThemedText>
        <View style={{ width: 56 }} />
      </View>

      {type !== 'FLASHCARDS' && type !== 'IDIOMS' && type !== 'PHRASAL_VERBS' && renderVocabulary()}
      {type === 'FLASHCARDS' && renderFlashcards()}
      {type === 'IDIOMS' && renderGenericList('Idiom', 'chatbubbles', Colors.amber)}
      {type === 'PHRASAL_VERBS' && renderGenericList('Verb', 'book', Colors.cyan)}
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
    paddingBottom: 24,
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textHeader,
    textTransform: 'capitalize',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  vocabRow: {
    backgroundColor: Colors.cardBg,
    borderRadius: 35,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vocabInfo: {
    flex: 1,
  },
  vocabWord: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 6,
  },
  vocabSub: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  vocabTranslation: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  levelBadgeMini: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    color: Colors.textHeader,
    fontWeight: '800',
  },
  flashcardContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 60,
    paddingTop: 20,
    justifyContent: 'center',
  },
  flashcard: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.cardBg,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
  },
  cardText: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.textHeader,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: -1,
  },
  flipLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '800',
    letterSpacing: 2,
    position: 'absolute',
    bottom: 40,
  },
  cardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  controlBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterPill: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  counterText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textDark,
  },
  itemIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    marginLeft: 16,
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 4,
  },
  itemSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  addToListBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniQuizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
  },
  quizIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 4,
  },
  quizSub: {
    fontSize: 13,
    color: Colors.textMuted,
  }
});
