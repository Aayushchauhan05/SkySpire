import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

// Restored Premium Matte Colors
const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66',     // Warm coral
  secondaryAccent: '#9B8AF4', // Soft purple
  amber: '#FFB800',
  cyan: '#00E5FF',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#110E1A',
  textMuted: '#8E88B0',
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="planet" size={32} color={Colors.primaryAccent} />
          </View>
        </View>

        {/* GREETING */}
        <View style={styles.greetingSection}>
          <ThemedText style={styles.greetingText}>
            Welcome to SkySpire
          </ThemedText>
          <ThemedText style={styles.subGreetingText}>
            Start your journey today
          </ThemedText>
        </View>

        {/* STAGGERED MASONRY GRID */}
        <View style={styles.mainGrid}>
          
          {/* LEFT COLUMN */}
          <View style={styles.leftCol}>
            
            {/* MODULES PATH */}
            <TouchableOpacity 
              style={[styles.largeCard, { backgroundColor: Colors.secondaryAccent }]}
              onPress={() => router.push('/module/SURVIVAL' as any)}
            >
              <ThemedText style={styles.largeCardTitle}>Master a new language</ThemedText>
              
              <View style={styles.levelBadge}>
                <ThemedText style={styles.levelText}>Lv.2</ThemedText>
                <ThemedText style={styles.levelLabel}>Modules</ThemedText>
              </View>
            </TouchableOpacity>

            {/* DAILY STATS PILLS */}
            <View style={styles.pillContainer}>
              <View style={styles.pill}>
                <ThemedText style={styles.pillText}>12 <ThemedText style={styles.pillSubText}>day streak</ThemedText></ThemedText>
              </View>
              <View style={styles.pill}>
                <ThemedText style={styles.pillText}>15/20 <ThemedText style={styles.pillSubText}>min goal</ThemedText></ThemedText>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightCol}>
            
            {/* PROFILE & PROGRESS */}
            <TouchableOpacity 
              style={[styles.smallCard, { backgroundColor: Colors.white }]}
              onPress={() => router.push('/profile' as any)}
            >
              <Ionicons name="person-circle-outline" size={48} color={Colors.textDark} />
              <ThemedText style={styles.progressLabel}>Your Profile</ThemedText>
            </TouchableOpacity>

            {/* GRAMMAR / COURSE */}
            <TouchableOpacity 
              style={[styles.mediumCard, { backgroundColor: Colors.primaryAccent }]}
              onPress={() => router.push('/course' as any)}
            >
              <ThemedText style={styles.cardTitleWhite}>Grammar & curriculum</ThemedText>
              <View style={styles.iconCircle}>
                <Ionicons name="book-outline" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>

            {/* LEXICON */}
            <TouchableOpacity 
              style={[styles.mediumCard, { backgroundColor: '#F4A261' }]} // Peach color
              onPress={() => router.push('/lexicon/index' as any)}
            >
              <ThemedText style={styles.cardTitleWhite}>Spaced vocabulary</ThemedText>
              <MaterialCommunityIcons name="cards-outline" size={40} color={Colors.white} style={styles.libraryIcon} />
            </TouchableOpacity>

          </View>
        </View>

        {/* DAILY CONTENT ROW */}
        <View style={styles.dailySection}>
          <ThemedText style={styles.dailySectionTitle}>Daily Spotlight</ThemedText>
          <TouchableOpacity style={styles.longCard}>
            <View style={styles.longCardHeader}>
              <ThemedText style={styles.longCardTag}>DAILY WORD</ThemedText>
              <Ionicons name="sparkles" size={20} color={Colors.amber} />
            </View>
            <ThemedText style={styles.dailyWordText}>Desarrollar</ThemedText>
            <ThemedText style={styles.dailyDefText}>"To develop, to grow."</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  greetingText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.textHeader,
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  subGreetingText: {
    fontSize: 18,
    color: Colors.textMuted,
    marginTop: 8,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  leftCol: {
    flex: 1.1,
    gap: 16,
  },
  rightCol: {
    flex: 1,
    gap: 16,
  },
  largeCard: {
    borderRadius: 40,
    padding: 28,
    height: 380,
    justifyContent: 'space-between',
  },
  largeCardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textHeader,
    lineHeight: 32,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textHeader,
  },
  levelLabel: {
    fontSize: 10,
    color: Colors.textHeader,
    opacity: 0.8,
    marginTop: -2,
    textTransform: 'uppercase',
  },
  smallCard: {
    borderRadius: 35,
    padding: 24,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '700',
  },
  mediumCard: {
    borderRadius: 35,
    padding: 24,
    height: 220,
    justifyContent: 'space-between',
  },
  cardTitleWhite: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 26,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryIcon: {
    alignSelf: 'flex-start',
  },
  pillContainer: {
    gap: 12,
    marginTop: 10,
  },
  pill: {
    backgroundColor: Colors.white,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'flex-start',
    minWidth: 160,
  },
  pillText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textDark,
  },
  pillSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  dailySection: {
    marginTop: 8,
  },
  dailySectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  longCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 35,
    padding: 24,
  },
  longCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  longCardTag: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.amber,
    letterSpacing: 1.5,
  },
  dailyWordText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textHeader,
    marginBottom: 4,
  },
  dailyDefText: {
    fontSize: 16,
    color: Colors.textMuted,
    lineHeight: 24,
  }
});
