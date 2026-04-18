import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../store/useAppStore';
import { useGrammarStore } from '../../store/useGrammarStore';
import { useCourseStore } from '../../store/useCourseStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useProfileStore } from '../../store/useProfileStore';

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
  const [userId, setUserId] = useState('demo_user');

  const name = useAppStore(s => s.name);
  const targetLanguage = useAppStore(s => s.targetLanguage);
  const streakDays = useAppStore(s => s.streakDays);
  const minutesStudiedToday = useAppStore(s => s.minutesStudiedToday);
  const dailyGoalMinutes = useAppStore(s => s.dailyGoalMinutes);
  const savedWords = useAppStore(s => s.savedWords);

  // Progress and profile stores
  const { userStats, nextLesson, isLoading: statsLoading, fetchUserStats, fetchNextLesson } = useProgressStore();
  const { profile, isLoading: profileLoading, fetchProfile } = useProfileStore();

  const { books, fetchBooks, fetchParts, fetchProgress, setFilter } = useGrammarStore();
  const { paths, fetchPaths } = useCourseStore();

  useEffect(() => {
    fetchBooks();
    fetchParts();
    fetchProgress();
    fetchPaths(targetLanguage.toLowerCase(), userId);

    // Fetch progress and profile from API
    fetchUserStats(userId);
    fetchNextLesson(userId);
    fetchProfile(userId);
  }, [targetLanguage, userId]);

  const progressPercent = Math.min((minutesStudiedToday / dailyGoalMinutes) * 100, 100);
  const firstName = name.split(' ')[0];
  const flag = LANG_FLAGS[targetLanguage] ?? '🌐';

  // Find current active course path
  const activePath = paths.find(p => !p.isLocked) || paths[0];
  const totalChapters = activePath?.chapters?.length || 1;
  const completedChapters = activePath?.chapters?.filter(c => c.isCompleted).length || 0;
  const pathPercentComplete = Math.round((completedChapters / totalChapters) * 100);

  // Use API stats if available, otherwise fall back to local
  const completionPercent = userStats?.completionPercentage ?? pathPercentComplete ?? 0;
  const streakCount = userStats?.streakCount ?? streakDays ?? 0;
  const totalXP = userStats?.totalXP ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-main-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        bounces={true}
        decelerationRate="fast"
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
              Streak: {streakCount}
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
            Continue your sequence
          </Text>
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-white/90 text-sm font-bold mb-0.5">
                 {activePath ? `Path ${activePath.order}: ${activePath.level}` : 'Loading...'}
              </Text>
              <Text className="text-white text-[22px] font-black leading-7">
                {activePath ? activePath.title : 'Loading curriculum...'}
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-1.5 rounded-2xl px-5 py-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              onPress={() => { 
                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
                 router.push('/course'); 
              }}
            >
              <Text className="text-white text-base font-extrabold">Resume</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── MASONRY GRID ── */}
        <View className="flex-row gap-3 px-5 mb-7">
          {/* Left column */}
          <View style={{ flex: 1.1, gap: 14 }}>
            {/* CURRENT LEARNING PATH (MODULES) */}
            <TouchableOpacity
              className="bg-purple-accent rounded-[36px] p-7 justify-between"
              style={{ height: 260 }}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/course'); }}
            >
              <View>
                <Text className="text-white font-extrabold leading-8" style={{ fontSize: 24 }}>
                  Curriculum{'\n'}Modules
                </Text>
                <Text className="text-white/80 mt-2 font-semibold text-sm">
                  {activePath ? `${totalChapters} Chapters` : 'Loading...'}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-white self-start px-6 py-3 rounded-full mt-4"
                onPress={() => router.push('/course')}
              >
                <Text className="text-main-bg font-extrabold text-base">View Modules</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Badges card */}
            <TouchableOpacity
              className="bg-white rounded-[32px] p-5 justify-between"
              style={{ height: 160 }}
              onPress={() => router.push('/profile' as any)}
            >
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="medal" size={22} color="#FFB800" />
                <Text className="text-main-bg text-base font-extrabold">Achievements</Text>
              </View>
              <View className="flex-row gap-1 mt-1">
                <Text style={{ fontSize: 22 }}>⭐</Text>
                <Text style={{ fontSize: 22 }}>👑</Text>
                <Text style={{ fontSize: 22 }}>🥇</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Right column */}
          <View style={{ flex: 1, gap: 14 }}>
             
            {/* LEXICON CARD */}
            <TouchableOpacity
              className="bg-coral rounded-[32px] p-6 justify-between"
              style={{ height: 190 }}
              onPress={() => router.push('/lexicon')}
            >
              <View>
                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mb-3">
                   <Ionicons name="library" size={24} color="#FFF" />
                </View>
                <Text className="text-white font-extrabold leading-6" style={{ fontSize: 20 }}>
                  Lexicon{'\n'}Dictionary
                </Text>
              </View>
              <Text className="text-white/90 font-bold text-sm mt-2">
                Browse words & phrases
              </Text>
            </TouchableOpacity>

            {/* active path progress */}
            <TouchableOpacity
              className="bg-card-bg border border-elevated rounded-[32px] p-5 justify-between"
              style={{ height: 230 }}
              onPress={() => router.push('/course' as any)}
            >
              <View>
                <Text className="text-white font-extrabold leading-6" style={{ fontSize: 18 }}>
                  Active Unit:{'\n'}{activePath?.title || 'Not Started'}
                </Text>
                <Text className="text-muted mt-2 font-semibold text-sm">
                  {completedChapters} of {totalChapters} Ch.{'\n'}{pathPercentComplete}% Complete
                </Text>
              </View>
              {/* Progress bar */}
              <View
                className="rounded-full overflow-hidden mt-4"
                style={{ height: 8, backgroundColor: '#110E1A' }}
              >
                <View
                  className="bg-cyan rounded-full h-full"
                  style={{ width: `${pathPercentComplete}%` }}
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
            {/* Grammar Library Overview */}
            {books.map(book => (
              <TouchableOpacity
                key={book._id}
                className="bg-card-bg rounded-[28px] p-6"
                style={{ width: width * 0.72 }}
                onPress={() => {
                  setFilter({ bookId: book._id });
                  router.push('/grammar');
                }}
              >
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-amber text-xs font-black tracking-widest uppercase">
                    Grammar Library
                  </Text>
                  <Ionicons name="book" size={18} color="#FFB800" />
                </View>
                <Text className="text-white text-2xl font-extrabold mb-1" numberOfLines={1}>{book.title}</Text>
                <Text className="text-muted text-base leading-6">
                  {book.language === 'es' ? '🇪🇸' : book.language === 'fr' ? '🇫🇷' : '🇺🇸'} {book.total_chapters} Chapters
                </Text>
              </TouchableOpacity>
            ))}

            {/* Grammar Tip */}
            <TouchableOpacity
              className="bg-elevated rounded-[28px] p-6"
              style={{ width: width * 0.72 }}
              onPress={() => router.push('/grammar/reference-index')}
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-cyan text-xs font-black tracking-widest uppercase">
                  Grammar Shortcut
                </Text>
                <Ionicons name="bulb" size={18} color="#00E5FF" />
              </View>
              <Text className="text-white text-2xl font-extrabold mb-1">Le vs. La</Text>
              <Text className="text-muted text-base leading-6">
                Most words ending in 'e' are feminine, but wait for 'le livre' (book)!
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
