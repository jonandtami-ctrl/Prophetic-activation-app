import { isCloudSyncConfigured, supabase } from './supabase';
import { DiscernmentConnection, DiscernmentNode, DreamEntry, JournalEntry } from '../types/models';

/**
 * Minimal, last-write-wins cloud mirror. Local AsyncStorage (via each
 * zustand store's `persist` middleware) is always the source of truth for
 * rendering; this module best-effort mirrors rows to Supabase so a signed-in
 * user's data is available on another device. Every table is scoped to
 * `user_id` and protected by row-level security (see supabase/schema.sql) so
 * one user can never read another's journal.
 */

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

async function upsert(table: string, row: Record<string, unknown>) {
  if (!isCloudSyncConfigured || !supabase) return;
  const userId = await currentUserId();
  if (!userId) return;
  try {
    await supabase.from(table).upsert({ ...row, user_id: userId }, { onConflict: 'id' });
  } catch {
    // Sync is best-effort; local data already persisted. A future retry
    // queue can pick failed rows back up without blocking the user.
  }
}

async function remove(table: string, id: string) {
  if (!isCloudSyncConfigured || !supabase) return;
  const userId = await currentUserId();
  if (!userId) return;
  try {
    await supabase.from(table).delete().eq('id', id).eq('user_id', userId);
  } catch {
    // best-effort
  }
}

export const cloudSync = {
  upsertJournalEntry: (entry: JournalEntry) => upsert('journal_entries', { id: entry.id, payload: entry, updated_at: entry.updatedAt }),
  deleteJournalEntry: (id: string) => remove('journal_entries', id),

  upsertDreamEntry: (entry: DreamEntry) => upsert('dream_entries', { id: entry.id, payload: entry, updated_at: entry.updatedAt }),
  deleteDreamEntry: (id: string) => remove('dream_entries', id),

  upsertDiscernmentNode: (node: DiscernmentNode) => upsert('discernment_nodes', { id: node.id, payload: node }),
  deleteDiscernmentNode: (id: string) => remove('discernment_nodes', id),

  upsertDiscernmentConnection: (conn: DiscernmentConnection) =>
    upsert('discernment_connections', { id: conn.id, payload: conn }),
  deleteDiscernmentConnection: (id: string) => remove('discernment_connections', id),

  async pullAll<T>(table: string): Promise<T[]> {
    if (!isCloudSyncConfigured || !supabase) return [];
    const userId = await currentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await supabase.from(table).select('payload').eq('user_id', userId);
      if (error || !data) return [];
      return data.map((row: { payload: T }) => row.payload);
    } catch {
      return [];
    }
  },
};
