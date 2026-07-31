import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiscernmentConnection, DiscernmentNode, DiscernmentNodeType } from '../types/models';
import { createId } from '../lib/id';
import { nowIso } from '../lib/dates';
import { createAsyncStorageAdapter } from './storage';
import { cloudSync } from '../lib/sync';

interface DiscernmentState {
  nodes: DiscernmentNode[];
  connections: DiscernmentConnection[];
  suggestedConnections: DiscernmentConnection[];
  upsertNode: (type: DiscernmentNodeType, label: string, refId?: string) => DiscernmentNode;
  removeNode: (id: string) => void;
  connect: (sourceNodeId: string, targetNodeId: string, note?: string) => void;
  removeConnection: (id: string) => void;
  suggestConnection: (sourceNodeId: string, targetNodeId: string, note?: string) => void;
  approveSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  clearAll: () => void;
}

export const useDiscernmentStore = create<DiscernmentState>()(
  persist(
    (set, get) => ({
      nodes: [],
      connections: [],
      suggestedConnections: [],
      upsertNode: (type, label, refId) => {
        const existing = get().nodes.find((n) => n.type === type && n.label.toLowerCase() === label.toLowerCase());
        if (existing) return existing;
        const node: DiscernmentNode = { id: createId(), type, label, refId, createdAt: nowIso() };
        set({ nodes: [...get().nodes, node] });
        cloudSync.upsertDiscernmentNode(node);
        return node;
      },
      removeNode: (id) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          connections: get().connections.filter((c) => c.sourceNodeId !== id && c.targetNodeId !== id),
        });
        cloudSync.deleteDiscernmentNode(id);
      },
      connect: (sourceNodeId, targetNodeId, note) => {
        if (sourceNodeId === targetNodeId) return;
        const already = get().connections.find(
          (c) =>
            (c.sourceNodeId === sourceNodeId && c.targetNodeId === targetNodeId) ||
            (c.sourceNodeId === targetNodeId && c.targetNodeId === sourceNodeId),
        );
        if (already) return;
        const conn: DiscernmentConnection = {
          id: createId(),
          sourceNodeId,
          targetNodeId,
          note,
          createdBy: 'user',
          approved: true,
          createdAt: nowIso(),
        };
        set({ connections: [...get().connections, conn] });
        cloudSync.upsertDiscernmentConnection(conn);
      },
      removeConnection: (id) => {
        set({ connections: get().connections.filter((c) => c.id !== id) });
        cloudSync.deleteDiscernmentConnection(id);
      },
      suggestConnection: (sourceNodeId, targetNodeId, note) => {
        const already = [...get().connections, ...get().suggestedConnections].find(
          (c) =>
            (c.sourceNodeId === sourceNodeId && c.targetNodeId === targetNodeId) ||
            (c.sourceNodeId === targetNodeId && c.targetNodeId === sourceNodeId),
        );
        if (already) return;
        const suggestion: DiscernmentConnection = {
          id: createId(),
          sourceNodeId,
          targetNodeId,
          note,
          createdBy: 'ai-suggested',
          approved: false,
          createdAt: nowIso(),
        };
        set({ suggestedConnections: [...get().suggestedConnections, suggestion] });
      },
      approveSuggestion: (id) => {
        const suggestion = get().suggestedConnections.find((s) => s.id === id);
        if (!suggestion) return;
        const approved: DiscernmentConnection = { ...suggestion, approved: true };
        set({
          connections: [...get().connections, approved],
          suggestedConnections: get().suggestedConnections.filter((s) => s.id !== id),
        });
        cloudSync.upsertDiscernmentConnection(approved);
      },
      dismissSuggestion: (id) => {
        set({ suggestedConnections: get().suggestedConnections.filter((s) => s.id !== id) });
      },
      clearAll: () => set({ nodes: [], connections: [], suggestedConnections: [] }),
    }),
    {
      name: 'prophetic-journal/discernment-map',
      storage: createAsyncStorageAdapter<DiscernmentState>(),
      partialize: (state) =>
        ({ nodes: state.nodes, connections: state.connections, suggestedConnections: state.suggestedConnections } as DiscernmentState),
    },
  ),
);
