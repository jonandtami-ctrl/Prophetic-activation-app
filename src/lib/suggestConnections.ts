import { DiscernmentConnection, DiscernmentNode } from '../types/models';

/**
 * Lightweight, on-device heuristic for suggesting possible connections
 * between existing map nodes (shared words in their labels, e.g. a theme
 * "water" and a scripture referencing living water). These are only ever
 * suggestions: they land in `suggestedConnections` and require explicit
 * user approval before becoming real connections (see useDiscernmentStore).
 */
const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'of', 'to', 'in', 'on', 'for', 'with']);

function words(label: string): Set<string> {
  return new Set(
    label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w)),
  );
}

export function findSuggestedPairs(
  nodes: DiscernmentNode[],
  existing: DiscernmentConnection[],
  maxSuggestions = 5,
): { sourceNodeId: string; targetNodeId: string; note: string }[] {
  const existingPairs = new Set(existing.map((c) => [c.sourceNodeId, c.targetNodeId].sort().join('::')));
  const suggestions: { sourceNodeId: string; targetNodeId: string; note: string; score: number }[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.type === b.type) continue;
      const key = [a.id, b.id].sort().join('::');
      if (existingPairs.has(key)) continue;

      const wa = words(a.label);
      const wb = words(b.label);
      const shared = [...wa].filter((w) => wb.has(w));
      if (shared.length > 0) {
        suggestions.push({
          sourceNodeId: a.id,
          targetNodeId: b.id,
          note: `Both mention "${shared[0]}"`,
          score: shared.length,
        });
      }
    }
  }

  return suggestions
    .sort((x, y) => y.score - x.score)
    .slice(0, maxSuggestions)
    .map(({ sourceNodeId, targetNodeId, note }) => ({ sourceNodeId, targetNodeId, note }));
}
