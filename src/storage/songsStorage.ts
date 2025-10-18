import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Song } from '../types';

const KEY = '@playlist:songs';

export async function loadSongs(): Promise<Song[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Song[]) : [];
}

export async function saveSong(song: Song): Promise<Song[]> {
  const current = await loadSongs();
  const updated = [song, ...current];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function removeSong(id: string): Promise<Song[]> {
  const current = await loadSongs();
  const updated = current.filter((s) => s.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function clearAllSongs(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
