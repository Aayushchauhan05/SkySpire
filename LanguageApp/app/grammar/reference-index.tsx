import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/themed-text';
import { useGrammarStore } from '../../store/useGrammarStore';

const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',
  secondaryAccent: '#9B8AF4',
  textHeader: '#FFFFFF',
  textDark: '#110E1A',
  textMuted: '#8E88B0',
};

export default function GrammarReferenceIndexScreen() {
  const router = useRouter();
  const { grammarIndex, fetchIndex, chapters } = useGrammarStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchIndex();
  }, []);

  const filteredIndex = useMemo(() => {
    if (!searchQuery) return grammarIndex;
    const lowerQuery = searchQuery.toLowerCase();
    return grammarIndex.filter(entry => 
      entry.keyword.toLowerCase().includes(lowerQuery) || 
      entry.topicTitle.toLowerCase().includes(lowerQuery) ||
      entry.chapterTitle.toLowerCase().includes(lowerQuery)
    );
  }, [grammarIndex, searchQuery]);

  const groupedIndex = useMemo(() => {
    const map = new Map<string, typeof grammarIndex>();
    filteredIndex.forEach(entry => {
      const letter = entry.letter.toUpperCase();
      if (!map.has(letter)) {
        map.set(letter, []);
      }
      map.get(letter)!.push(entry);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Grammar A-Z</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textMuted} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search rules, keywords, topics..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {grammarIndex.length === 0 ? (
        <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color={Colors.primaryAccent} />
           <ThemedText style={{ color: Colors.textMuted, marginTop: 16 }}>Loading Grammar Index...</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {groupedIndex.length === 0 ? (
            <View style={styles.emptyContainer}>
               <ThemedText style={{ color: Colors.textMuted }}>No results found for "{searchQuery}"</ThemedText>
            </View>
          ) : (
            groupedIndex.map(([letter, entries]) => (
              <View key={letter} style={styles.letterGroup}>
                <View style={styles.letterBadge}>
                   <ThemedText style={styles.letterText}>{letter}</ThemedText>
                </View>
                {entries.map((entry, idx) => (
                   <TouchableOpacity 
                      key={`${entry.sectionId}-${idx}`} 
                      style={styles.entryRow}
                      onPress={() => router.push(`/grammar/section/${entry.sectionId}` as any)}
                   >
                      <View style={{ flex: 1 }}>
                         <ThemedText style={styles.entryTitle}>{entry.topicTitle}</ThemedText>
                         <ThemedText style={styles.entrySub}>in {entry.chapterTitle}</ThemedText>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                   </TouchableOpacity>
                ))}
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.textHeader,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textHeader,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 26,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: Colors.textHeader,
    marginLeft: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  letterGroup: {
    marginBottom: 24,
  },
  letterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  letterText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryAccent,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textHeader,
    marginBottom: 4,
  },
  entrySub: {
    fontSize: 13,
    color: Colors.textMuted,
  }
});
