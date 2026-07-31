import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompletionStatus } from '../types/models';
import { nowIso } from '../lib/dates';
import { createAsyncStorageAdapter } from './storage';

export interface ActivationProgress {
  activationId: string;
  completionStatus: CompletionStatus;
  completedAt?: string;
  favourite: boolean;
  journalResponses: Record<string, string>;
  discernmentChecklist: Record<string, boolean>;
  lastOpenedAt?: string;
}

interface ActivationState {
  progressByActivationId: Record<string, ActivationProgress>;
  currentActivationId?: string;
  getProgress: (activationId: string) => ActivationProgress;
  setCurrentActivation: (activationId: string) => void;
  markInProgress: (activationId: string) => void;
  markComplete: (activationId: string) => void;
  toggleFavourite: (activationId: string) => void;
  saveJournalResponse: (activationId: string, promptKey: string, value: string) => void;
  setDiscernmentAnswer: (activationId: string, questionKey: string, value: boolean) => void;
}

function blankProgress(activationId: string): ActivationProgress {
  return {
    activationId,
    completionStatus: 'not-started',
    favourite: false,
    journalResponses: {},
    discernmentChecklist: {},
  };
}

export const useActivationStore = create<ActivationState>()(
  persist(
    (set, get) => ({
      progressByActivationId: {},
      currentActivationId: undefined,
      getProgress: (activationId) => get().progressByActivationId[activationId] ?? blankProgress(activationId),
      setCurrentActivation: (activationId) => {
        set({ currentActivationId: activationId });
        const existing = get().progressByActivationId[activationId] ?? blankProgress(activationId);
        set({
          progressByActivationId: {
            ...get().progressByActivationId,
            [activationId]: { ...existing, lastOpenedAt: nowIso() },
          },
        });
      },
      markInProgress: (activationId) => {
        const existing = get().progressByActivationId[activationId] ?? blankProgress(activationId);
        if (existing.completionStatus === 'completed') return;
        set({
          progressByActivationId: {
            ...get().progressByActivationId,
            [activationId]: { ...existing, completionStatus: 'in-progress' },
          },
        });
      },
      markComplete: (activationId) => {
        const existing = get().progressByActivationId[activationId] ?? blankProgress(activationId);
        set({
          progressByActivationId: {
            ...get().progressByActivationId,
            [activationId]: { ...existing, completionStatus: 'completed', completedAt: nowIso() },
          },
        });
      },
      toggleFavourite: (activationId) => {
        const existing = get().progressByActivationId[activationId] ?? blankProgress(activationId);
        set({
          progressByActivationId: {
            ...get().progressByActivationId,
            [activationId]: { ...existing, favourite: !existing.favourite },
          },
        });
      },
      saveJournalResponse: (activationId, promptKey, value) => {
        const existing = get().progressByActivationId[activationId] ?? blankProgress(activationId);
        set({
          progressByActivationId: {
            ...get().progressByActivationId,
            [activationId]: {
              ...existing,
              journalResponses: { ...existing.journalResponses, [promptKey]: value },
            },
          },
        });
      },
      setDiscernmentAnswer: (activationId, questionKey, value) => {
        const existing = get().progressByActivationId[activationId] ?? blankProgress(activationId);
        set({
          progressByActivationId: {
            ...get().progressByActivationId,
            [activationId]: {
              ...existing,
              discernmentChecklist: { ...existing.discernmentChecklist, [questionKey]: value },
            },
          },
        });
      },
    }),
    {
      name: 'prophetic-journal/activation-progress',
      storage: createAsyncStorageAdapter<ActivationState>(),
      partialize: (state) =>
        ({ progressByActivationId: state.progressByActivationId, currentActivationId: state.currentActivationId } as ActivationState),
    },
  ),
);
