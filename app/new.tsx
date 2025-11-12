import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../apiConfig';
import { Colors, Radius, Shadow, Spacing } from '../src/theme';

const DURATION_REGEX = /^(\d{1,2}):(\d{2})$/; // mm:ss

export default function NewSong() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !artist.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe pelo menos o nome e o compositor.');
      return;
    }
    if (duration && !DURATION_REGEX.test(duration.trim())) {
      Alert.alert('Duração inválida', 'Use o formato mm:ss (ex.: 03:45).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        duration: duration.trim(),
        artist: artist.trim(),
        genre: genre.trim(),
        createdAt: new Date().toISOString(),
      };

      console.log('[POST] /songs', payload);
      const res = await api.post('/songs', payload);
      console.log('status:', res.status, 'data:', res.data);

      Alert.alert('Sucesso', 'Música cadastrada!');
      router.replace('/');
    } catch (error: any) {
      console.log('ERRO POST /songs:', error?.message, error?.response?.status, error?.response?.data);
      Alert.alert('Erro', error?.message || 'Falha ao cadastrar a música');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4B3C3C', '#2F2727']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Cadastre uma nova música</Text>
      </LinearGradient>

      <View style={styles.formCard}>
        <Field label="Nome da música" value={title} onChangeText={setTitle} placeholder="Ex.: Lost Stars" />
        <Field label="Duração (mm:ss)" value={duration} onChangeText={setDuration} placeholder="03:45" keyboardType="numbers-and-punctuation" />
        <Field label="Compositor" value={artist} onChangeText={setArtist} placeholder="Ex.: Adam Levine" />
        <Field label="Estilo" value={genre} onChangeText={setGenre} placeholder="Ex.: Pop" />

        <TouchableOpacity style={[styles.primaryBtn, submitting && { opacity: 0.7 }]} onPress={handleSave} disabled={submitting}>
          <Text style={styles.primaryBtnText}>{submitting ? 'SALVANDO...' : 'SALVAR'}</Text>
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
