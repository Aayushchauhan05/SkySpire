import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, Books, Cards, Quotes, BookBookmark } from 'phosphor-react-native';

const Colors = {
  mainBg: '#110E1A',
  cardBg: '#1C1830',
  elevatedSurface: '#252040',
  primaryAccent: '#FF8A66', // Warm Coral
  secondaryAccent: '#9B8AF4', // Soft Purple (Used heavily here for memory/lexicon)
  amber: '#FFB800',
  error: '#FF5C7A',
  primaryText: '#F0EEF8',
  secondaryText: '#8E88B0',
};

const LEXICON_MENU = [
  { id: 'VOCABULARY', title: 'Vocabulary Dictionary', desc: 'Browse saved words and phrases.', icon: Books, color: Colors.secondaryAccent },
  { id: 'FLASHCARDS', title: 'Spaced Repetition', desc: '24 cards due for review today.', icon: Cards, color: Colors.amber },
  { id: 'IDIOMS', title: 'Native Idioms', desc: 'Sound like a local speaker.', icon: Quotes, color: Colors.primaryAccent },
];

export default function LexiconIndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeft size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lexicon Center</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.libraryBanner}>
          <BookBookmark size={48} color={Colors.secondaryAccent} weight="duotone" />
          <Text style={styles.libraryTitle}>Your Memory Vault</Text>
          <Text style={styles.libraryDesc}>
            Master vocabulary efficiently. Review your flashcards daily to ensure long-term retention.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Study Hub</Text>

        {LEXICON_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuCard}
              onPress={() => router.push(`/lexicon/${item.id}` as any)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: item.color + '15' }]}>
                <Icon size={28} color={item.color} weight="duotone" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
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
  libraryBanner: {
    backgroundColor: Colors.cardBg,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(155, 138, 244, 0.2)', // Soft Purple border
  },
  libraryTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  libraryDesc: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionHeader: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.elevatedSurface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  menuDesc: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: Colors.secondaryText,
  },
});
