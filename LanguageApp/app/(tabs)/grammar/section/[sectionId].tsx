import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGrammarStore } from '../../../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

export default function SectionReaderScreen() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
  const router = useRouter();
  const { markSectionComplete } = useGrammarStore();
  
  const [data, setData] = useState<{ section: any; examples: any[] } | null>(null);

  const API_URL = 'http://192.168.1.9:3000/api/grammar';

  useEffect(() => {
    if (sectionId) {
      fetch(`${API_URL}/sections/${sectionId}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }
  }, [sectionId]);

  const handleMarkDone = () => {
    if (data?.section) {
      markSectionComplete(data.section.chapter_id, sectionId);
      router.back();
    }
  };

  if (!data) return (
    <SafeAreaView className="flex-1 bg-[#110E1A] justify-center items-center">
      <ActivityIndicator size="large" color="#FF8A66" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#110E1A]">
      <View className="px-6 py-4 flex-row items-center border-b border-[#252040]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-gray-400 font-bold flex-1">Sec {data.section.section_number}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-3xl font-black text-white mb-6 leading-tight">{data.section.title}</Text>
        
        <View className="bg-[#1C1830] p-6 rounded-3xl mb-8">
          <Text className="text-[#fef9f0] text-lg leading-relaxed">{data.section.content}</Text>
        </View>

        {data.examples.length > 0 && (
          <View className="mb-8">
            <Text className="text-gray-400 font-bold uppercase tracking-wider mb-4">Examples in context</Text>
            {data.examples.map((ex, i) => (
              <View key={ex._id} className="bg-[#252040] p-5 rounded-2xl mb-3">
                <View className="flex-row items-start">
                  <Text className="text-xl mr-3">🇪🇸</Text>
                  <Text className="text-[#fef9f0] font-medium text-lg flex-1 leading-snug">{ex.spanish}</Text>
                </View>
                <View className="flex-row items-start mt-3">
                  <Text className="text-xl mr-3">🇬🇧</Text>
                  <Text className="text-[#8E88B0] text-base flex-1">{ex.english}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View className="p-6 border-t border-[#252040] bg-[#110E1A]">
        <TouchableOpacity 
          className="bg-[#22c55e] p-4 rounded-2xl flex-row justify-center items-center"
          onPress={handleMarkDone}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text className="text-white font-black text-lg ml-2">Mark Section Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
