import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Full local export/delete for the user's data. Cloud rows (if cloud sync is
 * configured) are removed via Postgres cascade when the auth user itself is
 * deleted server-side — see supabase/schema.sql `on delete cascade`.
 */

const APP_STORAGE_PREFIX = 'prophetic-journal/';

export async function exportAllDataAsJson(): Promise<string> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(APP_STORAGE_PREFIX));
  const entries = await AsyncStorage.getMany(keys);
  const data: Record<string, unknown> = {};
  Object.entries(entries).forEach(([key, value]) => {
    if (value) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
  });
  return JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2);
}

export async function shareDataExport(): Promise<void> {
  const json = await exportAllDataAsJson();
  const fileUri = `${FileSystem.documentDirectory}prophetic-journal-export-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(fileUri, json, { encoding: 'utf8' });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Export Prophetic Journal data' });
  }
}

export async function deleteAllLocalData(): Promise<void> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(APP_STORAGE_PREFIX));
  await AsyncStorage.removeMany(keys);
}
