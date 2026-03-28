import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, CaretRight, User, Fire, Sparkle, Gear, BellRinging, Question, BookmarkSimple, TrendUp } from 'phosphor-react-native';
import { useAppStore } from '../store/useAppStore';

const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66', // Warm Coral
  secondaryAccent: '#9B8AF4', // Soft Purple
  amber: '#FFB800',
  error: '#FF5C7A',
  cyan: '#00E5FF',
  white: '#FFFFFF',
  primaryText: '#F0EEF8',
  secondaryText: '#8E88B0',
  textMuted: '#8E88B0',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('PROGRESS');
  
  const { name, targetLanguage, streakDays, xp } = useAppStore();

  const BADGES = [
    { id: 1, title: 'Early Bird', unlocked: true, icon: TrendUp },
    { id: 2, title: 'Flame 10', unlocked: true, icon: Fire },
    { id: 3, title: 'Scholar', unlocked: false, icon: Sparkle },
    { id: 4, title: 'Explorer', unlocked: false, icon: User },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerRightBtn}>
           <Gear size={24} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userTopRow}>
            <View style={styles.avatarBox}>
               <User size={40} color={Colors.primaryAccent} weight="duotone" />
            </View>
            <View style={styles.userInfo}>
               <Text style={styles.userName}>{name}</Text>
               <Text style={styles.userLang}>Learning {targetLanguage}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
             <View style={styles.statBox}>
                <Fire size={24} color={Colors.amber} weight="fill" />
                <Text style={styles.statNumber}>{streakDays}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statBox}>
                <Sparkle size={24} color={Colors.primaryAccent} weight="fill" />
                <Text style={styles.statNumber}>{xp}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
             </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['PROGRESS', 'COLLECTION', 'TOOLS', 'SETTINGS'].map((tab) => (
             <TouchableOpacity 
               key={tab} 
               style={[styles.profileTab, activeTab === tab && styles.profileTabActive]}
               onPress={() => setActiveTab(tab)}
             >
               <Text style={[styles.profileTabText, activeTab === tab && styles.profileTabTextActive]}>{tab}</Text>
             </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'PROGRESS' && (
          <View>
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>Activity Heatmap</Text>
            </View>
            <View style={styles.heatmapCard}>
               {/* 7 columns, 4 rows dummy heatmap */}
               {Array.from({length: 4}).map((_, rowIndex) => (
                 <View key={rowIndex} style={styles.heatmapRow}>
                   {Array.from({length: 7}).map((_, colIndex) => {
                     const intensity = Math.random();
                     return (
                       <View 
                         key={colIndex} 
                         style={[styles.heatmapSquare, intensity > 0.7 ? {backgroundColor: Colors.primaryAccent} : intensity > 0.3 ? {backgroundColor: 'rgba(255, 138, 102, 0.4)'} : null]} 
                       />
                     );
                   })}
                 </View>
               ))}
               <Text style={{color: Colors.textMuted, fontSize: 13, marginTop: 12}}>{streakDays} Day Streak • {xp} XP Globally</Text>
            </View>

            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>Weekly Challenge</Text>
            </View>
            <TouchableOpacity style={styles.challengeCard}>
                <View style={[styles.avatarBox, {width: 48, height: 48, backgroundColor: 'rgba(255,184,0,0.2)'}]}>
                   <TrendUp size={24} color={Colors.amber} />
                </View>
                <View style={{flex: 1, marginLeft: 16}}>
                   <Text style={[styles.sectionTitle, {color: Colors.white, marginBottom: 4}]}>Master 20 Verbs</Text>
                   <Text style={{color: Colors.textMuted, fontSize: 13}}>Ends in 2 days. 15/20 completed.</Text>
                </View>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'COLLECTION' && (
          <View>
            <View style={styles.sectionHeaderWrap}>
               <Text style={styles.sectionTitle}>Your Badges</Text>
               <Text style={styles.viewAllText}>View All</Text>
            </View>
            
            <View style={styles.badgesGrid}>
               {BADGES.map(badge => {
                 const Icon = badge.icon;
                 return (
                   <View key={badge.id} style={[styles.badgeItem, !badge.unlocked && styles.badgeItemLocked]}>
                     <View style={[styles.badgeIconWrap, { backgroundColor: badge.unlocked ? 'rgba(255, 138, 102, 0.15)' : Colors.elevatedSurface }]}>
                        <Icon size={32} color={badge.unlocked ? Colors.primaryAccent : Colors.secondaryText} weight={badge.unlocked ? "duotone" : "regular"} />
                     </View>
                     <Text style={[styles.badgeTitle, !badge.unlocked && { color: Colors.secondaryText }]}>{badge.title}</Text>
                   </View>
                 )
               })}
            </View>

            <View style={styles.sectionHeaderWrap}>
               <Text style={styles.sectionTitle}>Saved Content</Text>
            </View>
            <View style={styles.settingsGroup}>
               <TouchableOpacity style={styles.settingsRow}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(155, 138, 244, 0.1)' }]}>
                     <BookmarkSimple size={24} color={Colors.secondaryAccent} />
                  </View>
                  <Text style={styles.settingsLabel}>My Notes</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>
               <View style={styles.settingsDivider} />
               <TouchableOpacity style={styles.settingsRow}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(0, 229, 255, 0.1)' }]}>
                     <BookmarkSimple size={24} color={Colors.cyan} />
                  </View>
                  <Text style={styles.settingsLabel}>Saved Grammar Rules</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'TOOLS' && (
          <View>
             <View style={styles.settingsGroup}>
               <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/lexicon/index' as any)}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(255, 184, 0, 0.1)' }]}>
                     <Sparkle size={24} color={Colors.amber} />
                  </View>
                  <Text style={styles.settingsLabel}>Flashcard Deck (Spaced Rep)</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>
               <View style={styles.settingsDivider} />
               <TouchableOpacity style={styles.settingsRow}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(155, 138, 244, 0.1)' }]}>
                     <Fire size={24} color={Colors.secondaryAccent} />
                  </View>
                  <Text style={styles.settingsLabel}>Grammar Reference Index</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'SETTINGS' && (
          <View>
            <View style={styles.settingsGroup}>
               <TouchableOpacity style={styles.settingsRow}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(255, 184, 0, 0.1)' }]}>
                     <BellRinging size={24} color={Colors.amber} />
                  </View>
                  <Text style={styles.settingsLabel}>Notifications</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>

               <View style={styles.settingsDivider} />

               <TouchableOpacity style={styles.settingsRow}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(255, 92, 122, 0.1)' }]}>
                     <Question size={24} color={Colors.error} />
                  </View>
                  <Text style={styles.settingsLabel}>Help & Support</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>
               
               <View style={styles.settingsDivider} />

               <TouchableOpacity style={styles.settingsRow}>
                  <View style={[styles.settingsIconWrap, { backgroundColor: 'rgba(0, 229, 255, 0.1)' }]}>
                     <Sparkle size={24} color={Colors.cyan} />
                  </View>
                  <Text style={styles.settingsLabel}>Subscription & Billing</Text>
                  <Text style={{color: Colors.cyan, fontSize: 13, fontWeight: '700', marginRight: 8}}>Pro</Text>
                  <CaretRight size={20} color={Colors.secondaryText} />
               </TouchableOpacity>
            </View>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutBtn} onPress={() => router.push('/login')}>
               <Text style={styles.signOutText}>Sign In / Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  userTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 138, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  userLang: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: Colors.cardBg,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  viewAllText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryAccent,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  badgeItem: {
    width: '23%',
    alignItems: 'center',
  },
  badgeItemLocked: {
    opacity: 0.6,
  },
  badgeIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  settingsGroup: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  settingsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsLabel: {
    flex: 1,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginLeft: 16,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: Colors.elevatedSurface,
  },
  signOutBtn: {
    backgroundColor: Colors.elevatedSurface,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.elevatedSurface,
  },
  profileTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  profileTabActive: {
    borderBottomColor: Colors.primaryAccent,
  },
  profileTabText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '800',
    color: Colors.secondaryText,
    letterSpacing: 0.5,
  },
  profileTabTextActive: {
    color: Colors.white,
  },
  heatmapCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  heatmapRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  heatmapSquare: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.elevatedSurface,
  },
  challengeCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.elevatedSurface,
  }
});
