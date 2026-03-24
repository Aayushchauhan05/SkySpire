import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { Colors as ThemeColors } from '../../constants/theme';

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

const MODULE_DATA: any = {
  'SURVIVAL': {
    title: 'Survival Path',
    color: Colors.secondaryAccent,
    lessons: ['Ordering Coffee', 'Asking for Directions', 'Check-in at Hotel', 'Basic Feelings']
  },
  'CONFIDENCE': {
    title: 'Confidence Builder',
    color: Colors.primaryAccent,
    lessons: ['Expressing Opinions', 'Work Meetings', 'Family Traditions', 'Past Holidays']
  },
  'FLUENCY': {
    title: 'Fluency Track',
    color: Colors.amber,
    lessons: ['Complex Issues', 'Technical Terms', 'Native Jokes', 'Debating News']
  },
  'MASTERY': {
    title: 'Mastery Circle',
    color: ThemeColors.dark.error,
    lessons: ['Abstract Concepts', 'Classical Literature', 'Political Speech', 'Poetry']
  }
};

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const module = MODULE_DATA[id as string] || MODULE_DATA['SURVIVAL'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{module.title}</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroBanner, { backgroundColor: module.color }]}>
          <ThemedText style={styles.heroTitle}>Master the {id} stage</ThemedText>
          <ThemedText style={styles.heroSub}>{module.lessons.length} Essential Lessons</ThemedText>
        </View>

        <ThemedText style={styles.sectionTitle}>Curriculum</ThemedText>
        
        {module.lessons.map((lesson: string, idx: number) => (
          <TouchableOpacity key={idx} style={styles.lessonCard}>
            <View style={styles.lessonNumber}>
              <ThemedText style={styles.numberText}>{idx + 1}</ThemedText>
            </View>
            <View style={styles.lessonInfo}>
              <ThemedText style={styles.lessonTitle}>{lesson}</ThemedText>
              <ThemedText style={styles.lessonSub}>15-20 mins • Interative</ThemedText>
            </View>
            <Ionicons name="play-circle" size={32} color={module.color} />
          </TouchableOpacity>
        ))}
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroBanner: {
    width: '100%',
    padding: 32,
    borderRadius: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#110E1A',
  },
  heroSub: {
    fontSize: 16,
    color: '#110E1A',
    opacity: 0.8,
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 16,
    marginLeft: 4,
  },
  lessonCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  lessonInfo: {
    flex: 1,
    marginLeft: 16,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  lessonSub: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
});
