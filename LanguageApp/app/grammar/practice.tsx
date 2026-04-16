import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PracticeFlashcardsScreen() {
  const router = useRouter();
  const { tags } = useLocalSearchParams<{ tags?: string }>();
  const [examples, setExamples] = useState<any[]>([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const API_URL = 'https://sky-spire.vercel.app/api/grammar';

  useEffect(() => {
    let url = `${API_URL}/examples/random?count=10`;
    if (tags) url += `&tags=${tags}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setExamples(data))
      .catch(console.error);
  }, [tags]);

  const nextCard = () => {
    setRevealed(false);
    if (currIdx < examples.length - 1) {
      setCurrIdx(currIdx + 1);
    } else {
      router.back();
    }
  };

  if (examples.length === 0) return (
    <SafeAreaView className="flex-1 bg-[#110E1A] justify-center items-center">
      <ActivityIndicator size="large" color="#FF8A66" />
    </SafeAreaView>
  );

  const card = examples[currIdx];

  return (
    <SafeAreaView className="flex-1 bg-[#110E1A]">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-[#252040]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-gray-400 font-bold">Card {currIdx + 1} of {examples.length}</Text>
        <Ionicons name="options" size={28} color="#FFFFFF" />
      </View>

      <View className="flex-1 p-6 justify-center">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setRevealed(true)}
          className={`bg-[#1C1830] border-2 rounded-[40px] p-8 flex-1 max-h-[400px] justify-center items-center ${revealed ? 'border-[#FF8A66]' : 'border-[#252040]'}`}
        >
          <Text className="text-3xl font-black text-center text-[#fef9f0] mb-8">{card.spanish}</Text>

          {!revealed ? (
            <Text className="text-[#8E88B0] font-bold text-lg mt-10">Tap to reveal translation</Text>
          ) : (
            <Text className="text-2xl font-bold text-center text-[#9B8AF4]">{card.english}</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6 h-[20px]">
          {revealed && (
            <Text className="text-[#8E88B0] text-sm">
              Tags: {card.tags.join(' · ')}
            </Text>
          )}
        </View>

        {revealed && (
          <View className="flex-row justify-between mt-10 gap-4">
            <TouchableOpacity className="bg-[#ef4444]/20 border border-[#ef4444] rounded-2xl p-4 flex-1 items-center" onPress={nextCard}>
              <Text className="text-xl">😕</Text>
              <Text className="text-[#ef4444] font-bold mt-1">Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#f59e0b]/20 border border-[#f59e0b] rounded-2xl p-4 flex-1 items-center" onPress={nextCard}>
              <Text className="text-xl">😐</Text>
              <Text className="text-[#f59e0b] font-bold mt-1">OK</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#22c55e]/20 border border-[#22c55e] rounded-2xl p-4 flex-1 items-center" onPress={nextCard}>
              <Text className="text-xl">😊</Text>
              <Text className="text-[#22c55e] font-bold mt-1">Easy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
}
