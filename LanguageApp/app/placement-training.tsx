import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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

const TRAINING_MODULES = [
  {
    id: 1,
    title: 'Grammar Fundamentals',
    desc: 'Master basic sentence structures and verb conjugations.',
    icon: 'book-outline',
    duration: '15 mins',
    status: 'In Progress',
    progress: 0.6,
    color: Colors.primaryAccent,
  },
  {
    id: 2,
    title: 'Essential Vocabulary',
    desc: 'Top 500 words for daily communication.',
    icon: 'chatbubble-ellipses-outline',
    duration: '10 mins',
    status: 'Not Started',
    progress: 0,
    color: Colors.secondaryAccent,
  },
  {
    id: 3,
    title: 'Listening Skills',
    desc: 'Understand native speakers in real-world scenarios.',
    icon: 'headset-outline',
    duration: '12 mins',
    status: 'Completed',
    progress: 1,
    color: Colors.amber,
  },
  {
    id: 4,
    title: 'Speaking Proficiency',
    desc: 'Practice pronunciation and common phrases.',
    icon: 'mic-outline',
    duration: '8 mins',
    status: 'Review Required',
    progress: 0.3,
    color: Colors.error,
  },
];

export default function PlacementTrainingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Placement Training</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Refine Your Skills</Text>
          <Text style={styles.heroSub}>
            Complete these modules to ensure a more accurate placement result.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>Your Progress</Text>

        {TRAINING_MODULES.map((module) => (
          <TouchableOpacity 
            key={module.id} 
            style={styles.moduleCard}
            onPress={() => {}} 
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: module.color + '15' }]}>
              <Ionicons name={module.icon as any} size={28} color={module.color} />
            </View>
            
            <View style={styles.moduleInfo}>
              <View style={styles.moduleHeaderRow}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={[styles.durationText, { color: Colors.secondaryText }]}>
                  {module.duration}
                </Text>
              </View>
              
              <Text style={styles.moduleDesc}>{module.desc}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${module.progress * 100}%`, backgroundColor: module.color }
                    ]} 
                  />
                </View>
                <Text style={[styles.statusText, { color: module.progress === 1 ? Colors.primaryAccent : Colors.secondaryText }]}>
                  {module.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.examCta}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.examCtaText}>Ready for Placement Test</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.mainBg} />
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
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
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
  heroSection: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 32,
    backgroundColor: Colors.cardBg,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryAccent,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 16,
    marginLeft: 4,
  },
  moduleCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moduleDesc: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },
  examCta: {
    backgroundColor: Colors.primaryAccent,
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  examCtaText: {
    color: Colors.mainBg,
    fontSize: 18,
    fontWeight: '800',
  },
});
