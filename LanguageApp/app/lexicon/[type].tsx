import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { useAppStore } from '../../store/useAppStore';
import { useLexiconStore } from '../../store/useLexiconStore';

const { width } = Dimensions.get('window');

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
  error: '#FF5C7A',
};

const slugToTopic: Record<string, string> = {
  greetings: 'Greetings',
  numbers_time: 'Numbers',
  food_dining: 'Food and Drink',
  travel_directions: 'Transport',
  family_people: 'Family',
  home_daily: 'Home',
  health_body: 'Body Parts',
  shopping_clothes: 'Clothing',
  nature_weather: 'Weather',
  work_school: 'Work & School'
};

export default function LexiconDetailScreen() {
  const { type } = useLocalSearchParams<{type: string}>();
  const router = useRouter();
  
  const saveWordToVault = useAppStore(state => state.saveWordToVault);
  const savedWords = useAppStore(state => state.savedWords);
  
  const { entries, isLoading, error, fetchEntries } = useLexiconStore();

  const dbTopic = slugToTopic[type || ''] || type?.replace('_', ' ') || 'Vocabulary';

  useEffect(() => {
    // Determine category based on type if needed, assume words for default UI
    const category = type === 'expressions' ? 'expressions' : 'words';
    fetchEntries('fr', category, 'A1', dbTopic);
  }, [type]);

  const themeColor = Colors.secondaryAccent;

  const handleBack = () => {
    router.push('/lexicon/index' as any);
  };

  const renderSkeleton = () => (
    <View style={{ padding: 20, gap: 16 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={[styles.vocabRow, { opacity: 0.3 }]} />
      ))}
    </View>
  );

  const renderError = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
      <ThemedText style={{ color: Colors.textHeader, fontSize: 18, marginTop: 16, marginBottom: 8 }}>Failed to load lexicon</ThemedText>
      <ThemedText style={{ color: Colors.textMuted, textAlign: 'center', marginBottom: 24 }}>{error}</ThemedText>
      <TouchableOpacity 
        style={{ backgroundColor: themeColor, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }} 
        onPress={() => fetchEntries('fr', 'words', 'A1', dbTopic)}
      >
         <ThemedText style={{ color: Colors.white, fontWeight: '700' }}>Retry</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderVocabulary = () => {
    if (isLoading) return renderSkeleton();
    if (error) return renderError();

    return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {entries.map((item, idx) => {
        const isSaved = savedWords.some(w => w.word === item.term);
        const isLocked = !item.isFree;

        return (
        <View key={item._id || idx} style={[styles.vocabRow, isLocked && { opacity: 0.6 }]}>
          <View style={styles.vocabInfo}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
               <ThemedText style={styles.vocabWord}>{isLocked ? '••••••••' : item.term}</ThemedText>
               {!isLocked && (
                 <TouchableOpacity style={{marginLeft: 8, padding: 4}} activeOpacity={0.6}>
                    <Ionicons name="volume-medium" size={18} color={themeColor} />
                 </TouchableOpacity>
               )}
            </View>
            <ThemedText style={styles.vocabSub}>{isLocked ? 'Unlock to view definition' : item.definition}</ThemedText>
          </View>

          <View style={{alignItems: 'flex-end', flexDirection: 'row', gap: 16}}>
             <View style={{alignItems: 'flex-end'}}>
                <ThemedText style={[styles.vocabTranslation, { color: themeColor }]}>{isLocked ? 'Locked' : item.translation}</ThemedText>
                <View style={styles.levelBadgeMini}>
                   <ThemedText style={styles.levelBadgeText}>{item.level || 'A1'}</ThemedText>
                </View>
             </View>
             {!isLocked ? (
               <TouchableOpacity 
                  style={[styles.addToListBtn, isSaved && {backgroundColor: Colors.secondaryAccent}]}
                  onPress={() => saveWordToVault({ word: item.term, translation: item.translation, level: item.level, category: item.topic })}
                  disabled={isSaved}
               >
                  <Ionicons name={isSaved ? "checkmark" : "add"} size={20} color={Colors.white} />
               </TouchableOpacity>
             ) : (
                <View style={[styles.addToListBtn, {backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.textMuted}]}>
                   <Ionicons name="lock-closed" size={16} color={Colors.textMuted} />
                </View>
             )}
          </View>
        </View>
        );
      })}

      {!isLoading && !error && entries.length > 0 && (
        <TouchableOpacity 
          style={[styles.miniQuizCard, { borderColor: themeColor }]}
          onPress={() => router.push(`/quiz/lexicon?topic=${dbTopic}` as any)}
          activeOpacity={0.9}
        >
          <View style={[styles.quizIconWrap, { backgroundColor: themeColor + '20' }]}>
             <Ionicons name="star" size={28} color={themeColor} />
          </View>
          <View style={{flex: 1, marginLeft: 16}}>
             <ThemedText style={styles.quizTitle}>Category Mini-Quiz</ThemedText>
             <ThemedText style={styles.quizSub}>Test your retention on {entries.length} terms</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{dbTopic}</ThemedText>
        <View style={{ width: 56 }} />
      </View>

      {renderVocabulary()}
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
    minHeight: 120, // keeps skeleton height stable
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
