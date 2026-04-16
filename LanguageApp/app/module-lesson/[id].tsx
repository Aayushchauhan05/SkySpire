import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../../components/themed-text';
import { useCourseStore } from '../../store/useCourseStore';

const { width } = Dimensions.get('window');

const Colors = {
  mainBg: '#121212',
  cardBg: '#1A1A1A',
  elevatedSurface: '#252040',
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { currentChapter, isLoading, error, fetchChapter, markTabComplete } = useCourseStore();
  const userId = 'demo_user';

  const [activeTab, setActiveTab] = useState('READ');
  const [listenSpeed, setListenSpeed] = useState('1.0x');
  const [listenMode, setListenMode] = useState('Read & Listen');
  const [showSpeakAnswer, setShowSpeakAnswer] = useState(false);
  const [writeAnswered, setWriteAnswered] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchChapter(id, userId);
  }, [id]);

  useEffect(() => {
    // Automatically mark tab as completed when visited, or we could add specific actions
    if (id && currentChapter && !currentChapter.completedTabs?.includes(activeTab.toLowerCase())) {
       markTabComplete(id, activeTab.toLowerCase(), userId);
    }
  }, [activeTab, currentChapter]);

  if (isLoading || !currentChapter) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </SafeAreaView>
    );
  }

  // Check if all 4 tabs are done (or if backend provided isCompleted)
  const tabsDoneCount = currentChapter.completedTabs?.length || 0;
  const isAllCompleted = tabsDoneCount === 4 || currentChapter.isCompleted;

  const renderRead = () => {
    const readData = currentChapter.tabs?.read || {};
    return (
      <View style={styles.tabContent}>
        <ThemedText style={styles.contentTitle}>{currentChapter.title}</ThemedText>
        <View style={styles.readCard}>
          <ThemedText style={styles.readingText}>
            {readData.passage || 'Read passage not available...'}
          </ThemedText>
        </View>
        <ThemedText style={styles.hintText}>💡 Notice the context and sentence structure.</ThemedText>
        
        {readData.comprehensionQuestions && readData.comprehensionQuestions.length > 0 && (
          <>
            <ThemedText style={styles.contentSubtitle}>Comprehension check</ThemedText>
            {readData.comprehensionQuestions.map((q: any, idx: number) => (
               <View key={idx} style={{ marginBottom: 16 }}>
                 <ThemedText style={{ color: Colors.white, marginBottom: 12, fontSize: 16 }}>{q.question}</ThemedText>
                 {q.options.map((opt: string, oIdx: number) => (
                   <TouchableOpacity key={oIdx} style={styles.quizOptionBtn}>
                      <ThemedText style={styles.quizOptionText}>{opt}</ThemedText>
                   </TouchableOpacity>
                 ))}
               </View>
            ))}
          </>
        )}
      </View>
    );
  };

  const renderListen = () => {
    const listenData = currentChapter.tabs?.listen || {};
    return (
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

        {listenMode === 'Read & Listen' && listenData.transcript && (
          <View style={styles.karaokeCard}>
            <ThemedText style={styles.karaokeTextActive}>{listenData.transcript}</ThemedText>
            <ThemedText style={{color: Colors.textMuted, marginTop: 8}}>Tap any sentence to replay.</ThemedText>
          </View>
        )}
      </View>
    );
  };

  const renderSpeak = () => {
    const speakData = currentChapter.tabs?.speak || {};
    return (
      <View style={styles.tabContent}>
        <ThemedText style={styles.contentSubtitle}>Dialogue</ThemedText>
        {speakData.dialogue?.map((line: any, idx: number) => (
          <View key={idx} style={styles.phoneticsCard}>
             <ThemedText style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 4 }}>{line.speaker}</ThemedText>
             <ThemedText style={styles.targetLang}>{line.target}</ThemedText>
             <ThemedText style={styles.englishLang}>{line.translation}</ThemedText>
             <ThemedText style={styles.phoneticsLang}>[{line.phonetics}]</ThemedText>
          </View>
        ))}

        {speakData.culturalNote && (
          <View style={styles.contextBox}>
             <Ionicons name="bulb" size={20} color={Colors.amber} />
             <ThemedText style={styles.contextText}><ThemedText style={{fontWeight: '800'}}>Cultural Note:</ThemedText> {speakData.culturalNote}</ThemedText>
          </View>
        )}

        {speakData.rolePlayPrompt && (
          <>
            <ThemedText style={styles.contentSubtitle}>Role Play: Your Turn</ThemedText>
            <View style={styles.rolePlayCard}>
               <ThemedText style={styles.rolePlayPrompt}>{speakData.rolePlayPrompt}</ThemedText>
               
               {!showSpeakAnswer ? (
                  <TouchableOpacity style={styles.revealBtn} onPress={() => setShowSpeakAnswer(true)}>
                     <ThemedText style={styles.revealBtnText}>Reveal Model Answer</ThemedText>
                  </TouchableOpacity>
               ) : (
                  <View style={styles.revealedAnswer}>
                     <ThemedText style={styles.targetLang}>{speakData.rolePlayModelAnswer}</ThemedText>
                  </View>
               )}
            </View>
          </>
        )}
      </View>
    );
  };

  const renderWrite = () => {
    const writeData = currentChapter.tabs?.write || {};
    return (
      <View style={styles.tabContent}>
        <View style={styles.writeInstructionCard}>
           <ThemedText style={styles.writeInstruction}>{writeData.task || 'Construct the correct response.'}</ThemedText>
           {writeData.exampleResponse && (
             <View style={styles.exampleBox}>
                <ThemedText style={{color: Colors.textMuted, fontSize: 13, marginBottom: 4}}>EXAMPLE</ThemedText>
                <ThemedText style={{color: Colors.white, fontSize: 16}}>{writeData.exampleResponse}</ThemedText>
             </View>
           )}
        </View>

        {writeData.options && writeData.options.length > 0 && (
          <>
             <ThemedText style={styles.contentSubtitle}>Select correct structure:</ThemedText>
             {writeData.options.map((optGroup: any, gIdx: number) => (
                <View key={gIdx} style={{ marginBottom: 24 }}>
                   <ThemedText style={{ color: Colors.textMuted, marginBottom: 12 }}>{optGroup.prompt}</ThemedText>
                   
                   {/* We assume distractors and correctAnswer are mixed in a real scenario. Here we just map them simply. */}
                   <TouchableOpacity 
                      style={[styles.quizOptionBtn, writeAnswered === 'correct' && {backgroundColor: 'rgba(74, 222, 128, 0.2)', borderColor: '#4ADE80'}]}
                      onPress={() => setWriteAnswered('correct')}
                   >
                      <ThemedText style={styles.quizOptionText}>{optGroup.correctAnswer}</ThemedText>
                      {writeAnswered === 'correct' && <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />}
                   </TouchableOpacity>

                   {optGroup.distractors?.map((dist: string, dIdx: number) => (
                      <TouchableOpacity 
                         key={dIdx}
                         style={[styles.quizOptionBtn, writeAnswered === `dist_${dIdx}` && {borderColor: Colors.error}]}
                         onPress={() => setWriteAnswered(`dist_${dIdx}`)}
                      >
                         <ThemedText style={styles.quizOptionText}>{dist}</ThemedText>
                      </TouchableOpacity>
                   ))}
                </View>
             ))}
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSmall}>
          <Ionicons name="close" size={28} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.timelineTabs}>
           {TABS.map((tab) => (
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

         {/* End of Chapter Quiz Prompt - Shows up strictly when 4 tabs are reported completed from backend mapping */}
         {isAllCompleted && (
            <TouchableOpacity 
               style={styles.endQuizCard}
               onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  router.push(`/quiz/${id}?type=module` as any);
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
    marginBottom: 16,
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
