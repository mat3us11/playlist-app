import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadSongs } from '../src/storage/songsStorage';
import { Colors, Radius, Shadow, Spacing } from '../src/theme';
import type { Song } from '../src/types';

export default function Index() {
  const [songs, setSongs] = React.useState<Song[]>([]);
  const refresh = React.useCallback(async () => setSongs(await loadSongs()), []);
  useFocusEffect(React.useCallback(() => { refresh(); }, [refresh]));

  const renderItem = ({ item, index }: { item: Song; index: number }) => (
    <View style={styles.cardWrap}>
      <View style={styles.card}>
        <View style={styles.leftCol}>
          <Text style={styles.index}>#{index + 1}</Text>
        </View>

        <View style={styles.centerCol}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons name="time" size={12} color={Colors.chipText} />
              <Text style={styles.chipText}>{item.duration || '00:00'}</Text>
            </View>
            {!!item.genre && (
              <View style={styles.chip}>
                <Ionicons name="musical-notes" size={12} color={Colors.chipText} />
                <Text style={styles.chipText}>{item.genre}</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }} style={styles.playBtn}>
          <Ionicons name="play" size={18} color={Colors.text} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header gradient */}
      <LinearGradient
        colors={['#4B3C3C', '#2F2727']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="musical-notes" size={24} color={Colors.accentAlt} />
          <Text style={styles.headerTitle}>Lista de Músicas</Text>
        </View>

        <Link href="/new" asChild>
          <TouchableOpacity accessibilityLabel="Adicionar música" style={styles.addBtn}>
            <Ionicons name="add" size={24} color={Colors.text} />
          </TouchableOpacity>
        </Link>
      </LinearGradient>

      <FlatList
        data={songs}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: Spacing.lg, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma música cadastrada ainda.</Text>}
      />

      {/* FAB flutuante */}
      <Link href="/new" asChild>
        <Pressable style={styles.fab} android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: true }}>
          <Ionicons name="add" size={28} color="#0E1220" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadow.card,
  },
  headerTitle: { color: Colors.text, fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  addBtn: {
    width: 40, height: 40, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.stroke,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)',
  },

  cardWrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.stroke,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  leftCol: { width: 36, alignItems: 'center' },
  index: { color: Colors.textMuted, fontWeight: '700' },

  centerCol: { flex: 1, paddingHorizontal: Spacing.sm },
  title: { color: Colors.text, fontWeight: '800', fontSize: 16 },
  artist: { color: Colors.textMuted, marginTop: 2 },

  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.chip,
    borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.stroke,
  },
  chipText: { color: Colors.chipText, fontSize: 12, fontWeight: '600' },

  playBtn: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: Spacing.md,
  },

  empty: { color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: Radius.full,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
});
