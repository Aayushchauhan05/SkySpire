import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useAppStore } from '../../store/useAppStore';

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
  
  // Zustand Store
  const name = useAppStore(state => state.name);
  const targetLanguage = useAppStore(state => state.targetLanguage);
  const streakDays = useAppStore(state => state.streakDays);
  const minutesStudiedToday = useAppStore(state => state.minutesStudiedToday);
  const dailyGoalMinutes = useAppStore(state => state.dailyGoalMinutes);
  const savedWords = useAppStore(state => state.savedWords);
  const cefrLevel = useAppStore(state => state.cefrLevel);

  const progressPercent = Math.min((minutesStudiedToday / dailyGoalMinutes) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.flagBtn}>
              <ThemedText style={styles.flagEmoji}>🇪🇸</ThemedText>
              <ThemedText style={styles.langName}>{targetLanguage}</ThemedText>
              <Ionicons name="chevron-down" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
             <View style={styles.streakBadge}>
                <MaterialCommunityIcons name="fire" size={20} color={Colors.amber} />
                <ThemedText style={styles.streakText}>{streakDays}</ThemedText>
             </View>
          </View>
        </View>

        {/* GREETING */}
        <View style={styles.greetingSection}>
          <ThemedText style={styles.greetingText}>
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return 'Good morning';
              if (hour < 18) return 'Good afternoon';
              return 'Good evening';
            })()}, {name.split(' ')[0]}
          </ThemedText>
          <ThemedText style={styles.subGreetingText}>
            Ready to learn something new?
          </ThemedText>
        </View>

        {/* CONTINUE BANNER */}
        <View style={styles.continueBanner}>
           <ThemedText style={styles.continueLabel}>CONTINUE WHERE YOU LEFT OFF</ThemedText>
           <View style={styles.continueContent}>
              <View>
                 <ThemedText style={styles.continueChapter}>Unit 1: Foundations</ThemedText>
                 <ThemedText style={styles.continueSection}>Definite Articles</ThemedText>
              </View>
              <TouchableOpacity style={styles.resumeBtn} onPress={() => router.push('/chapter/1_2' as any)}>
                 <Ionicons name="play" size={20} color={Colors.white} />
                 <ThemedText style={styles.resumeText}>Resume</ThemedText>
              </TouchableOpacity>
           </View>
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
              <View>
                 <ThemedText style={[styles.largeCardTitle, {fontSize: 22}]}>Chapter 2: Greetings</ThemedText>
                 <ThemedText style={{color: Colors.white, opacity: 0.8, marginTop: 4, fontWeight: '600'}}>Lv. 2 · 45% Complete</ThemedText>
              </View>
              
              <View style={styles.levelBadge}>
                <ThemedText style={styles.levelText}>Modules</ThemedText>
              </View>
            </TouchableOpacity>

            {/* DAILY STATS PILLS */}
            <View style={styles.pillContainer}>
              <View style={styles.pill}>
                <ThemedText style={styles.pillText}>{streakDays} <ThemedText style={styles.pillSubText}>day streak</ThemedText></ThemedText>
              </View>
              <View style={styles.pill}>
                <ThemedText style={styles.pillText}>{minutesStudiedToday}/{dailyGoalMinutes} <ThemedText style={styles.pillSubText}>min goal</ThemedText></ThemedText>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightCol}>
            
            {/* PROFILE & PROGRESS */}
            <TouchableOpacity 
              style={[styles.smallCard, { backgroundColor: Colors.white, alignItems: 'flex-start', justifyContent: 'space-between' }]}
              onPress={() => router.push('/profile' as any)}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                 <Ionicons name="medal" size={24} color={Colors.amber} />
                 <ThemedText style={{fontSize: 16, fontWeight: '800', color: Colors.textDark}}>4 Badges</ThemedText>
              </View>
              <View>
                 <ThemedText style={[styles.progressLabel, {textAlign: 'left', marginTop: 0}]}>View Weekly Report</ThemedText>
              </View>
            </TouchableOpacity>

            {/* GRAMMAR / COURSE */}
            <TouchableOpacity 
              style={[styles.mediumCard, { backgroundColor: Colors.primaryAccent }]}
              onPress={() => router.push('/course' as any)}
            >
              <View>
                 <ThemedText style={styles.cardTitleWhite}>Unit 1: Foundations</ThemedText>
                 <ThemedText style={{color: Colors.white, opacity: 0.9, marginTop: 4, fontWeight: '600'}}>3/5 Ch. · 60%</ThemedText>
              </View>
              <View style={styles.iconCircle}>
                <Ionicons name="book" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>

            {/* LEXICON */}
            <TouchableOpacity 
              style={[styles.mediumCard, { backgroundColor: '#F4A261' }]} // Peach color
              onPress={() => router.push('/lexicon/index' as any)}
            >
              <View>
                 <ThemedText style={styles.cardTitleWhite}>Lexicon Space</ThemedText>
                 <ThemedText style={{color: Colors.white, opacity: 0.9, marginTop: 4, fontWeight: '600'}}>{savedWords.length} Words</ThemedText>
              </View>
              <MaterialCommunityIcons name="cards" size={40} color={Colors.white} style={styles.libraryIcon} />
            </TouchableOpacity>

          </View>
        </View>

        {/* DAILY CONTENT ROW */}
        <View style={styles.dailySection}>
          <ThemedText style={styles.dailySectionTitle}>Daily Spotlight</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16, paddingRight: 24, paddingLeft: 4}}>
            {/* Daily Word */}
            <TouchableOpacity style={[styles.longCard, {width: width * 0.75}]}>
              <View style={styles.longCardHeader}>
                <ThemedText style={styles.longCardTag}>DAILY WORD</ThemedText>
                <Ionicons name="sparkles" size={20} color={Colors.amber} />
              </View>
              <ThemedText style={styles.dailyWordText}>Desarrollar</ThemedText>
              <ThemedText style={styles.dailyDefText}>"To develop, to grow."</ThemedText>
            </TouchableOpacity>

            {/* Grammar Tip */}
            <TouchableOpacity style={[styles.longCard, {width: width * 0.75, backgroundColor: Colors.elevatedSurface}]}>
              <View style={styles.longCardHeader}>
                <ThemedText style={[styles.longCardTag, {color: Colors.cyan}]}>GRAMMAR TIP</ThemedText>
                <Ionicons name="bulb" size={20} color={Colors.cyan} />
              </View>
              <ThemedText style={styles.dailyWordText}>El vs. La</ThemedText>
              <ThemedText style={styles.dailyDefText}>Nouns ending in -o are typically masculine (el), and in -a are feminine (la).</ThemedText>
            </TouchableOpacity>

            {/* Phrase of the Week */}
            <TouchableOpacity style={[styles.longCard, {width: width * 0.75, backgroundColor: 'rgba(255, 138, 102, 0.05)', borderColor: Colors.primaryAccent, borderWidth: 1}]}>
              <View style={styles.longCardHeader}>
                <ThemedText style={[styles.longCardTag, {color: Colors.primaryAccent}]}>PHRASE OF THE WEEK</ThemedText>
                <Ionicons name="chatbubbles" size={20} color={Colors.primaryAccent} />
              </View>
              <ThemedText style={[styles.dailyWordText, {fontSize: 20}]}>"Estar en las nubes"</ThemedText>
              <ThemedText style={styles.dailyDefText}>Lit: To be in the clouds. Meaning: To be daydreaming.</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </ScrollView>

      {/* PERSISTENT BOTTOM STRIP */}
      <View style={styles.bottomStrip}>
         <View style={styles.stripLeft}>
            <MaterialCommunityIcons name="fire" size={24} color={Colors.amber} />
            <ThemedText style={styles.stripText}>{streakDays}</ThemedText>
            <View style={styles.stripDivider} />
            <View style={styles.stripProgressBg}>
               <View style={[styles.stripProgressFill, {width: `${progressPercent}%`}]} />
            </View>
            <ThemedText style={styles.stripMinsText}>{minutesStudiedToday}/{dailyGoalMinutes} min</ThemedText>
         </View>
         <View style={styles.stripRight}>
            <MaterialCommunityIcons name="cards" size={20} color={Colors.white} />
            <ThemedText style={styles.stripTextWhite}>{savedWords.length} List</ThemedText>
         </View>
      </View>
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
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  flagEmoji: {
    fontSize: 20,
  },
  langName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textHeader,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.amber,
  },
  continueBanner: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: Colors.primaryAccent,
    borderRadius: 24,
    padding: 24,
  },
  continueLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  continueContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueChapter: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 2,
  },
  continueSection: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resumeText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  bottomStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.elevatedSurface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20, // Extra padding for raw safe area if needed
  },
  stripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stripRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.secondaryAccent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  stripText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textHeader,
  },
  stripTextWhite: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  stripDivider: {
    width: 2,
    height: 16,
    backgroundColor: Colors.elevatedSurface,
    marginHorizontal: 8,
  },
  stripProgressBg: {
    width: 60,
    height: 8,
    backgroundColor: Colors.mainBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stripProgressFill: {
    height: '100%',
    backgroundColor: Colors.cyan,
    borderRadius: 4,
  },
  stripMinsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  }
});
