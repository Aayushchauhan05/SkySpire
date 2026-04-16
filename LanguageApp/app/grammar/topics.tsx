import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGrammarStore } from '../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

// Hardcoded for demo, normally fetched actively from uniquely indexing all chapters' tags
const POPULAR_TAGS = ['verbs', 'tenses', 'subjunctive', 'ser', 'estar', 'pronouns', 'prepositions', 'adjectives', 'articles', 'negation', 'questions', 'greetings'];

export default function TopicsExplorerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#110E1A]">
      <View className="px-6 py-4 flex-row items-center border-b border-[#252040]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">Browse by Topic</Text>
      </View>

      <ScrollView className="px-6 pt-6 pb-20">
        <View className="flex-row flex-wrap gap-3">
          {POPULAR_TAGS.map(tag => (
             <TouchableOpacity 
               key={tag}
               className="bg-[#1C1830] p-4 rounded-2xl border border-[#252040] w-[47%] mb-2 flex-row items-center justify-between"
               onPress={() => router.push(`/grammar/part/search?tag=${tag}` as any)}
             >
               <Text className="text-[#9B8AF4] font-bold text-base">🏷 {tag}</Text>
               <Ionicons name="chevron-forward" size={16} color="#8E88B0" />
             </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
