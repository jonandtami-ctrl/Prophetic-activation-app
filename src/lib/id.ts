import * as Crypto from 'expo-crypto';

export function createId(): string {
  try {
    return Crypto.randomUUID();
  } catch {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
