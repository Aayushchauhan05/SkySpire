import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { useGrammarStore } from '../../store/useGrammarStore';

const { width } = Dimensions.get('window');

const LANG_FLAGS: Record<string, string> = {
  Spanish: '🇪🇸',
  French: '🇫🇷',
  German: '🇩🇪',
  Italian: '🇮🇹',
  Japanese: '🇯🇵',
  Arabic: '🇸🇦',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();

  const name = useAppStore(s => s.name);
  const targetLanguage = useAppStore(s => s.targetLanguage);
  const streakDays = useAppStore(s => s.streakDays);
  const minutesStudiedToday = useAppStore(s => s.minutesStudiedToday);
  const dailyGoalMinutes = useAppStore(s => s.dailyGoalMinutes);
  const savedWords = useAppStore(s => s.savedWords);
  const { books, fetchBooks, fetchParts, fetchProgress, setFilter } = useGrammarStore();

  useEffect(() => {
    fetchBooks();
    fetchParts();
    fetchProgress();
  }, []);

  const progressPercent = Math.min((minutesStudiedToday / dailyGoalMinutes) * 100, 100);
  const firstName = name.split(' ')[0];
  const flag = LANG_FLAGS[targetLanguage] ?? '🌐';

  return (
    <SafeAreaView className="flex-1 bg-main-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── HEADER ── */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-5">
          {/* Language selector */}
          <TouchableOpacity className="flex-row items-center bg-card-bg px-4 py-2.5 rounded-3xl gap-2">
            <Text className="text-xl">{flag}</Text>
            <Text className="text-white font-bold text-base">{targetLanguage}</Text>
            <Ionicons name="chevron-down" size={15} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Guest label */}
          <Text className="text-white font-bold text-base">{firstName}</Text>

          {/* Streak badge */}
          <View
            className="flex-row items-center gap-1 px-3 py-2 rounded-2xl"
            style={{
              backgroundColor: 'rgba(255,184,0,0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255,184,0,0.3)',
            }}
          >
            <MaterialCommunityIcons name="fire" size={20} color="#FFB800" />
            <Text className="text-amber font-extrabold text-base">
              Streak: {streakDays}
            </Text>
            <Text className="text-lg">🔥</Text>
          </View>
        </View>

        {/* ── GREETING ── */}
        <View className="px-5 mb-8">
          <Text
            className="text-white font-extrabold"
            style={{ fontSize: 38, lineHeight: 46, letterSpacing: -1 }}
          >
            {getGreeting()},{'\n'}{firstName}
          </Text>
          <Text className="text-muted text-lg font-semibold mt-2">
            Ready to learn something new?
          </Text>
        </View>

        {/* ── CONTINUE BANNER ── */}
        <View className="mx-5 mb-7 bg-coral rounded-3xl p-6">
          <Text
            className="text-xs font-black tracking-widest mb-2 uppercase"
            style={{ color: 'rgba(0,0,0,0.4)' }}
          >
            Continue where you left off
          </Text>
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-white/90 text-sm font-bold mb-0.5">
                Unit 2: Intermediates
              </Text>
              <Text className="text-white text-[22px] font-black leading-7">
                Definite Articles: Part 2
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-1.5 rounded-2xl px-5 py-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              onPress={() => router.push('/chapter/1_2' as any)}
            >
              <Text className="text-white text-base font-extrabold">Resume</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── MASONRY GRID ── */}
        <View className="flex-row gap-3 px-5 mb-7">
          {/* Left column */}
          <View style={{ flex: 1.1, gap: 14 }}>
            {/* Large chapter card */}
            <TouchableOpacity
              className="bg-purple-accent rounded-[36px] p-7 justify-between"
              style={{ height: 380 }}
              onPress={() => router.push('/module/SURVIVAL' as any)}
            >
              <View>
                <Text className="text-white font-extrabold leading-8" style={{ fontSize: 24 }}>
                  Chapter 2:{'\n'}Essential{'\n'}Greetings
                </Text>
                <Text className="text-white/80 mt-2 font-semibold text-sm">
                  Lv. 2 • 45% Complete
                </Text>
              </View>

              {/* View Modules button */}
              <TouchableOpacity
                className="bg-white self-start px-6 py-3 rounded-full"
                onPress={() => router.push('/module/SURVIVAL' as any)}
              >
                <Text className="text-main-bg font-extrabold text-base">View Modules</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Right column */}
          <View style={{ flex: 1, gap: 14 }}>
            {/* Badges card */}
            <TouchableOpacity
              className="bg-white rounded-[32px] p-5 justify-between"
              style={{ height: 178 }}
              onPress={() => router.push('/profile' as any)}
            >
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="medal" size={22} color="#FFB800" />
                <Text className="text-main-bg text-base font-extrabold">4 Badges</Text>
              </View>
              <View className="flex-row gap-1 mt-1">
                <Text style={{ fontSize: 22 }}>⭐</Text>
                <Text style={{ fontSize: 22 }}>👑</Text>
                <Text style={{ fontSize: 22 }}>🥇</Text>
                <Text style={{ fontSize: 22 }}>🥈</Text>
              </View>
              <Text className="text-[#777] text-xs font-bold mt-1">
                View Achievement{'\n'}Progress
              </Text>
            </TouchableOpacity>

            {/* Multi-Book Grammar Cards */}
            {books.map((book, idx) => (
              <TouchableOpacity
                key={book._id}
                className={`rounded-[32px] p-5 justify-between mb-4 ${
                  book.language === 'es' ? 'bg-[#9B8AF4]' : 'bg-amber'
                }`}
                style={{ height: 160 }}
                onPress={() => {
                  setFilter({ bookId: book._id });
                  router.push('/grammar');
                }}
              >
                <View className="flex-row items-center gap-1.5">
                  <Ionicons 
                    name="book" 
                    size={22} 
                    color={book.language === 'es' ? 'white' : '#110E1A'} 
                  />
                  <Text className={`text-base font-extrabold ${
                    book.language === 'es' ? 'text-white' : 'text-main-bg'
                  }`}>
                    {book.language === 'es' ? '🇪🇸 Spanish' : '🇺🇸 English'}
                  </Text>
                </View>
                <Text className={`text-lg font-black leading-6 ${
                  book.language === 'es' ? 'text-white' : 'text-main-bg'
                }`}>
                  {book.title.length > 30 ? book.title.substring(0, 27) + '...' : book.title}
                </Text>
                <View className={`${
                  book.language === 'es' ? 'bg-white/20' : 'bg-white/30'
                } self-start px-3 py-1 rounded-full`}>
                  <Text className={`text-[10px] font-black uppercase ${
                    book.language === 'es' ? 'text-white' : 'text-main-bg'
                  }`}>
                    {book.total_chapters} Chapters
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Unit 1 card */}
            <TouchableOpacity
              className="bg-coral rounded-[32px] p-5 justify-between"
              style={{ height: 192 }}
              onPress={() => router.push('/course' as any)}
            >
              <View>
                <Text className="text-white font-extrabold leading-6" style={{ fontSize: 18 }}>
                  Unit 1:{'\n'}Foundations
                </Text>
                <Text className="text-white/90 mt-1 font-semibold text-sm">
                  3/5 Ch. • 60%{'\n'}Complete
                </Text>
              </View>
              {/* Progress bar */}
              <View
                className="rounded-full overflow-hidden"
                style={{ height: 6, backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <View
                  className="bg-white rounded-full h-full"
                  style={{ width: '60%' }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── DAILY SPOTLIGHT ── */}
        <View className="mb-2">
          <Text className="text-white font-extrabold text-lg px-5 mb-4">
            Daily Spotlight
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingHorizontal: 20, paddingRight: 28 }}
          >
            {/* Daily Word */}
            <TouchableOpacity
              className="bg-card-bg rounded-[28px] p-6"
              style={{ width: width * 0.72 }}
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-amber text-xs font-black tracking-widest uppercase">
                  Daily Word
                </Text>
                <Ionicons name="sparkles" size={18} color="#FFB800" />
              </View>
              <Text className="text-white text-2xl font-extrabold mb-1">Desarrollar</Text>
              <Text className="text-muted text-base leading-6">"To develop, to grow."</Text>
            </TouchableOpacity>

            {/* Grammar Tip */}
            <TouchableOpacity
              className="bg-elevated rounded-[28px] p-6"
              style={{ width: width * 0.72 }}
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-cyan text-xs font-black tracking-widest uppercase">
                  Grammar Tip
                </Text>
                <Ionicons name="bulb" size={18} color="#00E5FF" />
              </View>
              <Text className="text-white text-2xl font-extrabold mb-1">El vs. La</Text>
              <Text className="text-muted text-base leading-6">
                Nouns ending in -o are typically masculine (el), and in -a are feminine (la).
              </Text>
            </TouchableOpacity>

            {/* Phrase of the Week */}
            <TouchableOpacity
              className="rounded-[28px] p-6"
              style={{
                width: width * 0.72,
                backgroundColor: 'rgba(255,138,102,0.06)',
                borderWidth: 1,
                borderColor: '#FF8A66',
              }}
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-coral text-xs font-black tracking-widest uppercase">
                  Phrase of the Week
                </Text>
                <Ionicons name="chatbubbles" size={18} color="#FF8A66" />
              </View>
              <Text className="text-white text-xl font-extrabold mb-1">
                "Estar en las nubes"
              </Text>
              <Text className="text-muted text-base leading-6">
                Lit: To be in the clouds.{'\n'}Meaning: To be daydreaming.
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ── BOTTOM STATS STRIP ── */}
        <View
          className="flex-row justify-between items-center mx-5 mt-6 bg-card-bg rounded-3xl px-5 py-4"
          style={{ borderWidth: 1, borderColor: '#252040' }}
        >
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="fire" size={22} color="#FFB800" />
            <Text className="text-white font-extrabold text-base">{streakDays}</Text>
            <View className="w-px h-4 bg-elevated mx-1" />
            {/* Mini progress */}
            <View
              className="rounded-full overflow-hidden"
              style={{ width: 56, height: 7, backgroundColor: '#110E1A' }}
            >
              <View
                className="bg-cyan h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <Text className="text-muted text-sm font-semibold">
              {minutesStudiedToday}/{dailyGoalMinutes} min
            </Text>
          </View>

          <View className="flex-row items-center gap-2 bg-purple-accent px-3 py-2 rounded-2xl">
            <MaterialCommunityIcons name="cards" size={18} color="#FFFFFF" />
            <Text className="text-white font-extrabold text-sm">
              {savedWords.length} Words
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
