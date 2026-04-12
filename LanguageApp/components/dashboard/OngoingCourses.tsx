import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DonutChart } from './DonutChart';

export interface BookType {
  _id: string;
  title: string;
  language?: string;
  total_chapters?: number;
}

interface OngoingCoursesProps {
  books: BookType[];
  onCoursePress: (bookId: string) => void;
}

const INACTIVE_COLORS = [
  { track: '#FFE4E1', fill: '#F28B82' },
  { track: '#FFF5E6', fill: '#F49320' },
  { track: '#E6F0FF', fill: '#4A90E2' },
];

export const OngoingCourses = ({ books, onCoursePress }: OngoingCoursesProps) => {
  const router = useRouter();

  return (
    <View>
      <View style={styles.header}>
         <Text style={styles.title}>Ongoing Courses</Text>
         <TouchableOpacity onPress={() => router.push('/course' as any)}>
           <Text style={styles.moreIcon}>...</Text>
         </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        snapToInterval={156} 
        decelerationRate="fast" 
        style={styles.scrollWrapper} 
        contentContainerStyle={styles.scrollContainer}
      >
        {books.length > 0 ? books.map((book, idx) => {
          const isActive = idx === 0;
          const completion = isActive ? 48 : (idx === 1 ? 70 : 60);

          if (isActive) {
            return (
              <TouchableOpacity 
                key={book._id} 
                activeOpacity={0.8}
                onPress={() => onCoursePress(book._id)}
                style={styles.activeCard}>
                <DonutChart percent={completion} trackColor="rgba(255,255,255,0.3)" fillColor="#FFFFFF" textColor="#FFFFFF" />
                <View>
                  <Text style={styles.activeText} numberOfLines={2}>{book.title}</Text>
                  <Text style={styles.activeSubtext}>{100 - completion}% remaining</Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            const colorTheme = INACTIVE_COLORS[(idx - 1) % INACTIVE_COLORS.length];
            return (
              <TouchableOpacity 
                key={book._id} 
                activeOpacity={0.8}
                onPress={() => onCoursePress(book._id)}
                style={styles.inactiveCard}>
                <DonutChart percent={completion} trackColor={colorTheme.track} fillColor={colorTheme.fill} textColor="#2B2D42" />
                <View>
                  <Text style={styles.inactiveText} numberOfLines={2}>{book.title}</Text>
                  <Text style={styles.inactiveSubtext}>{100 - completion}% remaining</Text>
                </View>
              </TouchableOpacity>
            );
          }
        }) : (
          <Text style={{ color: '#A0AABF' }}>Loading courses...</Text>
        )}
      </ScrollView>
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
    paddingHorizontal: 4, 
    marginTop: -8
  },
  scrollWrapper: {
    marginHorizontal: -24
  },
  scrollContainer: {
    paddingHorizontal: 24, 
    paddingVertical: 8, 
    gap: 16
  },
  activeCard: {
    backgroundColor: '#259D7A', 
    width: 140, 
    height: 180, 
    borderRadius: 20, 
    padding: 16, 
    justifyContent: 'space-between', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 4
  },
  activeText: {
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 16, 
    lineHeight: 19
  },
  activeSubtext: {
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 11, 
    marginTop: 4
  },
  inactiveCard: {
    backgroundColor: '#FFFFFF', 
    width: 140, 
    height: 180, 
    borderRadius: 20, 
    padding: 16, 
    justifyContent: 'space-between', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 16, 
    elevation: 3
  },
  inactiveText: {
    color: '#2B2D42', 
    fontWeight: '700', 
    fontSize: 16, 
    lineHeight: 19
  },
  inactiveSubtext: {
    color: '#A0AABF', 
    fontSize: 11, 
    marginTop: 4
  }
});
