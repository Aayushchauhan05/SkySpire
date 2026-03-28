import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';

const { width } = Dimensions.get('window');

// Restored Premium Matte Colors + Grammar Term Colors
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
  // Grammar Term Specific Colors
  grammar: {
    subject: '#FFB800', // Amber
    verb: '#FF8A66',    // Coral
    object: '#00E5FF',  // Cyan
    adjective: '#9B8AF4',// Purple
    adverb: '#4ADE80',  // Green
    preposition: '#F472B6', // Pink
  }
};

export default function GrammarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showEnglishToggle, setShowEnglishToggle] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [chapterCompleted, setChapterCompleted] = useState(false);

  const handleLongPress = () => {
    setShowNoteModal(true);
  };

  const saveNote = () => {
    Alert.alert('Note Saved', 'Your note has been saved to your Profile -> My Notes.');
    setShowNoteModal(false);
    setCurrentNote('');
  };

  const handleRateDifficulty = (rating: string) => {
    setDifficulty(rating);
    setChapterCompleted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSmall}>
          <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toggleBtn}
          onPress={() => setShowEnglishToggle(!showEnglishToggle)}
        >
          <Ionicons name="swap-horizontal" size={20} color={Colors.primaryAccent} />
          <ThemedText style={{color: Colors.primaryAccent, fontWeight: '700', fontSize: 14}}>
            {showEnglishToggle ? 'EN' : 'ES'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
           <ThemedText style={styles.chapterTag}>UNIT 1 • CHAPTER 2</ThemedText>
           <ThemedText style={styles.heroTitle}>Definite Articles</ThemedText>
           <ThemedText style={styles.heroSubtitle}>Learn how to say "the" in Spanish using el, la, los, and las.</ThemedText>
        </View>

        {/* Structured Explanation */}
        <TouchableOpacity onLongPress={handleLongPress} activeOpacity={0.9} style={styles.textBlock}>
           <ThemedText style={styles.bodyText}>
             In Spanish, unlike in English where we only have one definite article ("the"), there are four different ways to say "the". The article must match the noun in both <ThemedText style={{color: Colors.grammar.subject, fontWeight: '800'}}>gender</ThemedText> (masculine or feminine) and <ThemedText style={{color: Colors.grammar.object, fontWeight: '800'}}>number</ThemedText> (singular or plural).
           </ThemedText>
           <ThemedText style={styles.hintText}>💡 Long press any paragraph to add a study note.</ThemedText>
        </TouchableOpacity>

        {/* Rule Callout Box */}
        <View style={styles.ruleBox}>
           <View style={styles.ruleBoxHeader}>
             <Ionicons name="alert-circle" size={24} color={Colors.white} />
             <ThemedText style={styles.ruleBoxTitle}>The Golden Rule</ThemedText>
           </View>
           <ThemedText style={styles.ruleBoxText}>
             Nouns ending in <ThemedText style={{fontWeight: '800'}}>-o</ThemedText> are typically masculine. Nouns ending in <ThemedText style={{fontWeight: '800'}}>-a</ThemedText> are typically feminine. The article ALWAYS changes to match the noun.
           </ThemedText>
        </View>

        {/* Grammar Conjugation Table */}
        <ThemedText style={styles.sectionTitle}>Definite Articles Table</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
           <View style={styles.table}>
              {/* Header Row */}
              <View style={styles.tableRow}>
                <View style={[styles.tableCellHeader, {width: 120}]}><ThemedText style={styles.tableHeaderText}>Gender</ThemedText></View>
                <View style={[styles.tableCellHeader, {width: 120}]}><ThemedText style={styles.tableHeaderText}>Singular</ThemedText></View>
                <View style={[styles.tableCellHeader, {width: 120}]}><ThemedText style={styles.tableHeaderText}>Plural</ThemedText></View>
              </View>
              {/* Row 1 */}
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, {width: 120}]}><ThemedText style={styles.tableCellDark}>Masculine</ThemedText></View>
                <View style={[styles.tableCell, {width: 120}]}><ThemedText style={[styles.tableCellText, {color: Colors.grammar.verb}]}>el</ThemedText></View>
                <View style={[styles.tableCell, {width: 120}]}><ThemedText style={[styles.tableCellText, {color: Colors.grammar.verb}]}>los</ThemedText></View>
              </View>
              {/* Row 2 */}
              <View style={[styles.tableRow, {borderBottomWidth: 0}]}>
                <View style={[styles.tableCell, {width: 120}]}><ThemedText style={styles.tableCellDark}>Feminine</ThemedText></View>
                <View style={[styles.tableCell, {width: 120}]}><ThemedText style={[styles.tableCellText, {color: Colors.grammar.adjective}]}>la</ThemedText></View>
                <View style={[styles.tableCell, {width: 120}]}><ThemedText style={[styles.tableCellText, {color: Colors.grammar.adjective}]}>las</ThemedText></View>
              </View>
           </View>
        </ScrollView>

        {/* Highlighted Example Sentences with Side-by-Side English Toggle */}
        <ThemedText style={styles.sectionTitle}>Examples</ThemedText>
        
        <View style={styles.exampleCard}>
          <View style={styles.exampleSentenceRow}>
             <ThemedText style={styles.exampleText}>
               <ThemedText style={{color: Colors.grammar.verb, fontWeight: '800'}}>El</ThemedText> chico es alto.
             </ThemedText>
             {showEnglishToggle && (
               <ThemedText style={styles.exampleTranslation}>The boy is tall.</ThemedText>
             )}
          </View>
          <View style={styles.exampleSentenceRow}>
             <ThemedText style={styles.exampleText}>
               <ThemedText style={{color: Colors.grammar.adjective, fontWeight: '800'}}>La</ThemedText> chica es alta.
             </ThemedText>
             {showEnglishToggle && (
               <ThemedText style={styles.exampleTranslation}>The girl is tall.</ThemedText>
             )}
          </View>
        </View>

        {/* Difficulty Rating System */}
        <View style={styles.ratingSection}>
          <ThemedText style={styles.ratingTitle}>How was this lesson?</ThemedText>
          <View style={styles.ratingButtonsRow}>
             <TouchableOpacity 
               style={[styles.ratingBtn, difficulty === 'Too Hard' && styles.ratingBtnActive]}
               onPress={() => handleRateDifficulty('Too Hard')}
             >
               <ThemedText style={[styles.ratingBtnText, difficulty === 'Too Hard' && styles.ratingBtnTextActive]}>Too Hard</ThemedText>
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.ratingBtn, difficulty === 'Just Right' && styles.ratingBtnActive]}
               onPress={() => handleRateDifficulty('Just Right')}
             >
               <ThemedText style={[styles.ratingBtnText, difficulty === 'Just Right' && styles.ratingBtnTextActive]}>Just Right</ThemedText>
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.ratingBtn, difficulty === 'Too Easy' && styles.ratingBtnActive]}
               onPress={() => handleRateDifficulty('Too Easy')}
             >
               <ThemedText style={[styles.ratingBtnText, difficulty === 'Too Easy' && styles.ratingBtnTextActive]}>Too Easy</ThemedText>
             </TouchableOpacity>
          </View>
        </View>

        {/* Conditional Next Chapter & Quiz after completion */}
        {chapterCompleted && (
          <View style={styles.completionDeck}>
            {/* Grand Quiz Action */}
            <TouchableOpacity 
              style={styles.quizCard}
              onPress={() => router.push(`/quiz/${id}` as any)}
              activeOpacity={0.9}
            >
              <View style={styles.quizContent}>
                 <ThemedText style={styles.quizTitleWhite}>Take Chapter Quiz</ThemedText>
                 <ThemedText style={styles.quizSubWhite}>Match logic across 10 Qs</ThemedText>
              </View>
              <View style={styles.quizIconCircle}>
                <Ionicons name="arrow-forward" size={32} color={Colors.primaryAccent} />
              </View>
            </TouchableOpacity>

            {/* Next Recommended Chapter */}
            <ThemedText style={styles.sectionTitle}>Up Next</ThemedText>
            <TouchableOpacity style={styles.nextChCard} onPress={() => router.push('/grammar/1_3' as any)}>
               <View style={styles.nextChLeft}>
                  <Ionicons name="book" size={24} color={Colors.secondaryAccent} />
                  <View style={{marginLeft: 16}}>
                     <ThemedText style={styles.nextChTag}>RECOMMENDED</ThemedText>
                     <ThemedText style={styles.nextChTitle}>Subject Pronouns</ThemedText>
                  </View>
               </View>
               <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Bottom Sheet Modal for Note Taking */}
      <Modal visible={showNoteModal} animationType="slide" transparent>
         <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                 <ThemedText style={styles.modalTitle}>Add Study Note</ThemedText>
                 <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                   <Ionicons name="close" size={28} color={Colors.textMuted} />
                 </TouchableOpacity>
               </View>
               <TextInput 
                 style={styles.noteInput}
                 multiline
                 placeholder="Type your mnemonic or note here..."
                 placeholderTextColor={Colors.textMuted}
                 value={currentNote}
                 onChangeText={setCurrentNote}
                 autoFocus
               />
               <TouchableOpacity style={styles.saveNoteBtn} onPress={saveNote}>
                 <ThemedText style={styles.saveNoteText}>Save to Profile</ThemedText>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>

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
    marginTop: 20,
    marginBottom: 20,
  },
  backBtnSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 138, 102, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 102, 0.3)'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  titleSection: {
    marginBottom: 32,
  },
  chapterTag: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.secondaryAccent,
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textHeader,
    lineHeight: 44,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textMuted,
    lineHeight: 26,
  },
  textBlock: {
    marginBottom: 32,
  },
  bodyText: {
    fontSize: 18,
    color: Colors.textHeader,
    lineHeight: 28,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 12,
    fontStyle: 'italic',
  },
  ruleBox: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  ruleBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ruleBoxTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  ruleBoxText: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 24,
    opacity: 0.95,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 16,
  },
  tableScroll: {
    marginBottom: 32,
  },
  table: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.elevatedSurface,
  },
  tableCellHeader: {
    padding: 16,
    backgroundColor: Colors.elevatedSurface,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textHeader,
    textTransform: 'uppercase',
  },
  tableCell: {
    padding: 16,
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textHeader,
  },
  tableCellDark: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  exampleCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    gap: 16,
  },
  exampleSentenceRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.elevatedSurface,
    paddingBottom: 16,
  },
  exampleText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textHeader,
  },
  exampleTranslation: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  ratingSection: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textHeader,
    marginBottom: 16,
  },
  ratingButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingBtn: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingBtnActive: {
    borderColor: Colors.primaryAccent,
    backgroundColor: 'rgba(255, 138, 102, 0.1)',
  },
  ratingBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  ratingBtnTextActive: {
    color: Colors.primaryAccent,
  },
  completionDeck: {
    marginTop: 16,
  },
  quizCard: {
    backgroundColor: Colors.secondaryAccent,
    borderRadius: 30,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quizContent: {
    flex: 1,
  },
  quizTitleWhite: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 4,
  },
  quizSubWhite: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    fontWeight: '600',
  },
  quizIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextChCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    padding: 20,
    borderRadius: 24,
  },
  nextChLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextChTag: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.secondaryAccent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  nextChTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textHeader,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textHeader,
  },
  noteInput: {
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 16,
    padding: 16,
    color: Colors.textHeader,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveNoteBtn: {
    backgroundColor: Colors.amber,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveNoteText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textDark,
  }
});
