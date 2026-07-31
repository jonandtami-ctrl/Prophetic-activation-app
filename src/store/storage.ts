import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistStorage, StorageValue } from 'zustand/middleware';

export function createAsyncStorageAdapter<T>(): PersistStorage<T> {
  return {
    getItem: async (name) => {
      const value = await AsyncStorage.getItem(name);
      if (!value) return null;
      return JSON.parse(value) as StorageValue<T>;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  };
}
