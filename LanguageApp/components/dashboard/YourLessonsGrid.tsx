import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';

export const YourLessonsGrid = () => {
  const router = useRouter();

  return (
    <View>
      <View style={styles.header}>
         <Text style={styles.title}>Your Lessons</Text>
         <Text style={styles.moreIcon}>...</Text>
      </View>

      <View style={styles.grid}>
          <TouchableOpacity style={styles.lessonCard} activeOpacity={0.7} onPress={() => router.push('/module/SURVIVAL' as any)}>
             <Svg width="40" height="40" viewBox="0 0 24 24">
               <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" fill="none" stroke="#94A3B8" strokeWidth="2" />
               <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="#E2E8F0" />
             </Svg>
             <Text style={styles.lessonText}>Reading</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lessonCard} activeOpacity={0.7} onPress={() => router.push('/course' as any)}>
             <Svg width="40" height="40" viewBox="0 0 24 24">
               <Rect x="4" y="2" width="16" height="20" rx="2" fill="#E2E8F0" />
               <Path d="M12 18l4-8-4-2-4 2z" fill="#94A3B8" />
               <Path d="M12 18v6" stroke="#94A3B8" strokeWidth="2" />
             </Svg>
             <Text style={styles.lessonText}>Writing</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lessonCard} activeOpacity={0.7} onPress={() => router.push('/course' as any)}>
             <Svg width="40" height="40" viewBox="0 0 24 24">
               <Path d="M3 12v6a2 2 0 002 2h3v-8H4z" fill="#E2E8F0" />
               <Path d="M21 12v6a2 2 0 01-2 2h-3v-8h4z" fill="#E2E8F0" />
               <Path d="M3 12a9 9 0 0118 0" fill="none" stroke="#94A3B8" strokeWidth="4" />
             </Svg>
             <Text style={styles.lessonText}>Listening</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 32, 
    marginBottom: 16
  },
  title: {
    fontSize: 18, 
    fontWeight: '600', 
    color: '#64748B'
  },
  moreIcon: {
    fontSize: 24, 
    fontWeight: '700', 
    color: '#2B2D42', 
    lineHeight: 24, 
    marginTop: -8
  },
  grid: {
    flexDirection: 'row', 
    gap: 12
  },
  lessonCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
  },
  lessonText: {
    marginTop: 12,
    fontSize: 14,
    color: '#2B2D42',
    fontWeight: '500'
  }
});
