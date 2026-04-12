import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

interface DailyGoalCardProps {
  minutesStudiedToday: number;
  dailyGoalMinutes: number;
  progressPercent: number;
}

export const DailyGoalCard = ({ minutesStudiedToday, dailyGoalMinutes, progressPercent }: DailyGoalCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.subtitle}>Learned Today</Text>
          <Text>
            <Text style={styles.title}>{minutesStudiedToday} Min</Text>
            <Text style={styles.delimiter}> /{dailyGoalMinutes} Min</Text>
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Svg width="48" height="48" viewBox="0 0 48 48">
            <Defs>
              <LinearGradient id="trophyGrad" x1="0" y1="0" x2="1" y2="1">
                 <Stop offset="0" stopColor="#F1F5F9" />
                 <Stop offset="1" stopColor="#94A3B8" />
              </LinearGradient>
            </Defs>
            <Path d="M12 10C12 7 15 5 24 5C33 5 36 7 36 10C36 13 32 17 24 28C16 17 12 13 12 10Z" fill="url(#trophyGrad)" />
            <Path d="M22 28H26V36H22V28Z" fill="#CBD5E1" />
            <Path d="M16 36H32V40H16V36Z" fill="#94A3B8" />
            <Path d="M12 10C12 13 16 15 24 15C32 15 36 13 36 10" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 24, 
    elevation: 5
  },
  topRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  subtitle: {
    fontSize: 12, 
    color: '#A0AABF', 
    marginBottom: 4
  },
  title: {
    fontSize: 20, 
    fontWeight: '700', 
    color: '#2B2D42'
  },
  delimiter: {
    fontSize: 14, 
    fontWeight: '500', 
    color: '#A0AABF'
  },
  iconContainer: {
    width: 48, 
    height: 48
  },
  progressContainer: {
    marginTop: 16
  },
  progressTrack: {
    height: 8, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 8, 
    width: '100%', 
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%', 
    backgroundColor: '#F49320', 
    borderRadius: 8
  }
});
