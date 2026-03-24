import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function ExamScreen() {
  const router = useRouter();
  const theme = Colors.dark;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: theme.text }}>Assessments</ThemedText>
        <ThemedText style={{ color: theme.secondaryText }}>Verify your progress</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainExamCard, { backgroundColor: theme.primary }]}>
          <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <ThemedText style={{ color: theme.background, fontWeight: '800', fontSize: 12 }}>UPCOMING</ThemedText>
          </View>
          <ThemedText style={[styles.examTitle, { color: theme.background }]}>Placement Test</ThemedText>
          <ThemedText style={[styles.examDesc, { color: 'rgba(17,14,26,0.8)' }]}>
            Determine your starting level by taking our quick assessment.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: theme.background }]}
            onPress={() => router.push('/placement-training' as any)}
          >
            <ThemedText style={{ color: theme.primary, fontWeight: '800' }}>Start Assessment</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText type="subtitle" style={{ color: theme.text, marginBottom: 16 }}>Past Exams</ThemedText>
        
        {/* Dummy Past Exams */}
        {[ 
          { id: 1, title: 'A1 Basics', score: '92%', status: 'Passed', icon: 'checkmark-circle' },
          { id: 2, title: 'Greetings Quiz', score: '100%', status: 'Passed', icon: 'star' },
          { id: 3, title: 'Vocabulary Check', score: '65%', status: 'Retake', icon: 'refresh' }
        ].map((exam, i) => (
          <TouchableOpacity key={exam.id} style={[styles.pastExamCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.examIconWrap, { backgroundColor: theme.elevated }]}>
              <Ionicons name={exam.icon as any} size={24} color={exam.status === 'Retake' ? theme.accent : theme.secondary} />
            </View>
            <View style={styles.pastExamInfo}>
              <ThemedText style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}>{exam.title}</ThemedText>
              <ThemedText style={{ color: theme.secondaryText, fontSize: 13, marginTop: 4 }}>Score: {exam.score}</ThemedText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: exam.status === 'Retake' ? theme.accent + '20' : theme.secondary + '20' }]}>
              <ThemedText style={{ color: exam.status === 'Retake' ? theme.accent : theme.secondary, fontSize: 12, fontWeight: '700' }}>
                {exam.status}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mainExamCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    marginBottom: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  examTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  examDesc: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  startBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastExamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  examIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pastExamInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
