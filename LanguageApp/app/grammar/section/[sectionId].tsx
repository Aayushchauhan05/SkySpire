import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGrammarStore } from '../../../store/useGrammarStore';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  mainBg: '#FAFCFC',
  cardBg: '#FFFFFF',
  elevatedSurface: '#F3F4F6',
  primaryAccent: '#259D7A',
  secondaryAccent: '#F49320',
  amber: '#FFB800',
  success: '#22c55e',
  primaryText: '#2B2D42',
  secondaryText: '#A0AABF',
  border: '#E2E8F0',
};

export default function SectionReaderScreen() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
  const router = useRouter();
  const { markSectionComplete } = useGrammarStore();

  const [data, setData] = useState<{ section: any; examples: any[] } | null>(null);

  const API_URL = 'http://192.168.29.34:3000/api/grammar'; // Match backend env

  useEffect(() => {
    if (sectionId) {
      fetch(`${API_URL}/sections/${sectionId}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }
  }, [sectionId]);

  const handleMarkDone = () => {
    if (data?.section) {
      markSectionComplete(data.section.chapter_id, sectionId);
      router.back();
    }
  };

  if (!data) return (
    <SafeAreaView style={[styles.container, styles.centerContainer]} edges={['top', 'left', 'right', 'bottom']}>
      <ActivityIndicator size="large" color={Colors.primaryAccent} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="close" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sec {data.section.section_number}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{data.section.title}</Text>

        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{data.section.content}</Text>
        </View>

        {data.examples?.length > 0 && (
          <View style={styles.examplesSection}>
            <Text style={styles.examplesHeading}>Examples in context</Text>
            {data.examples.map((ex, i) => (
              <View key={ex._id} style={styles.exampleCard}>
                <View style={styles.exampleRow}>
                  <Text style={styles.flagIcon}>🇪🇸</Text>
                  <Text style={styles.spanishText}>{ex.spanish}</Text>
                </View>
                <View style={[styles.exampleRow, { marginTop: 12 }]}>
                  <Text style={styles.flagIcon}>🇬🇧</Text>
                  <Text style={styles.englishText}>{ex.english}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={handleMarkDone}
          activeOpacity={0.9}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.completeBtnText}>Mark Section Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    color: Colors.secondaryText,
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 18,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryText,
    marginBottom: 24,
    lineHeight: 40,
  },
  contentCard: {
    backgroundColor: Colors.cardBg,
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 3,
  },
  contentText: {
    color: Colors.primaryText,
    fontSize: 18,
    lineHeight: 28,
  },
  examplesSection: {
    marginBottom: 32,
  },
  examplesHeading: {
    color: Colors.secondaryText,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  exampleCard: {
    backgroundColor: Colors.elevatedSurface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flagIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  spanishText: {
    color: Colors.primaryText,
    fontWeight: '700',
    fontSize: 18,
    flex: 1,
    lineHeight: 26,
  },
  englishText: {
    color: Colors.secondaryText,
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.mainBg,
  },
  completeBtn: {
    backgroundColor: Colors.primaryAccent,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  completeBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
    marginLeft: 8,
  },
});
