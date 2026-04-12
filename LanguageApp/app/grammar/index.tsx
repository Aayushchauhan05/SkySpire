import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGrammarStore } from '../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
};

export default function GrammarHomeScreen() {
  const router = useRouter();
  const { books, parts, progress, activeFilter, fetchBooks, fetchParts, fetchProgress } = useGrammarStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchParts(activeFilter.bookId || undefined);
    fetchProgress();
  }, [activeFilter.bookId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchBooks(),
      fetchParts(activeFilter.bookId || undefined),
      fetchProgress()
    ]);
    setRefreshing(false);
  }, [activeFilter.bookId]);

  const selectedBook = activeFilter.bookId 
    ? books.find(b => b._id === activeFilter.bookId) 
    : books[0];

  if (parts.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: Colors.mainBg }]}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#259D7A" />}
      >
        <View style={{ paddingTop: 12 }}>
          <Text style={styles.screenTitle}>📚 Grammar</Text>
          <Text style={styles.screenSubtitle}>
            {selectedBook?.title || 'Loading...'} · {selectedBook?.total_chapters || '0'} Chapters
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/grammar/topics')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={Colors.secondaryText} />
          <Text style={styles.searchText}>Search topics or browse tags...</Text>
        </TouchableOpacity>

        <View style={styles.partsContainer}>
          {parts.map((p) => (
            <TouchableOpacity 
              key={p._id} 
              style={styles.card}
              onPress={() => router.push(`/grammar/part/${p._id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.partLabel}>{p.title.split(':')[0]}</Text>
                  <Text style={styles.partTitle} numberOfLines={2}>
                    {p.title.split(':')[1]?.trim() || p.title}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {p.chapter_range[1] - p.chapter_range[0] + 1} Chapters
                  </Text>
                </View>
              </View>
              
              <Text style={styles.partDescription} numberOfLines={3}>
                {p.description}
              </Text>
              
              <View style={styles.startLearningContainer}>
                <Text style={styles.startLearningText}>Start Learning</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primaryAccent} style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, styles.dailyPracticeCard]}>
          <Text style={styles.dailyPracticeTitle}>Daily Practice</Text>
          <TouchableOpacity 
            style={styles.practiceButton}
            onPress={() => router.push('/grammar/practice')}
            activeOpacity={0.8}
          >
            <Ionicons name="albums-outline" size={24} color="#FFFFFF" />
            <Text style={styles.practiceButtonText}>Start Flashcards</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 24,
    fontWeight: '500',
  },
  searchBar: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
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
  searchText: {
    color: Colors.secondaryText,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  partsContainer: {
    marginBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.cardBg,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  partLabel: {
    color: Colors.secondaryAccent,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 6,
    fontFamily: 'System',
    textTransform: 'uppercase',
  },
  partTitle: {
    color: Colors.primaryText,
    fontWeight: '800',
    fontSize: 22,
    lineHeight: 28,
  },
  badge: {
    backgroundColor: 'rgba(244, 147, 32, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondaryAccent,
    textTransform: 'uppercase',
  },
  partDescription: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  startLearningContainer: {
    flexDirection: 'row',
    itemsCenter: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  startLearningText: {
    color: Colors.primaryAccent,
    fontWeight: '700',
    fontSize: 15,
  },
  dailyPracticeCard: {
    marginBottom: 32,
  },
  dailyPracticeTitle: {
    color: Colors.primaryText,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 16,
  },
  practiceButton: {
    backgroundColor: Colors.primaryAccent,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 8,
  },
});
