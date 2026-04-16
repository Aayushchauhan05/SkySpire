import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CaretLeft, BookOpenText, CheckCircle, LockKey } from 'phosphor-react-native';
import { useCourseStore } from '../../store/useCourseStore';

const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',
  secondaryAccent: '#9B8AF4',
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#F0EEF8',
  secondaryText: '#8E88B0',
};

export default function CourseScreen() {
  const router = useRouter();
  const { paths, isLoading, error, fetchPaths } = useCourseStore();
  const userId = 'demo_user';

  useEffect(() => {
    // Assuming language 'fr'
    fetchPaths('fr', userId);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Path</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {paths.map((unit) => (
          <View key={unit._id} style={[styles.unitContainer, unit.isLocked && { opacity: 0.5 }]}>
            <View style={styles.unitHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.unitTitle}>Level {unit.order}</Text>
                <Text style={styles.unitDesc}>{unit.title}</Text>
                <Text style={[styles.unitTitle, { fontSize: 12, marginTop: 4, textTransform: 'none', color: Colors.secondaryText }]}>{unit.description}</Text>
              </View>
              <View style={styles.unitIconContainer}>
                {unit.isLocked ? 
                  <LockKey size={24} color={Colors.secondaryText} weight="bold" /> :
                  <BookOpenText size={24} color={Colors.primaryAccent} weight="duotone" />
                }
              </View>
            </View>

            {unit.chapters && unit.chapters.map((chapter: any) => {
              const isLocked = unit.isLocked; 
              return (
                <TouchableOpacity
                  key={chapter._id}
                  style={[
                    styles.chapterCard,
                    isLocked && styles.chapterCardLocked
                  ]}
                  disabled={isLocked}
                  onPress={() => router.push(`/module-lesson/${chapter._id}` as any)}
                >
                  <View style={styles.chapterLeft}>
                    <View style={[
                      styles.statusIndicator,
                      chapter.isCompleted && { backgroundColor: 'rgba(155, 138, 244, 0.1)' },
                      isLocked && { backgroundColor: Colors.mainBg }
                    ]}>
                      {chapter.isCompleted ? (
                        <CheckCircle size={20} color={Colors.secondaryAccent} weight="fill" />
                      ) : isLocked ? (
                        <LockKey size={20} color={Colors.secondaryText} weight="bold" />
                      ) : (
                        <View style={styles.statusDot} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.chapterTitle, isLocked && { color: Colors.secondaryText }]}>
                        {chapter.title}
                      </Text>
                      {chapter.topic && (
                        <Text style={styles.freeBadge}>{chapter.topic.toUpperCase()}</Text>
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
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryAccent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  unitDesc: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  unitIconContainer: {
    backgroundColor: 'rgba(255, 138, 102, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginLeft: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  freeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryAccent,
    letterSpacing: 1,
    marginTop: 4,
  },
});
