import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DreamEntry } from '../types/models';
import { createId } from '../lib/id';
import { nowIso } from '../lib/dates';
import { createAsyncStorageAdapter } from './storage';
import { cloudSync } from '../lib/sync';

interface DreamState {
  dreams: DreamEntry[];
  addDream: (overrides?: Partial<DreamEntry>) => DreamEntry;
  updateDream: (id: string, patch: Partial<DreamEntry>) => void;
  removeDream: (id: string) => void;
  hydrateFromCloud: (dreams: DreamEntry[]) => void;
}

function defaultDream(overrides?: Partial<DreamEntry>): DreamEntry {
  const now = nowIso();
  return {
    id: createId(),
    title: '',
    createdAt: now,
    dreamDate: now,
    fullDream: '',
    people: [],
    places: [],
    objects: [],
    colours: [],
    numbers: [],
    actions: [],
    emotions: [],
    possibleSymbols: [],
    scriptures: [],
    status: 'unconfirmed',
    discernment: {},
    updatedAt: now,
    ...overrides,
  };
}

export const useDreamStore = create<DreamState>()(
  persist(
    (set, get) => ({
      dreams: [],
      addDream: (overrides) => {
        const dream = defaultDream(overrides);
        set({ dreams: [dream, ...get().dreams] });
        cloudSync.upsertDreamEntry(dream);
        return dream;
      },
      updateDream: (id, patch) => {
        let updated: DreamEntry | undefined;
        set({
          dreams: get().dreams.map((d) => {
            if (d.id !== id) return d;
            updated = { ...d, ...patch, updatedAt: nowIso() };
            return updated;
          }),
        });
        if (updated) cloudSync.upsertDreamEntry(updated);
      },
      removeDream: (id) => {
        set({ dreams: get().dreams.filter((d) => d.id !== id) });
        cloudSync.deleteDreamEntry(id);
      },
      hydrateFromCloud: (dreams) => {
        const byId = new Map(get().dreams.map((d) => [d.id, d]));
        dreams.forEach((d) => {
          const existing = byId.get(d.id);
          if (!existing || new Date(d.updatedAt) > new Date(existing.updatedAt)) {
            byId.set(d.id, d);
          }
        });
        set({ dreams: Array.from(byId.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) });
      },
    }),
    {
      name: 'prophetic-journal/dream-entries',
      storage: createAsyncStorageAdapter<DreamState>(),
      partialize: (state) => ({ dreams: state.dreams }) as DreamState,
    },
  ),
);
