import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGrammarStore } from '../../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

export default function GrammarHomeScreen() {
  const router = useRouter();
  const { parts, progress, fetchParts, fetchProgress } = useGrammarStore();

  useEffect(() => {
    fetchParts();
    fetchProgress();
  }, []);

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
        <Text className="text-lg text-gray-400 mb-6">Modern Spanish Grammar · 73 Chapters</Text>

        <TouchableOpacity 
          className="bg-[#252040] p-4 rounded-full flex-row items-center mb-8"
          onPress={() => router.push('/grammar/topics')}
        >
          <Ionicons name="search" size={20} color="#8E88B0" />
          <Text className="text-[#8E88B0] ml-3 text-base">Search topics or browse tags...</Text>
        </TouchableOpacity>

        <View className="flex-row gap-4 mb-8">
          {parts.map((p) => (
            <TouchableOpacity 
              key={p._id} 
              className="flex-1 bg-[#1C1830] p-5 rounded-3xl border border-[#252040]"
              onPress={() => router.push(`/grammar/part/${p._id}` as any)}
            >
              <Text className="text-[#FFB800] font-bold text-sm mb-1">{p.title.split(':')[0]}</Text>
              <Text className="text-white font-bold text-xl mb-2">{p.title.split(':')[1]?.trim() || p.title}</Text>
              <Text className="text-[#8E88B0] text-sm mb-4" numberOfLines={2}>{p.description}</Text>
              <Text className="text-xs font-bold text-[#FF8A66] uppercase">{p.chapter_range[1] - p.chapter_range[0] + 1} Chapters</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-[#1C1830] p-6 rounded-3xl mb-8 border border-[#252040]">
          <Text className="text-white font-bold text-lg mb-4">Daily Practice</Text>
          <TouchableOpacity 
            className="bg-[#9B8AF4] p-4 rounded-2xl flex-row justify-center items-center"
            onPress={() => router.push('/grammar/practice')}
          >
            <Ionicons name="albums-outline" size={24} color="#110E1A" />
            <Text className="text-[#110E1A] font-black text-lg ml-2">Start Flashcards</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
