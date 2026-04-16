import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../../components/themed-text';

const { width } = Dimensions.get('window');

const Colors = {
  mainBg: '#121212',
  cardBg: '#1A1A1A',
  elevatedSurface: '#1A1A1A',
  primaryAccent: '#FF8660',
  secondaryAccent: '#9A98FF',
  amber: '#ECFF4D',
  error: '#FF5C7A',
  cyan: '#4FDBF0',
  white: '#FFFFFF',
  textHeader: '#FFFFFF',
  textDark: '#000000',
  textMuted: '#A0A0A0',
};

const TABS = ['READ', 'LISTEN', 'SPEAK', 'WRITE'];

export default function ModuleLessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('READ');
  const [listenSpeed, setListenSpeed] = useState('1.0x');
  const [listenMode, setListenMode] = useState('Read & Listen');
  const [showSpeakAnswer, setShowSpeakAnswer] = useState(false);
  const [writeAnswered, setWriteAnswered] = useState<string | null>(null);

  const isAllCompleted = true; // Hardcoded for demo to show quiz

  const renderRead = () => (
    <View style={styles.tabContent}>
      <ThemedText style={styles.contentTitle}>Ordering Coffee in Madrid</ThemedText>
      <View style={styles.readCard}>
        <ThemedText style={styles.readingText}>
          Ayer fui a una cafetería en Madrid. El camarero me preguntó: "¿Qué vas a tomar?" Yo le respondí: "Quiero un <ThemedText style={{color: Colors.primaryAccent, fontWeight: '800'}}>café con leche</ThemedText>, por favor." El ambiente era muy diferente al de mi país. Las personas estaban de pie junto a la barra, hablando muy alto y rápido.
        </ThemedText>
      </View>
      <ThemedText style={styles.hintText}>💡 Tap any highlighted word for instant definition.</ThemedText>
      
      <ThemedText style={styles.contentSubtitle}>Comprehension check</ThemedText>
      <TouchableOpacity style={styles.quizOptionBtn}>
         <ThemedText style={styles.quizOptionText}>Where did the person go?</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderListen = () => (
    <View style={styles.tabContent}>
      <View style={styles.listenHeader}>
        <TouchableOpacity style={styles.modeDropdownBtn} onPress={() => setListenMode(listenMode === 'Read & Listen' ? 'Dictation' : 'Read & Listen')}>
           <ThemedText style={styles.modeBtnText}>{listenMode}</ThemedText>
           <Ionicons name="chevron-down" size={16} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.speedBtn} onPress={() => setListenSpeed(listenSpeed === '1.0x' ? '0.75x' : '1.0x')}>
           <ThemedText style={styles.speedBtnText}>{listenSpeed}</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.audioPlayerCard}>
         <TouchableOpacity style={styles.playBigCircle}>
           <Ionicons name="play" size={48} color={Colors.white} style={{marginLeft: 6}} />
         </TouchableOpacity>
         <View style={styles.wavePlaceholder} />
      </View>

      {listenMode === 'Read & Listen' && (
        <View style={styles.karaokeCard}>
          <ThemedText style={styles.karaokeTextActive}>¿Qué vas a tomar?</ThemedText>
          <ThemedText style={styles.karaokeText}>Quiero un café con leche.</ThemedText>
          <ThemedText style={{color: Colors.textMuted, marginTop: 8}}>Tap any sentence to replay.</ThemedText>
        </View>
      )}

      {/* Native Speaker Box */}
      <View style={styles.speakerProfile}>
         <View style={styles.speakerAvatar}><ThemedText style={{fontSize: 24}}>🇪🇸</ThemedText></View>
         <View>
            <ThemedText style={styles.speakerName}>Carlos V.</ThemedText>
            <ThemedText style={styles.speakerRegion}>Madrid, Spain</ThemedText>
         </View>
      </View>
    </View>
  );

  const renderSpeak = () => (
    <View style={styles.tabContent}>
      <View style={styles.phoneticsCard}>
         <ThemedText style={styles.targetLang}>Quiero un café con leche.</ThemedText>
         <ThemedText style={styles.englishLang}>I want a coffee with milk.</ThemedText>
         <ThemedText style={styles.phoneticsLang}>[kee-EH-roh oon kah-FEH kohn LEH-cheh]</ThemedText>
      </View>

      <View style={styles.contextBox}>
         <Ionicons name="bulb" size={20} color={Colors.amber} />
         <ThemedText style={styles.contextText}><ThemedText style={{fontWeight: '800'}}>Tip:</ThemedText> In Spain, it's common to just say "Un café, por favor" rather than "Me gustaría...".</ThemedText>
      </View>

      <ThemedText style={styles.contentSubtitle}>Role Play: Your Turn</ThemedText>
      <View style={styles.rolePlayCard}>
         <ThemedText style={styles.rolePlayPrompt}>The waiter asks: "¿Algo para comer?"</ThemedText>
         <ThemedText style={styles.rolePlayInstruction}>Reply that you want a croissant.</ThemedText>
         
         {!showSpeakAnswer ? (
            <TouchableOpacity style={styles.revealBtn} onPress={() => setShowSpeakAnswer(true)}>
               <ThemedText style={styles.revealBtnText}>Reveal Correct Answer</ThemedText>
            </TouchableOpacity>
         ) : (
            <View style={styles.revealedAnswer}>
               <ThemedText style={styles.targetLang}>Sí, un cruasán por favor.</ThemedText>
            </View>
         )}
      </View>
    </View>
  );

  const renderWrite = () => (
    <View style={styles.tabContent}>
      <View style={styles.writeInstructionCard}>
         <ThemedText style={styles.writeInstruction}>Choose the formally correct written response to an email booking request.</ThemedText>
         <View style={styles.exampleBox}>
            <ThemedText style={{color: Colors.textMuted, fontSize: 13, marginBottom: 4}}>EXAMPLE</ThemedText>
            <ThemedText style={{color: Colors.white, fontSize: 16}}>Estimado señor, le confirmo su reserva.</ThemedText>
         </View>
      </View>

      <ThemedText style={styles.contentSubtitle}>Select correct structure:</ThemedText>
      
      <TouchableOpacity 
         style={[styles.quizOptionBtn, writeAnswered === 'A' && {borderColor: Colors.error}]}
         onPress={() => setWriteAnswered('A')}
      >
         <ThemedText style={styles.quizOptionText}>Hola señor, su mesa está lista.</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
         style={[styles.quizOptionBtn, writeAnswered === 'B' && {backgroundColor: 'rgba(74, 222, 128, 0.2)', borderColor: '#4ADE80'}]}
         onPress={() => setWriteAnswered('B')}
      >
         <ThemedText style={styles.quizOptionText}>Estimado cliente, su mesa está reservada.</ThemedText>
         {writeAnswered === 'B' && <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSmall}>
          <Ionicons name="close" size={28} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.timelineTabs}>
           {TABS.map((tab, idx) => (
             <TouchableOpacity 
                key={tab}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                onPress={() => {
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                   setActiveTab(tab);
                }}
             >
                <ThemedText style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</ThemedText>
             </TouchableOpacity>
           ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} bounces={true} decelerationRate="fast">
         {activeTab === 'READ' && renderRead()}
         {activeTab === 'LISTEN' && renderListen()}
         {activeTab === 'SPEAK' && renderSpeak()}
         {activeTab === 'WRITE' && renderWrite()}

         {/* End of Chapter Quiz Prompt */}
         {isAllCompleted && (
            <TouchableOpacity 
               style={styles.endQuizCard}
               onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  router.push(`/quiz/${id}` as any);
               }}
            >
               <Ionicons name="trophy" size={32} color={Colors.white} />
               <View style={{flex: 1, marginLeft: 16}}>
                  <ThemedText style={styles.endQuizTitle}>Chapter Complete!</ThemedText>
                  <ThemedText style={styles.endQuizSub}>Take the 5-question final quiz.</ThemedText>
               </View>
               <Ionicons name="arrow-forward" size={24} color={Colors.white} />
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  backBtnSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineTabs: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  tabBtnActive: {
    backgroundColor: Colors.secondaryAccent,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: Colors.white,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  tabContent: {
    paddingTop: 16,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textHeader,
    marginBottom: 24,
  },
  contentSubtitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textHeader,
    marginTop: 32,
    marginBottom: 16,
  },
  readCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
  },
  readingText: {
    fontSize: 20,
    color: Colors.white,
    lineHeight: 32,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  quizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    borderWidth: 2,
    borderColor: Colors.elevatedSurface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  // Listen tab
  listenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modeDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 138, 244, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(155, 138, 244, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  modeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.secondaryAccent,
  },
  speedBtn: {
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  speedBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  audioPlayerCard: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 30,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  playBigCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  wavePlaceholder: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  karaokeCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  karaokeTextActive: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.cyan,
    marginBottom: 12,
  },
  karaokeText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  speakerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
  },
  speakerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.elevatedSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  speakerRegion: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  // Speak Tab
  phoneticsCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  targetLang: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  englishLang: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  phoneticsLang: {
    fontSize: 14,
    color: Colors.amber,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  contextBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  contextText: {
    flex: 1,
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },
  rolePlayCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.elevatedSurface,
  },
  rolePlayPrompt: {
    fontSize: 16,
    color: Colors.white,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  rolePlayInstruction: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondaryAccent,
    marginBottom: 24,
  },
  revealBtn: {
    backgroundColor: Colors.elevatedSurface,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  revealBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  revealedAnswer: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4ADE80',
  },
  // Write Tab
  writeInstructionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  writeInstruction: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 26,
    marginBottom: 16,
  },
  exampleBox: {
    backgroundColor: Colors.elevatedSurface,
    borderRadius: 12,
    padding: 16,
  },
  endQuizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.amber,
    padding: 24,
    borderRadius: 24,
    marginTop: 40,
  },
  endQuizTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.mainBg,
  },
  endQuizSub: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)',
  }
});
