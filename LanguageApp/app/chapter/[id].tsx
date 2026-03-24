import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { Colors as ThemeColors } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Premium warm palette derived from theme (using global constants)
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
};

const DUMMY_LECTURES = [
  { id: 1, title: 'Introduction to Greetings', duration: '5:24', completed: true },
  { id: 2, title: 'Formal vs Informal', duration: '8:12', completed: false },
  { id: 3, title: 'Common Mistakes', duration: '4:45', completed: false },
  { id: 4, title: 'Practice Exercise', duration: '10:00', completed: false },
];

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [lectures, setLectures] = useState<any[]>(DUMMY_LECTURES);

  const toggleComplete = (lectureId: number) => {
    setLectures(prev => prev.map(l => 
      l.id === lectureId ? { ...l, completed: !l.completed } : l
    ));
  };

  const completedCount = lectures.filter(l => l.completed).length;
  const progressPercent = Math.round((completedCount / lectures.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Simple Header Replacement in Header area if needed, but per request remove header */}
        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSmall}>
            <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>

        
        {/* Video Placeholder */}
        <View style={styles.videoCard}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play" size={48} color={Colors.primaryAccent} />
          </View>
          <View style={styles.videoInfo}>
            <ThemedText style={styles.videoTitle}>Basics of Greetings</ThemedText>
            <ThemedText style={styles.videoSub}>Lesson 1 • 5:24 mins</ThemedText>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressTitle}>Your Progress</ThemedText>
            <ThemedText style={styles.progressMeta}>{completedCount}/{lectures.length} completed</ThemedText>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Study Content Section Header */}
        <View style={styles.sectionHeader}>
           <ThemedText style={styles.sectionTitle}>Lectures & Study</ThemedText>
        </View>

        {/* Dynamic Lecture List */}
        {lectures.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.lectureCard, item.completed && styles.lectureCardCompleted]}
            onPress={() => toggleComplete(item.id)}
          >
            <View style={styles.lectureIconBox}>
               <Ionicons 
                name={item.completed ? "checkmark-circle" : "play-circle-outline"} 
                size={24} 
                color={item.completed ? Colors.secondaryAccent : Colors.primaryAccent} 
               />
            </View>
            <View style={styles.lectureInfo}>
              <ThemedText style={[styles.lectureTitle, item.completed && { opacity: 0.6 }]}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.lectureDuration}>{item.duration} mins</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.completeBtn, item.completed && styles.completeBtnActive]}
              onPress={() => toggleComplete(item.id)}
            >
               <ThemedText style={[styles.completeBtnText, item.completed && { color: Colors.secondaryAccent }]}>
                 {item.completed ? "Done" : "Mark Done"}
               </ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Study Material / Note Card */}
        <View style={styles.studyNoteCard}>
          <View style={styles.noteHeader}>
            <MaterialCommunityIcons name="pencil-outline" size={20} color={Colors.amber} />
            <ThemedText style={styles.noteTag}>STUDY NOTE</ThemedText>
          </View>
          <ThemedText style={styles.noteTitle}>The Difference between 'Hola' and 'Buenos Días'</ThemedText>
          <ThemedText style={styles.noteBody}>
            While 'Hola' is used at any time of day for informal greetings, 'Buenos Días' is specifically used in the morning until midday.
          </ThemedText>
        </View>

        {/* Quiz Button Card */}
        <TouchableOpacity 
          style={styles.quizCard}
          onPress={() => router.push(`/quiz/${id}` as any)}
        >
          <View style={styles.quizIconBox}>
            <MaterialCommunityIcons name="head-question-outline" size={32} color={Colors.primaryText} />
          </View>
          <View style={styles.quizInfo}>
            <ThemedText style={styles.quizTitle}>Chapter Quiz</ThemedText>
            <ThemedText style={styles.quizSub}>Test your knowledge and earn XP</ThemedText>
          </View>
          <View style={styles.startBadge}>
            <ThemedText style={styles.startText}>START</ThemedText>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  backBtnSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  videoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  videoSub: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  progressMeta: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.primaryAccent,
    borderRadius: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  lectureCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  lectureCardCompleted: {
    backgroundColor: 'rgba(155, 138, 244, 0.03)',
  },
  lectureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lectureInfo: {
    flex: 1,
    marginLeft: 16,
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  lectureDuration: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  completeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  },
  completeBtnActive: {
    borderColor: Colors.secondaryAccent + '40',
    backgroundColor: Colors.secondaryAccent + '10',
  },
  completeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.secondaryText,
  },
  studyNoteCard: {
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.1)',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  noteTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.amber,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  noteBody: {
    fontSize: 15,
    color: Colors.secondaryText,
    lineHeight: 22,
    fontWeight: '500',
  },
  quizCard: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  quizIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(17, 14, 26, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizInfo: {
    flex: 1,
    marginLeft: 16,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#110E1A',
  },
  quizSub: {
    fontSize: 13,
    color: '#110E1A',
    opacity: 0.7,
    fontWeight: '600',
    marginTop: 2,
  },
  startBadge: {
    backgroundColor: '#110E1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  startText: {
    color: Colors.primaryAccent,
    fontSize: 12,
    fontWeight: '800',
  },
});
