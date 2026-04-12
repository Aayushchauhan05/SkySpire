import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  elevatedSurface: '#F3F4F6',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
};

export default function ChapterDetailScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();
  const [chapter, setChapter] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  // Assume API is available locally for DEV via the same domain store uses.
  const API_URL = 'http://192.168.29.34:3000/api/grammar';

  useEffect(() => {
    if (chapterId) {
      fetch(`${API_URL}/chapters/${chapterId}`)
        .then(res => res.json())
        .then(data => setChapter(data))
        .catch(console.error);

      fetch(`${API_URL}/chapters/${chapterId}/sections`)
        .then(res => res.json())
        .then(data => setSections(data))
        .catch(console.error);
    }
  }, [chapterId]);

  if (!chapter) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>

        <Text style={styles.chapterNumber}>CHAPTER {chapter.chapter_number}</Text>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        
        <View style={styles.tagsContainer}>
          {chapter.tags?.map((t: string) => (
            <View key={t} style={styles.tagBadge}>
              <Text style={styles.tagText}>#{t}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeading}>📝 Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{chapter.summary}</Text>
        </View>

        <Text style={styles.sectionHeading}>Sections</Text>
        <View style={styles.sectionsContainer}>
          {sections.map((sec, idx) => (
            <TouchableOpacity 
              key={sec._id}
              style={styles.sectionCard}
              onPress={() => router.push(`/grammar/section/${sec._id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.sectionNumberCircle}>
                <Text style={styles.sectionNumberText}>{sec.section_number}</Text>
              </View>
              <Text style={styles.sectionCardTitle}>{sec.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  chapterNumber: {
    color: Colors.secondaryAccent,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 1,
  },
  chapterTitle: {
    color: Colors.primaryText,
    fontWeight: '900',
    fontSize: 32,
    marginBottom: 16,
    lineHeight: 40,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  tagBadge: {
    backgroundColor: Colors.elevatedSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    color: Colors.primaryAccent,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeading: {
    color: Colors.primaryText,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: Colors.cardBg,
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryText: {
    color: Colors.secondaryText,
    lineHeight: 26,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionNumberCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(37, 157, 122, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionNumberText: {
    color: Colors.primaryAccent,
    fontWeight: '800',
    fontSize: 16,
  },
  sectionCardTitle: {
    color: Colors.primaryText,
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
  },
});
