import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  elevatedSurface: '#F3F4F6',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
};

export default function ExamScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
        <Text style={styles.headerSub}>Verify your progress</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainExamCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>UPCOMING</Text>
          </View>
          <Text style={styles.examTitle}>Placement Test</Text>
          <Text style={styles.examDesc}>
            Determine your starting level by taking our quick assessment.
          </Text>
          <TouchableOpacity 
            style={styles.startBtn}
            onPress={() => router.push('/placement-training' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Past Exams</Text>
        
        {/* Dummy Past Exams */}
        {[ 
          { id: 1, title: 'A1 Basics', score: '92%', status: 'Passed', icon: 'checkmark-circle' },
          { id: 2, title: 'Greetings Quiz', score: '100%', status: 'Passed', icon: 'star' },
          { id: 3, title: 'Vocabulary Check', score: '65%', status: 'Retake', icon: 'refresh' }
        ].map((exam, i) => (
          <TouchableOpacity 
            key={exam.id} 
            style={styles.pastExamCard}
            activeOpacity={0.8}
          >
            <View style={styles.examIconWrap}>
              <Ionicons 
                name={exam.icon as any} 
                size={24} 
                color={exam.status === 'Retake' ? Colors.secondaryAccent : Colors.primaryAccent} 
              />
            </View>
            <View style={styles.pastExamInfo}>
              <Text style={styles.pastExamTitle}>{exam.title}</Text>
              <Text style={styles.pastExamScore}>Score: {exam.score}</Text>
            </View>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: exam.status === 'Retake' ? 'rgba(244, 147, 32, 0.1)' : 'rgba(37, 157, 122, 0.1)' }
              ]}
            >
              <Text 
                style={[
                  styles.statusBadgeText, 
                  { color: exam.status === 'Retake' ? Colors.secondaryAccent : Colors.primaryAccent }
                ]}
              >
                {exam.status}
              </Text>
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
    backgroundColor: Colors.mainBg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  mainExamCard: {
    backgroundColor: Colors.primaryAccent,
    padding: 24,
    borderRadius: 32,
    marginBottom: 32,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  examTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  examDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    fontWeight: '500',
  },
  startBtn: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  startBtnText: {
    color: Colors.primaryAccent,
    fontWeight: '900',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 16,
  },
  pastExamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  examIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pastExamInfo: {
    flex: 1,
  },
  pastExamTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  pastExamScore: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
