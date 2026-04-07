import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChapterDetailScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();
  const [chapter, setChapter] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  // Assume API is available locally for DEV via the same domain store uses.
  const API_URL = 'https://sky-spire.vercel.app/api/grammar';

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
      <View className="flex-1 justify-center items-center bg-[#110E1A]">
        <ActivityIndicator size="large" color="#FF8A66" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#110E1A]">
      <ScrollView className="px-6 max-w-2xl w-full mx-auto" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-6">
          <View className="bg-[#252040] self-start p-2 rounded-full">
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>

        <Text className="text-[#FFB800] font-bold text-lg mb-1">CHAPTER {chapter.chapter_number}</Text>
        <Text className="text-white font-black text-4xl mb-4">{chapter.title}</Text>
        
        <View className="flex-row flex-wrap gap-2 mb-8">
          {chapter.tags.map((t: string) => (
            <View key={t} className="bg-[#252040] px-3 py-1.5 rounded-lg border border-[#3A335B]">
              <Text className="text-[#9B8AF4] font-bold text-sm">#{t}</Text>
            </View>
          ))}
        </View>

        <Text className="text-white text-lg font-bold mb-4">📝 Summary</Text>
        <View className="bg-[#1C1830] p-5 rounded-3xl mb-8">
          <Text className="text-gray-300 leading-relaxed text-base">{chapter.summary}</Text>
        </View>

        <Text className="text-white text-lg font-bold mb-4">Sections</Text>
        <View className="gap-3 mb-8">
          {sections.map((sec, idx) => (
            <TouchableOpacity 
              key={sec._id}
              className="bg-[#1C1830] p-4 rounded-2xl flex-row items-center"
              onPress={() => router.push(`/grammar/section/${sec._id}` as any)}
            >
              <View className="w-10 h-10 bg-[#252040] rounded-full justify-center items-center mr-4">
                <Text className="text-white font-bold text-sm">{sec.section_number}</Text>
              </View>
              <Text className="text-white font-bold text-base flex-1">{sec.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#8E88B0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
