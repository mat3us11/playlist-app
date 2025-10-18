import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveSong } from '../src/storage/songsStorage';
import { Colors, Radius, Shadow, Spacing } from '../src/theme';

const DURATION_REGEX = /^(\d{1,2}):(\d{2})$/; // mm:ss

export default function NewSong() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !artist.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe pelo menos o nome e o compositor.');
      return;
    }
    if (duration && !DURATION_REGEX.test(duration.trim())) {
      Alert.alert('Duração inválida', 'Use o formato mm:ss (ex.: 03:45).');
      return;
    }
    await saveSong({
      id: Date.now().toString(),
      title: title.trim(),
      duration: duration.trim(),
      artist: artist.trim(),
      genre: genre.trim(),
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#4B3C3C', '#2F2727']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.headerTitle}>Cadastre uma nova música</Text>
      </LinearGradient>

      {/* Card do formulário */}
      <View style={styles.formCard}>
        <Field label="nome da música" value={title} onChangeText={setTitle} />
        <Field label="duração da música (mm:ss)" value={duration} onChangeText={setDuration} keyboardType="numbers-and-punctuation" />
        <Field label="compositor" value={artist} onChangeText={setArtist} />
        <Field label="estilo" value={genre} onChangeText={setGenre} />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>SALVAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & { label: string };

function Field({ label, style, ...rest }: FieldProps) {
  return (
    <View style={{ marginBottom: Spacing.lg }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textMuted}
        {...rest}
      />
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
  headerTitle: { color: Colors.text, textAlign: 'center', fontSize: 18, fontWeight: '800', letterSpacing: 0.4 },

  formCard: {
    marginTop: -12,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.stroke,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  label: { color: Colors.textMuted, marginBottom: 6, fontWeight: '600' },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.stroke,
    color: Colors.text,
    paddingVertical: 8,
  },

  primaryBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  primaryBtnText: { color: '#0E1220', fontWeight: '800', letterSpacing: 1 },
});
