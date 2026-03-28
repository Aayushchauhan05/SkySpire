import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft, PlayCircle, MapTrifold, LockKey } from 'phosphor-react-native';

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

const MODULE_DATA: Record<string, any> = {
  'SURVIVAL': {
    title: 'Survival Path',
    color: Colors.primaryAccent,
    desc: 'Master the absolute basics for traveling and surviving in a new language.',
    lessons: [
      { title: 'Ordering Coffee', duration: '15 mins', locked: false },
      { title: 'Asking for Directions', duration: '20 mins', locked: false },
      { title: 'Check-in at Hotel', duration: '18 mins', locked: true },
      { title: 'Basic Feelings', duration: '12 mins', locked: true }
    ]
  },
  'CONFIDENCE': {
    title: 'Confidence Builder',
    color: Colors.secondaryAccent,
    desc: 'Expand your vocabulary to express opinions and connect with locals.',
    lessons: [
      { title: 'Expressing Opinions', duration: '20 mins', locked: true },
      { title: 'Work Meetings', duration: '25 mins', locked: true },
    ]
  },
  'FLUENCY': {
    title: 'Fluency Track',
    color: Colors.amber,
    desc: 'Speak without hesitation on complex, technical, or abstract topics.',
    lessons: [
      { title: 'Complex Issues', duration: '30 mins', locked: true },
      { title: 'Debating News', duration: '35 mins', locked: true },
    ]
  },
  'MASTERY': {
    title: 'Mastery Circle',
    color: Colors.error,
    desc: 'Reach near-native proficiency with classical literature and poetry.',
    lessons: [
      { title: 'Classical Literature', duration: '40 mins', locked: true },
    ]
  }
};

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const moduleKey = (id as string)?.toUpperCase() || 'SURVIVAL';
  const module = MODULE_DATA[moduleKey] || MODULE_DATA['SURVIVAL'];
  
  const PathColor = module.color;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Module Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.heroBanner, { borderColor: PathColor }]}>
          <View style={[styles.heroIconWrapper, { backgroundColor: PathColor + '20' }]}>
             <MapTrifold size={40} color={PathColor} weight="duotone" />
          </View>
          <Text style={[styles.heroTitle, { color: PathColor }]}>{module.title}</Text>
          <Text style={styles.heroSub}>{module.desc}</Text>
          
          <View style={styles.metaRow}>
             <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{module.lessons.length} Lessons</Text>
             </View>
             <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>Interactive</Text>
             </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Curriculum</Text>
        
        {module.lessons.map((lesson: any, idx: number) => {
          const isLocked = lesson.locked;
          return (
            <TouchableOpacity 
              key={idx} 
              style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
              disabled={isLocked}
            >
              <View style={styles.lessonNumber}>
                <Text style={styles.numberText}>{idx + 1}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={[styles.lessonTitle, isLocked && { color: Colors.secondaryText }]}>
                   {lesson.title}
                </Text>
                <Text style={styles.lessonSub}>{lesson.duration} • Speaking</Text>
              </View>
              {isLocked ? (
                 <LockKey size={28} color={Colors.secondaryText} weight="bold" />
              ) : (
                 <PlayCircle size={32} color={PathColor} weight="fill" />
              )}
            </TouchableOpacity>
          );
        })}
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
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
  heroBanner: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    marginBottom: 32,
    backgroundColor: Colors.elevatedSurface,
    borderTopWidth: 4,
    alignItems: 'center',
  },
  heroIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSub: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    color: Colors.primaryText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  metaBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonCardLocked: {
    backgroundColor: Colors.elevatedSurface,
    opacity: 0.7,
  },
  lessonNumber: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.mainBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  lessonInfo: {
    flex: 1,
    marginLeft: 16,
  },
  lessonTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  lessonSub: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: Colors.secondaryText,
  },
});
