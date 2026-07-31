import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JournalEntry } from '../types/models';
import { createId } from '../lib/id';
import { nowIso } from '../lib/dates';
import { createAsyncStorageAdapter } from './storage';
import { cloudSync } from '../lib/sync';

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Partial<JournalEntry> & Pick<JournalEntry, 'entryType'>) => JournalEntry;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  removeEntry: (id: string) => void;
  hydrateFromCloud: (entries: JournalEntry[]) => void;
  clearAll: () => void;
}

function defaultEntry(overrides: Partial<JournalEntry> & Pick<JournalEntry, 'entryType'>): JournalEntry {
  const now = nowIso();
  return {
    id: createId(),
    title: '',
    createdAt: now,
    entryDate: now,
    people: [],
    places: [],
    themes: [],
    tags: [],
    photoUris: [],
    status: 'unconfirmed',
    discernment: {},
    isHighCaution: false,
    highCautionTopics: [],
    updatedAt: now,
    ...overrides,
  };
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (overrides) => {
        const entry = defaultEntry(overrides);
        set({ entries: [entry, ...get().entries] });
        cloudSync.upsertJournalEntry(entry);
        return entry;
      },
      updateEntry: (id, patch) => {
        let updated: JournalEntry | undefined;
        set({
          entries: get().entries.map((e) => {
            if (e.id !== id) return e;
            updated = { ...e, ...patch, updatedAt: nowIso() };
            return updated;
          }),
        });
        if (updated) cloudSync.upsertJournalEntry(updated);
      },
      removeEntry: (id) => {
        set({ entries: get().entries.filter((e) => e.id !== id) });
        cloudSync.deleteJournalEntry(id);
      },
      hydrateFromCloud: (entries) => {
        const byId = new Map(get().entries.map((e) => [e.id, e]));
        entries.forEach((e) => {
          const existing = byId.get(e.id);
          if (!existing || new Date(e.updatedAt) > new Date(existing.updatedAt)) {
            byId.set(e.id, e);
          }
        });
        set({ entries: Array.from(byId.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) });
      },
      clearAll: () => set({ entries: [] }),
    }),
    {
      name: 'prophetic-journal/journal-entries',
      storage: createAsyncStorageAdapter<JournalState>(),
      partialize: (state) => ({ entries: state.entries }) as JournalState,
    },
  ),
);
