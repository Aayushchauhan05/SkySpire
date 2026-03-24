import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ThemedButton';

const { width } = Dimensions.get('window');

// Dummy Auth State (Logic Restoration)
const isLoggedIn = false;

// Theme Colors (Screenshot Inspired)
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
  buttonBg: '#1A1A1A',
};

export default function HomeScreen() {
  const router = useRouter();

  const handleAuthAction = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER (Now Scrollable) */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="planet" size={32} color={Colors.primaryAccent} />
          </View>

          <View style={styles.headerRight}>
            {!isLoggedIn && (
              <TouchableOpacity onPress={handleAuthAction} style={styles.loginBtn}>
                <ThemedText style={styles.loginBtnText}>Log In</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.greetingSection}>
          <ThemedText style={styles.greetingText}>
            {isLoggedIn ? "Hello. Maria!" : "Welcome to SkySpire"}
          </ThemedText>
          <ThemedText style={styles.subGreetingText}>
            {isLoggedIn ? "Ready to learn Spanish?" : "Start your journey today"}
          </ThemedText>
        </View>

        <View style={styles.mainGrid}>
          {/* ... mainGrid content remains the same */}
          {/* LEFT COLUMN */}
          <View style={styles.leftCol}>
            <TouchableOpacity 
              style={[styles.largeCard, { backgroundColor: Colors.secondaryAccent }]}
              onPress={() => router.push('/(tabs)/course' as any)}
            >
              <ThemedText style={styles.largeCardTitle}>Master a new language</ThemedText>
              
              <View style={styles.levelBadge}>
                <ThemedText style={styles.levelText}>A+</ThemedText>
                <ThemedText style={styles.levelLabel}>Level</ThemedText>
              </View>
            </TouchableOpacity>

            <View style={styles.pillContainer}>
              <View style={styles.pill}>
                <ThemedText style={styles.pillText}>150+ <ThemedText style={styles.pillSubText}>lessons</ThemedText></ThemedText>
              </View>
              <View style={styles.pill}>
                <ThemedText style={styles.pillText}>100k+ <ThemedText style={styles.pillSubText}>learners</ThemedText></ThemedText>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightCol}>
            {isLoggedIn ? (
              <TouchableOpacity style={[styles.smallCard, { backgroundColor: Colors.white }]}>
                <ThemedText style={styles.progressValue}>55%</ThemedText>
                <ThemedText style={styles.progressLabel}>Your learning progress</ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.smallCard, { backgroundColor: Colors.white }]} onPress={handleAuthAction}>
                <Ionicons name="trophy-outline" size={40} color={Colors.textDark} />
                <ThemedText style={styles.progressLabel}>Track your progress</ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.mediumCard, { backgroundColor: Colors.primaryAccent }]}>
              <ThemedText style={styles.cardTitleWhite}>Practice speaking & listening</ThemedText>
              <View style={styles.iconCircle}>
                <Ionicons name="chatbubble-outline" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>

            {isLoggedIn ? (
              <TouchableOpacity style={[styles.mediumCard, { backgroundColor: '#F4A261' }]}>
                <ThemedText style={styles.cardTitleWhite}>Language vocabulary</ThemedText>
                <MaterialCommunityIcons name="bookshelf" size={40} color={Colors.white} style={styles.libraryIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.mediumCard, { backgroundColor: Colors.amber }]} onPress={handleAuthAction}>
                <ThemedText style={styles.cardTitleBlack}>Unlock All Features</ThemedText>
                <Ionicons name="lock-open-outline" size={40} color={Colors.textDark} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* BOTTOM ACTION */}
        <ThemedButton 
          title={isLoggedIn ? "Free trial 30 days" : "Sign Up with Email"} 
          onPress={isLoggedIn ? () => {} : handleAuthAction}
          style={styles.trialButton}
          textColor={isLoggedIn ? Colors.white : Colors.textDark}
          darkColor={isLoggedIn ? Colors.buttonBg : Colors.white}
        />

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
    // Removed Platform-specific paddingTop
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
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  loginBtnText: {
    color: Colors.textHeader,
    fontWeight: '700',
    fontSize: 15,
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
    marginBottom: 40,
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
  },
  smallCard: {
    borderRadius: 35,
    padding: 24,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textDark,
  },
  progressLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
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
  cardTitleBlack: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textDark,
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
  trialButton: {
    height: 80,
    borderRadius: 40,
    marginTop: 10,
  },
});
