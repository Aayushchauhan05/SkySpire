import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';

const { width } = Dimensions.get('window');

// Restored Premium Matte Colors
const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',     // Warm coral
  secondaryAccent: '#9B8AF4', // Soft purple
  amber: '#FFB800',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#110E1A',
  textMuted: '#8E88B0',
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
  const [chapter, setChapter] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>(DUMMY_LECTURES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

  const toggleComplete = (lectureId: number) => {
    setLectures(prev => prev.map(l => 
      l.id === lectureId ? { ...l, completed: !l.completed } : l
    ));
  };

  useEffect(() => {
    const fetchChapter = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/chapters/${encodeURIComponent(id as string)}`);
        if (!res.ok) throw new Error(`Failed to load chapter: ${res.status}`);

        const data = await res.json();
        setChapter(data);

        if (data.lectures && Array.isArray(data.lectures)) {
          setLectures(data.lectures);
        } else {
          setLectures(DUMMY_LECTURES);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch chapter data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
  }, [id, API_BASE_URL]);

  const completedCount = lectures.filter(l => l.completed).length;
  const progressPercent = Math.round((completedCount / lectures.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Simple Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSmall}>
            <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primaryAccent} />
          </View>
        )}

        {error && (
          <View style={{ paddingVertical: 16 }}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {/* Massive Video Player */}
        <View style={styles.videoCard}>
          <View style={styles.videoPlaceholder}>
            <View style={styles.playButtonCircle}>
              <Ionicons name="play" size={48} color={Colors.white} style={{ marginLeft: 6 }} />
            </View>
          </View>
          <View style={styles.videoInfo}>
            <ThemedText style={styles.videoTitle}>{chapter?.title || 'Basics of Greetings'}</ThemedText>
            <ThemedText style={styles.videoSub}>{chapter?.videoTitle || 'Introduction to Greetings'} • {chapter?.videoDuration || '5:24'}</ThemedText>
          </View>
        </View>

        {/* Round Progress Overview */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressTitle}>Your Progress</ThemedText>
            <View style={styles.metaPill}>
               <ThemedText style={styles.progressMeta}>{completedCount}/{lectures.length}</ThemedText>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
           <ThemedText style={styles.sectionTitle}>Lectures & Study</ThemedText>
        </View>

        {/* Chunky Lecture List */}
        {lectures.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.lectureCard, item.completed && styles.lectureCardCompleted]}
            onPress={() => toggleComplete(item.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.lectureIconBox, item.completed && { backgroundColor: Colors.secondaryAccent }]}>
               {item.completed ? (
                 <Ionicons name="checkmark" size={28} color={Colors.white} />
               ) : (
                 <Ionicons name="play" size={24} color={Colors.white} />
               )}
            </View>
            <View style={styles.lectureInfo}>
              <ThemedText style={[styles.lectureTitle, item.completed && { color: Colors.textMuted }]}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.lectureDuration}>{item.duration} mins</ThemedText>
            </View>
          </TouchableOpacity>
        ))}

        {/* Study Note Card */}
        <View style={styles.studyNoteCard}>
          <View style={styles.noteHeader}>
            <MaterialCommunityIcons name="pencil-circle" size={32} color={Colors.amber} />
            <ThemedText style={styles.noteTag}>STUDY NOTE</ThemedText>
          </View>
          <ThemedText style={styles.noteTitle}>The Difference between 'Hola' and 'Buenos Días'</ThemedText>
          <ThemedText style={styles.noteBody}>
            While 'Hola' is used at any time of day for informal greetings, 'Buenos Días' is specifically used in the morning until midday.
          </ThemedText>
        </View>

        {/* Grand Quiz Action */}
        <TouchableOpacity 
          style={styles.quizCard}
          onPress={() => router.push(`/quiz/${chapter?.id || id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.quizContent}>
             <ThemedText style={styles.quizTitleWhite}>Take Chapter Quiz</ThemedText>
             <ThemedText style={styles.quizSubWhite}>Test knowledge and earn 50 XP</ThemedText>
          </View>
          <View style={styles.quizIconCircle}>
            <Ionicons name="arrow-forward" size={32} color={Colors.primaryAccent} />
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
  header: {
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  videoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 24,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.secondaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 24,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 8,
  },
  videoSub: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: 35,
    padding: 24,
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textDark,
  },
  metaPill: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressMeta: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 6,
  },
  progressBarFill: {
    height: 12,
    backgroundColor: Colors.primaryAccent,
    borderRadius: 6,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textHeader,
    letterSpacing: -0.5,
  },
  lectureCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lectureCardCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  lectureIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lectureInfo: {
    flex: 1,
    marginLeft: 16,
  },
  lectureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textHeader,
  },
  lectureDuration: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  studyNoteCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 35,
    padding: 32,
    marginTop: 20,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  noteTag: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.amber,
  },
  noteTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 12,
    lineHeight: 28,
  },
  noteBody: {
    fontSize: 16,
    color: Colors.textMuted,
    lineHeight: 26,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5C7A',
  },
  quizCard: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 40,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 20,
    height: 160,
  },
  quizContent: {
    flex: 1,
  },
  quizTitleWhite: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 32,
  },
  quizSubWhite: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    fontWeight: '600',
    marginTop: 8,
  },
  quizIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
