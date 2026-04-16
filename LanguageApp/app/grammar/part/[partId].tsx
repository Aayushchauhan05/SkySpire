import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGrammarStore } from '../../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

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
    switch (diff) {
      case 'beginner': return 'bg-green-500/20 text-green-500';
      case 'intermediate': return 'bg-amber-500/20 text-amber-500';
      case 'advanced': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#110E1A]">
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">Part chapters</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF8A66" />
        </View>
      ) : chapters.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="book-outline" size={64} color="#252040" />
          <Text className="text-white text-xl font-bold mt-4 text-center">No chapters found</Text>
          <Text className="text-[#8E88B0] text-base mt-2 text-center">
            This module might still be syncing or lacks chapters for this part.
          </Text>
          <TouchableOpacity 
            className="mt-8 bg-[#252040] px-6 py-3 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-[#FF8A66] font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="px-6 pb-20">
          <View className="flex-row items-center mb-6 py-2">
            <TouchableOpacity className="bg-[#252040] px-4 py-2 rounded-full mr-2">
              <Text className="text-white text-sm font-bold">All Difficulties</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#252040] px-4 py-2 rounded-full mr-2">
              <Text className="text-white text-sm font-bold">All Tags</Text>
            </TouchableOpacity>
          </View>

          {chapters.map(ch => (
            <TouchableOpacity 
              key={ch._id}
              className="bg-[#1C1830] p-5 rounded-3xl mb-4 border border-[#252040]"
              onPress={() => router.push(`/grammar/chapter/${ch._id}` as any)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-[#FFB800] font-bold">Ch {ch.chapter_number}</Text>
                <View className={`px-2 py-1 rounded-md ${getDifficultyColor(ch.difficulty).split(' ')[0]}`}>
                  <Text className={`text-xs font-bold uppercase ${getDifficultyColor(ch.difficulty).split(' ')[1]}`}>
                    {ch.difficulty}
                  </Text>
                </View>
              </View>
              <Text className="text-white font-bold text-xl mb-2">{ch.title}</Text>
              
              <View className="flex-row flex-wrap gap-2 mb-4">
                {ch.tags.slice(0, 3).map(tag => (
                  <Text key={tag} className="text-[#8E88B0] text-xs bg-[#252040] px-2 py-1 rounded">
                    🏷 {tag}
                  </Text>
                ))}
              </View>

              <Text className="text-gray-400 text-sm">
                {ch.section_count} sections · {ch.example_count} examples
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
