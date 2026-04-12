import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';

// Dashboard Components
import { TopNavBar } from '../../components/dashboard/TopNavBar';
import { ScreenTitle } from '../../components/dashboard/ScreenTitle';
import { DailyGoalCard } from '../../components/dashboard/DailyGoalCard';
import { OngoingCourses } from '../../components/dashboard/OngoingCourses';
import { YourLessonsGrid } from '../../components/dashboard/YourLessonsGrid';

// Stores
import { useAppStore } from '../../store/useAppStore';
import { useGrammarStore } from '../../store/useGrammarStore';

export default function HomeScreen() {
  const router = useRouter();

  // Stores Access
  const name = useAppStore(s => s.name);
  const minutesStudiedToday = useAppStore(s => s.minutesStudiedToday);
  const dailyGoalMinutes = useAppStore(s => s.dailyGoalMinutes);
  
  const { books, fetchBooks, fetchParts, fetchProgress, setFilter } = useGrammarStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchParts();
    fetchProgress();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchBooks(),
      fetchParts(),
      fetchProgress()
    ]);
    setRefreshing(false);
  }, []);

  const progressPercent = dailyGoalMinutes > 0 ? Math.min((minutesStudiedToday / dailyGoalMinutes) * 100, 100) : 0;
  const firstName = name ? name.split(' ')[0] : 'Guest';

  const handleCoursePress = (bookId: string) => {
    setFilter({ bookId });
    router.push('/grammar');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
         <Svg width="100%" height="100%">
           <Defs>
             <RadialGradient id="grad" cx="80%" cy="100%" r="60%" fx="80%" fy="100%" gradientUnits="userSpaceOnUse">
               <Stop offset="0" stopColor="#E0F2EB" stopOpacity="1" />
               <Stop offset="0.6" stopColor="#FAFCFC" stopOpacity="0" />
             </RadialGradient>
           </Defs>
           <Rect width="100%" height="100%" fill="url(#grad)" />
         </Svg>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#259D7A" />}
      >
        <TopNavBar />
        <ScreenTitle firstName={firstName} />
        
        <DailyGoalCard 
          minutesStudiedToday={minutesStudiedToday} 
          dailyGoalMinutes={dailyGoalMinutes} 
          progressPercent={progressPercent} 
        />
        
        <OngoingCourses books={books} onCoursePress={handleCoursePress} />
        <YourLessonsGrid />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFCFC'
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 24
  }
});
