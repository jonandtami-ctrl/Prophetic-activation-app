import { DreamEntry, JournalEntry } from '../types/models';

const SENSING_CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: 'A quiet thought', keywords: ['thought', 'mind', 'idea'] },
  { label: 'A feeling or peace', keywords: ['feeling', 'peace', 'felt', 'sense', 'emotion'] },
  { label: 'A picture or vision', keywords: ['picture', 'vision', 'image', 'saw'] },
  { label: 'Scripture', keywords: ['scripture', 'verse', 'bible', 'word'] },
  { label: 'A dream', keywords: ['dream', 'sleep', 'asleep'] },
  { label: 'A physical sensation', keywords: ['body', 'physical', 'chills', 'warmth'] },
  { label: 'An inner voice or knowing', keywords: ['voice', 'knowing', 'heard', 'impression'] },
];

export function mostCommonSensingMethods(entries: JournalEntry[]): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  entries.forEach((e) => {
    const text = (e.howItCame ?? '').toLowerCase();
    if (!text) return;
    SENSING_CATEGORIES.forEach((cat) => {
      if (cat.keywords.some((kw) => text.includes(kw))) {
        counts.set(cat.label, (counts.get(cat.label) ?? 0) + 1);
      }
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

export interface Milestone {
  id: string;
  label: string;
  achieved: boolean;
  detail: string;
}

export function computeMilestones(params: {
  entryCount: number;
  dreamCount: number;
  completedActivations: number;
  longestJournalStreak: number;
  fulfilledWords: number;
}): Milestone[] {
  const { entryCount, dreamCount, completedActivations, longestJournalStreak, fulfilledWords } = params;
  return [
    { id: 'first-entry', label: 'First journal entry', achieved: entryCount >= 1, detail: 'You showed up and wrote down what you sensed.' },
    { id: 'ten-entries', label: '10 journal entries', achieved: entryCount >= 10, detail: 'A growing record of hearing God.' },
    { id: 'fifty-entries', label: '50 journal entries', achieved: entryCount >= 50, detail: 'A rich, textured history with the Lord.' },
    { id: 'first-dream', label: 'First recorded dream', achieved: dreamCount >= 1, detail: 'You brought a dream into the light of Scripture.' },
    { id: 'first-activation', label: 'First activation completed', achieved: completedActivations >= 1, detail: 'You practiced, not just learned.' },
    { id: 'five-activations', label: '5 activations completed', achieved: completedActivations >= 5, detail: 'A real rhythm of practice is forming.' },
    { id: 'week-streak', label: '7-day streak', achieved: longestJournalStreak >= 7, detail: 'A full week of consistent listening.' },
    { id: 'month-streak', label: '30-day streak', achieved: longestJournalStreak >= 30, detail: 'A sustained season of attentiveness.' },
    { id: 'first-fulfilled', label: 'First fulfilled word', achieved: fulfilledWords >= 1, detail: 'You watched God confirm what He spoke.' },
  ];
}

export function monthlySummary(entries: JournalEntry[], dreams: DreamEntry[]): { entryCount: number; dreamCount: number; monthLabel: string } {
  const now = new Date();
  const monthLabel = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const isThisMonth = (iso: string) => {
    const d = new Date(iso);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  return {
    entryCount: entries.filter((e) => isThisMonth(e.createdAt)).length,
    dreamCount: dreams.filter((d) => isThisMonth(d.createdAt)).length,
    monthLabel,
  };
}
