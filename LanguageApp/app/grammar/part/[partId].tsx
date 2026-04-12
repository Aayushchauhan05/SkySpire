import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGrammarStore } from '../../../store/useGrammarStore';
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

export default function ChapterListScreen() {
  const { partId } = useLocalSearchParams<{ partId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const { chapters, fetchChapters } = useGrammarStore();

  useEffect(() => {
    const load = async () => {
      if (partId) {
        setIsLoading(true);
        await fetchChapters(partId);
        setIsLoading(false);
      }
    };
    load();
  }, [partId]);

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner': return { bg: 'rgba(37, 157, 122, 0.1)', text: Colors.primaryAccent };
      case 'intermediate': return { bg: 'rgba(255, 184, 0, 0.1)', text: Colors.amber };
      case 'advanced': return { bg: 'rgba(255, 92, 122, 0.1)', text: Colors.error };
      default: return { bg: Colors.elevatedSurface, text: Colors.secondaryText };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Part chapters</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primaryAccent} />
        </View>
      ) : chapters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color={Colors.secondaryText} />
          <Text style={styles.emptyTitle}>No chapters found</Text>
          <Text style={styles.emptySubtitle}>
            This module might still be syncing or lacks chapters for this part.
          </Text>
          <TouchableOpacity 
            style={styles.goBackBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <Text style={styles.filterBtnText}>All Difficulties</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <Text style={styles.filterBtnText}>All Tags</Text>
            </TouchableOpacity>
          </View>

          {chapters.map(ch => {
            const diffTheme = getDifficultyColor(ch.difficulty || 'beginner');
            return (
              <TouchableOpacity 
                key={ch._id}
                style={styles.card}
                onPress={() => router.push(`/grammar/chapter/${ch._id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.chapterNumber}>Ch {ch.chapter_number}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: diffTheme.bg }]}>
                    <Text style={[styles.difficultyText, { color: diffTheme.text }]}>
                      {ch.difficulty || 'BEGINNER'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.chapterTitle}>{ch.title}</Text>
                
                <View style={styles.tagsContainer}>
                  {ch.tags?.slice(0, 3).map((tag: string) => (
                    <View key={tag} style={styles.tagBadge}>
                      <Text style={styles.tagText}>🏷 {tag}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.metaText}>
                  {ch.section_count || 0} sections · {ch.example_count || 0} examples
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  goBackBtn: {
    marginTop: 32,
    backgroundColor: Colors.elevatedSurface,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  goBackText: {
    color: Colors.primaryText,
    fontWeight: '700',
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterBtn: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  filterBtnText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.cardBg,
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chapterNumber: {
    color: Colors.secondaryAccent,
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chapterTitle: {
    color: Colors.primaryText,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
    lineHeight: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagBadge: {
    backgroundColor: Colors.elevatedSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: '500',
  },
});
