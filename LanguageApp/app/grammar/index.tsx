import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGrammarStore } from '../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

export default function GrammarHomeScreen() {
  const router = useRouter();
  const { books, parts, progress, activeFilter, fetchBooks, fetchParts, fetchProgress } = useGrammarStore();

  useEffect(() => {
    fetchBooks();
    fetchParts(activeFilter.bookId || undefined);
    fetchProgress();
  }, [activeFilter.bookId]);

  const selectedBook = activeFilter.bookId 
    ? books.find(b => b._id === activeFilter.bookId) 
    : books[0];

  if (parts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-[#110E1A]">
        <ActivityIndicator size="large" color="#FF8A66" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#110E1A]">
      <ScrollView className="p-6">
        <Text className="text-3xl font-black text-white mb-2">📚 Grammar</Text>
        <Text className="text-lg text-gray-400 mb-6">
          {selectedBook?.title || 'Loading...'} · {selectedBook?.total_chapters || '0'} Chapters
        </Text>

        <TouchableOpacity 
          className="bg-[#252040] p-4 rounded-full flex-row items-center mb-8"
          onPress={() => router.push('/grammar/reference-index')}
        >
          <Ionicons name="search" size={20} color="#8E88B0" />
          <Text className="text-[#8E88B0] ml-3 text-base">Search grammar A-Z index...</Text>
        </TouchableOpacity>

        <View className="mb-8">
          {parts.map((p) => (
            <TouchableOpacity 
              key={p._id} 
              className="bg-[#1C1830] p-6 rounded-[32px] border border-[#252040] mb-4"
              onPress={() => router.push(`/grammar/part/${p._id}` as any)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-[#FFB800] font-bold text-sm mb-1">{p.title.split(':')[0]}</Text>
                  <Text className="text-white font-bold text-2xl" numberOfLines={2}>
                    {p.title.split(':')[1]?.trim() || p.title}
                  </Text>
                </View>
                <View className="bg-[#FF8A66]/10 px-3 py-1 rounded-full">
                  <Text className="text-xs font-bold text-[#FF8A66] uppercase">
                    {p.chapter_range[1] - p.chapter_range[0] + 1} Chapters
                  </Text>
                </View>
              </View>
              
              <Text className="text-[#8E88B0] text-base leading-6 mt-2" numberOfLines={3}>
                {p.description}
              </Text>
              
              <View className="flex-row items-center mt-4">
                <Text className="text-[#9B8AF4] font-bold">Start Learning</Text>
                <Ionicons name="arrow-forward" size={16} color="#9B8AF4" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-[#1C1830] p-6 rounded-3xl mb-8 border border-[#252040]">
          <Text className="text-white font-bold text-lg mb-4">Daily Vocabulary Review</Text>
          <TouchableOpacity 
            className="bg-[#9B8AF4] p-4 rounded-2xl flex-row justify-center items-center"
            onPress={() => router.push('/lexicon/flashcards')}
          >
            <Ionicons name="albums-outline" size={24} color="#110E1A" />
            <Text className="text-[#110E1A] font-black text-lg ml-2">Start Flashcards</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
