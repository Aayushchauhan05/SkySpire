import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const theme = Colors.dark;
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: theme.text }}>Profile</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.guestCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.topRow}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="person" size={40} color={theme.primary} />
            </View>
            <View style={styles.guestInfo}>
              <ThemedText type="subtitle" style={{ color: theme.text, marginBottom: 4 }}>Guest User</ThemedText>
              <ThemedText style={{ color: theme.secondaryText, fontSize: 13 }}>Learning Spanish</ThemedText>
            </View>
          </View>
          <View style={[styles.statsRow, { backgroundColor: theme.elevated, borderRadius: 16, padding: 16, marginTop: 20 }]}>
             <View style={styles.statBox}>
                <ThemedText style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>0</ThemedText>
                <ThemedText style={{ color: theme.secondaryText, fontSize: 12 }}>Streak</ThemedText>
             </View>
             <View style={{ width: 1, backgroundColor: theme.border }} />
             <View style={styles.statBox}>
                <ThemedText style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>0</ThemedText>
                <ThemedText style={{ color: theme.secondaryText, fontSize: 12 }}>XP</ThemedText>
             </View>
          </View>
          <ThemedText style={{ color: theme.secondaryText, textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
            Sign in to save your progress and unlock the leaderboard!
          </ThemedText>
          <TouchableOpacity 
            style={[styles.authBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/login')}
          >
            <ThemedText style={{ color: theme.background, fontWeight: '700' }}>Login / Sign Up</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsGroup}>
          {[
            { id: 1, icon: 'bookmark', title: 'Saved Words', color: theme.accent },
            { id: 2, icon: 'bar-chart', title: 'Learning Stats', color: theme.secondary },
            { id: 3, icon: 'settings', title: 'App Settings', color: theme.text },
            { id: 4, icon: 'notifications', title: 'Notifications', color: theme.text },
            { id: 5, icon: 'help-circle', title: 'Help & Support', color: theme.text }
          ].map((item, idx) => (
            <TouchableOpacity key={item.id} style={[styles.settingItem, idx !== 4 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
              <View style={styles.settingLabel}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
                <ThemedText style={{ color: theme.text, marginLeft: 16 }}>{item.title}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  guestCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    marginBottom: 32,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestInfo: {
    marginLeft: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsGroup: {
    backgroundColor: '#1C1830',
    borderRadius: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
