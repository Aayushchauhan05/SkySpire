import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, BookOpenText, CheckCircle, LockKey } from 'phosphor-react-native';

const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66', // Warm Coral
  secondaryAccent: '#9B8AF4', // Soft Purple
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#F0EEF8',
  secondaryText: '#8E88B0',
};

const GRAMMAR_UNITS = [
  {
    id: 1,
    title: 'Foundations',
    description: 'Nouns, Gender & Basic Greetings',
    chapters: [
      { id: '1_1', title: 'Nouns & Gender', isFree: true, completed: true },
      { id: '1_2', title: 'Definite Articles', isFree: true, completed: false },
      { id: '1_3', title: 'Subject Pronouns', isFree: false, completed: false },
    ],
  },
  {
    id: 2,
    title: 'Present Tense Core',
    description: 'Regular Verbs & Sentence Structure',
    chapters: [
      { id: '2_1', title: 'AR Verbs', isFree: false, completed: false },
      { id: '2_2', title: 'ER & IR Verbs', isFree: false, completed: false },
      { id: '2_3', title: 'Question Words', isFree: false, completed: false },
    ],
  },
];

export default function GrammarScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grammar</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {GRAMMAR_UNITS.map((unit) => (
          <View key={unit.id} style={styles.unitContainer}>
            <View style={styles.unitHeader}>
              <View>
                <Text style={styles.unitTitle}>Unit {unit.id}</Text>
                <Text style={styles.unitDesc}>{unit.title}</Text>
              </View>
              <View style={styles.unitIconContainer}>
                <BookOpenText size={24} color={Colors.primaryAccent} weight="duotone" />
              </View>
            </View>

            {unit.chapters.map((chapter) => {
              const isLocked = !chapter.isFree && !chapter.completed;
              return (
                <TouchableOpacity
                  key={chapter.id}
                  style={[
                    styles.chapterCard,
                    isLocked && styles.chapterCardLocked
                  ]}
                  disabled={isLocked}
                  onPress={() => router.push(`/chapter/${chapter.id}` as any)}
                >
                  <View style={styles.chapterLeft}>
                    <View style={[
                      styles.statusIndicator,
                      chapter.completed && { backgroundColor: 'rgba(155, 138, 244, 0.1)' },
                      isLocked && { backgroundColor: Colors.mainBg }
                    ]}>
                      {chapter.completed ? (
                        <CheckCircle size={20} color={Colors.secondaryAccent} weight="fill" />
                      ) : isLocked ? (
                        <LockKey size={20} color={Colors.secondaryText} weight="bold" />
                      ) : (
                        <View style={styles.statusDot} />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.chapterTitle, isLocked && { color: Colors.secondaryText }]}>
                        {chapter.title}
                      </Text>
                      {chapter.isFree && !chapter.completed && (
                        <Text style={styles.freeBadge}>FREE LESSON</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

import { Text } from 'react-native';

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
    paddingBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
  },
  headerTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  unitContainer: {
    marginBottom: 32,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  unitTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryAccent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  unitDesc: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  unitIconContainer: {
    backgroundColor: 'rgba(255, 138, 102, 0.1)',
    padding: 12,
    borderRadius: 16,
  },
  chapterCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chapterCardLocked: {
    opacity: 0.6,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryText,
  },
  chapterTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  freeBadge: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryAccent,
    letterSpacing: 1,
    marginTop: 4,
  },
});
