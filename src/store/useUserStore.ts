import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAsyncStorageAdapter } from './storage';
import { nowIso } from '../lib/dates';

interface UserState {
  displayName: string;
  email?: string;
  isSignedIn: boolean;
  biometricLockEnabled: boolean;
  aiProcessingConsent: boolean | null;
  onboardingComplete: boolean;
  createdAt: string;
  setDisplayName: (name: string) => void;
  setEmail: (email: string) => void;
  setSignedIn: (signedIn: boolean) => void;
  setBiometricLockEnabled: (enabled: boolean) => void;
  setAiProcessingConsent: (consent: boolean) => void;
  completeOnboarding: () => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      displayName: 'Friend',
      email: undefined,
      isSignedIn: false,
      biometricLockEnabled: false,
      aiProcessingConsent: null,
      onboardingComplete: false,
      createdAt: nowIso(),
      setDisplayName: (name) => set({ displayName: name }),
      setEmail: (email) => set({ email }),
      setSignedIn: (signedIn) => set({ isSignedIn: signedIn }),
      setBiometricLockEnabled: (enabled) => set({ biometricLockEnabled: enabled }),
      setAiProcessingConsent: (consent) => set({ aiProcessingConsent: consent }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      signOut: () => set({ isSignedIn: false, email: undefined }),
    }),
    {
      name: 'prophetic-journal/user',
      storage: createAsyncStorageAdapter<UserState>(),
    },
  ),
);
