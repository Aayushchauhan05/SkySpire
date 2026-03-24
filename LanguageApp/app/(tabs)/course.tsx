import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors as ThemeColors } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Dummy logged in state (Logic Restoration)
const isLoggedIn = false;

// Theme Colors (Warm Palette)
const Colors = {
  mainBg: ThemeColors.dark.background,
  cardBg: ThemeColors.dark.card,
  elevatedSurface: ThemeColors.dark.elevated,
  primaryAccent: ThemeColors.dark.primary,     // Warm coral
  secondaryAccent: ThemeColors.dark.secondary, // Soft purple
  amber: ThemeColors.dark.accent,
  error: ThemeColors.dark.error,
  primaryText: ThemeColors.dark.text,
  secondaryText: ThemeColors.dark.secondaryText,
  // Section Specific (Warm & Smooth)
  grammar: {
    bg: 'rgba(255, 138, 102, 0.15)',
    accent: '#FF8A66',
    surface: '#2D1F1A',
  },
  lexicon: {
    bg: 'rgba(244, 162, 97, 0.15)',
    accent: '#F4A261',
    surface: '#2D241E', // Slightly more brownish/peachy dark
  },
  modules: {
    bg: 'rgba(155, 138, 244, 0.15)',
    accent: '#9B8AF4',
    surface: '#1F1A2D',
  }
};

const GRAMMAR_UNITS = [
  { id: 1, title: 'Basics & Nouns', chapters: 4 },
  { id: 2, title: 'Present Tense', chapters: 5 },
  { id: 3, title: 'Adjectives', chapters: 3 },
];

export default function CourseScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'GRAMMAR' | 'LEXICON' | 'MODULES'>('GRAMMAR');

  const renderGrammar = () => (
    <View style={styles.sectionContainer}>
      {GRAMMAR_UNITS.map((unit, uIdx) => (
        <View key={unit.id} style={styles.unitContainer}>
          <ThemedText style={[styles.unitTitle, { color: Colors.grammar.accent }]}>Unit {unit.id}: {unit.title}</ThemedText>
          {Array.from({ length: unit.chapters }).map((_, cIdx) => {
            const chapterNum = cIdx + 1;
            const isFree = unit.id === 1 && chapterNum === 1;
            const isLocked = !isLoggedIn && !isFree;

            return (
              <TouchableOpacity 
                key={chapterNum} 
                style={[
                  styles.chapterCard, 
                  isLocked && styles.chapterCardLocked,
                  { backgroundColor: Colors.grammar.surface, borderColor: 'rgba(255, 138, 102, 0.2)' }
                ]}
                disabled={isLocked}
                onPress={() => router.push(`/chapter/${unit.id}_${chapterNum}` as any)}
              >
                <View style={styles.chapterInfo}>
                  <View style={[styles.chapterIconWrapper, { backgroundColor: Colors.grammar.bg }]}>
                    <Ionicons 
                      name={isLocked ? "lock-closed" : "book"} 
                      size={20} 
                      color={isLocked ? Colors.secondaryText : Colors.grammar.accent} 
                    />
                  </View>
                  <View>
                    <ThemedText style={[styles.chapterTitle, isLocked && { color: Colors.secondaryText }]}>
                      Chapter {chapterNum}
                    </ThemedText>
                    {isFree && !isLoggedIn && (
                      <ThemedText style={[styles.freeBadge, { color: Colors.grammar.accent }]}>FREE</ThemedText>
                    )}
                  </View>
                </View>
                {!isLocked && (
                  <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );

  const renderLexicon = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.lexiconGrid}>
        <TouchableOpacity 
          style={[styles.lexiconCard, { backgroundColor: Colors.lexicon.surface, borderColor: 'rgba(244, 162, 97, 0.2)' }]} 
          onPress={() => router.push('/lexicon/VOCABULARY' as any)}
        >
          <View style={[styles.lexiconIconWrapper, { backgroundColor: Colors.lexicon.bg }]}>
            <MaterialCommunityIcons name="format-letter-case" size={28} color={Colors.lexicon.accent} />
          </View>
          <ThemedText style={styles.lexiconTitle}>Vocabulary</ThemedText>
          <ThemedText style={styles.lexiconSub}>A1 - C2 Levels</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.lexiconCard, { backgroundColor: Colors.lexicon.surface, borderColor: 'rgba(244, 162, 97, 0.2)' }]} 
          onPress={() => router.push('/lexicon/FLASHCARDS' as any)}
        >
          <View style={[styles.lexiconIconWrapper, { backgroundColor: 'rgba(255, 184, 0, 0.1)' }]}>
            <MaterialCommunityIcons name="cards-outline" size={28} color={Colors.amber} />
          </View>
          <ThemedText style={styles.lexiconTitle}>Flashcards</ThemedText>
          <ThemedText style={styles.lexiconSub}>Spaced Repetition</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.lexiconCard, { backgroundColor: Colors.lexicon.surface, borderColor: 'rgba(244, 162, 97, 0.2)' }]} 
          onPress={() => router.push('/lexicon/IDIOMS' as any)}
        >
          <View style={[styles.lexiconIconWrapper, { backgroundColor: 'rgba(255, 138, 102, 0.1)' }]}>
            <Ionicons name="chatbubbles" size={28} color={Colors.primaryAccent} />
          </View>
          <ThemedText style={styles.lexiconTitle}>Idioms</ThemedText>
          <ThemedText style={styles.lexiconSub}>Native expressions</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.lexiconCard, { backgroundColor: Colors.lexicon.surface, borderColor: 'rgba(255, 138, 102, 0.2)', opacity: 0.7 }]} 
          onPress={() => router.push('/lexicon/PHRASAL_VERBS' as any)}
        >
          <View style={[styles.lexiconIconWrapper, { backgroundColor: 'rgba(255, 92, 122, 0.1)' }]}>
            <Ionicons name="book" size={28} color={Colors.error} />
          </View>
          <ThemedText style={styles.lexiconTitle}>Phrasal Verbs</ThemedText>
          <ThemedText style={styles.lexiconSub}>Usage contexts</ThemedText>
          <View style={styles.lockIconOverlay}>
             <Ionicons name="lock-closed" size={12} color={Colors.secondaryText} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModules = () => (
    <View style={styles.sectionContainer}>
      {[
        { title: 'Survival', desc: 'Introductions, Greetings, basic needs', color: Colors.secondaryAccent, icon: 'shield-star' },
        { title: 'Confidence', desc: 'Daily routine, family, shopping', color: Colors.primaryAccent, icon: 'flash' },
        { title: 'Fluency', desc: 'Work, travel experiences, opinions', color: Colors.amber, icon: 'water' },
        { title: 'Mastery', desc: 'Debate, culture, abstract ideas', color: Colors.error, icon: 'crown' }
      ].map((mod, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={[styles.moduleCard, { backgroundColor: Colors.modules.surface, borderColor: 'rgba(155, 138, 244, 0.2)' }]}
          onPress={() => router.push(`/module/${mod.title.toUpperCase()}` as any)}
        >
          <View style={[styles.moduleIconWrapper, { backgroundColor: `${mod.color}20` }]}>
            <MaterialCommunityIcons name={mod.icon as any} size={24} color={mod.color} />
          </View>
          <View style={styles.moduleContent}>
            <ThemedText style={styles.moduleTitle}>{mod.title}</ThemedText>
            <ThemedText style={styles.moduleSub}>{mod.desc}</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.secondaryText} />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Curriculum</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* FUN FACT CARD */}
        <View style={styles.funFactCard}>
          <View style={styles.funFactHeader}>
            <Ionicons name="bulb" size={20} color={Colors.amber} />
            <ThemedText style={styles.funFactTag}>FUN FACT</ThemedText>
          </View>
          <ThemedText style={styles.funFactText}>
            Spanish is the second most spoken native language in the world, with over 480 million native speakers.
          </ThemedText>
        </View>

        {/* CUSTOM TABS / CATEGORY CARDS */}
        <View style={styles.categoryRow}>
          {[
            { id: 'GRAMMAR', color: Colors.grammar.accent, bg: Colors.grammar.bg, icon: 'book-outline', surface: Colors.grammar.surface },
            { id: 'LEXICON', color: Colors.lexicon.accent, bg: Colors.lexicon.bg, icon: 'language-outline', surface: Colors.lexicon.surface },
            { id: 'MODULES', color: Colors.modules.accent, bg: Colors.modules.bg, icon: 'layers-outline', surface: Colors.modules.surface },
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.id} 
              style={[
                styles.categoryCard, 
                { backgroundColor: tab.surface, borderColor: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.05)' },
                activeTab === tab.id && styles.categoryCardActive
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: tab.bg }]}>
                <Ionicons name={tab.icon as any} size={20} color={tab.color} />
              </View>
              <ThemedText style={[
                styles.categoryText, 
                { color: activeTab === tab.id ? tab.color : Colors.secondaryText }
              ]}>
                {tab.id.charAt(0) + tab.id.slice(1).toLowerCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* CONTENT AREA */}
        <View style={styles.contentArea}>
          {activeTab === 'GRAMMAR' && renderGrammar()}
          {activeTab === 'LEXICON' && renderLexicon()}
          {activeTab === 'MODULES' && renderModules()}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  funFactCard: {
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.2)',
  },
  funFactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  funFactTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.amber,
  },
  funFactText: {
    fontSize: 15,
    color: Colors.primaryText,
    lineHeight: 22,
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: Colors.cardBg,
  },
  categoryCardActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
  },
  sectionContainer: {
    flex: 1,
  },
  unitContainer: {
    marginBottom: 24,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  chapterCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  chapterCardLocked: {
    opacity: 0.6,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chapterIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  freeBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lexiconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  lexiconCard: {
    width: (width - 56) / 2,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  lexiconIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lexiconTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  lexiconSub: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  lockIconOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  moduleCard: {
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
  },
  moduleIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  moduleSub: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});
