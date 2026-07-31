/**
 * "AI assistance" in Prophetic Journal is intentionally narrow: it organizes
 * what the user already wrote, notices recurring words/themes across their
 * own entries, and asks reflective questions grounded in Scripture. It NEVER
 * declares what an impression or dream means, and never says "God is
 * telling you." Every function here returns *questions* or *observations*,
 * never verdicts.
 *
 * This runs fully on-device with lightweight keyword heuristics so it works
 * offline and without sending journal content to a third party. If a real
 * language model is wired in later, it should be constrained to the same
 * output shape (questions/observations) and the same disclaimers.
 */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'was', 'were',
  'is', 'are', 'i', 'me', 'my', 'it', 'that', 'this', 'as', 'be', 'had', 'have', 'has', 'we', 'they',
  'he', 'she', 'his', 'her', 'them', 'their', 'so', 'then', 'there', 'not', 'no', 'up', 'out', 'about',
]);

export function extractKeywords(text: string, limit = 8): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const counts = new Map<string, number>();
  words.forEach((w) => counts.set(w, (counts.get(w) ?? 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

export function findRecurringThemes(texts: string[], minOccurrences = 2, limit = 6): { theme: string; count: number }[] {
  const counts = new Map<string, number>();
  texts.forEach((text) => {
    const uniqueInText = new Set(extractKeywords(text, 20));
    uniqueInText.forEach((w) => counts.set(w, (counts.get(w) ?? 0) + 1));
  });

  return Array.from(counts.entries())
    .filter(([, count]) => count >= minOccurrences)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([theme, count]) => ({ theme, count }));
}

export const GENERAL_REFLECTION_QUESTIONS = [
  'What was your posture before God when you sensed this — resting, or striving?',
  'Does this align with the character of Jesus as revealed in Scripture?',
  'Is there a related passage of Scripture that comes to mind?',
  'What emotion is present as you write this down?',
  'Could fear, desire, offence, or personal bias be shaping this impression?',
  'Who might you ask to pray this through with you?',
  'Is this something to hold quietly for now, or gently share?',
];

export const DREAM_REFLECTION_QUESTIONS = [
  'What did this symbol mean to you personally, apart from any dictionary meaning?',
  'Was this person behaving as they normally would, or differently?',
  'What emotion remained after you woke up?',
  'Is this theme appearing elsewhere in your life right now?',
  'Does the possible interpretation align with Scripture and the character of Jesus?',
  'Could this dream be ordinary processing — of stress, memory, or the day — rather than spiritual communication?',
  'Is there a repeated detail here that also shows up in other dreams?',
];

export interface ScriptureSuggestion {
  reference: string;
  reason: string;
}

const KEYWORD_SCRIPTURE_MAP: { keywords: string[]; reference: string; reason: string }[] = [
  { keywords: ['fear', 'afraid', 'anxious', 'anxiety', 'worry'], reference: '2 Timothy 1:7', reason: 'On God not giving a spirit of fear' },
  { keywords: ['identity', 'chosen', 'beloved', 'worth'], reference: 'Ephesians 1:4-5', reason: 'On being chosen and adopted in love' },
  { keywords: ['water', 'ocean', 'river', 'sea', 'flood'], reference: 'John 7:38', reason: 'Rivers of living water' },
  { keywords: ['light', 'lamp', 'shine'], reference: 'Matthew 5:14-16', reason: 'You are the light of the world' },
  { keywords: ['house', 'home', 'building', 'foundation'], reference: 'Matthew 7:24-25', reason: 'Building on the rock' },
  { keywords: ['storm', 'wind', 'wave'], reference: 'Mark 4:39', reason: 'Jesus calming the storm' },
  { keywords: ['door', 'gate', 'key'], reference: 'Revelation 3:20', reason: 'Jesus standing at the door' },
  { keywords: ['garden', 'seed', 'plant', 'grow', 'harvest', 'fruit'], reference: 'Galatians 5:22-23', reason: 'The fruit of the Spirit' },
  { keywords: ['battle', 'war', 'fight', 'armor', 'sword'], reference: 'Ephesians 6:10-18', reason: 'The armor of God' },
  { keywords: ['rest', 'tired', 'weary', 'exhausted', 'sleep'], reference: 'Matthew 11:28-29', reason: 'Come to me, all who are weary' },
  { keywords: ['gold', 'silver', 'treasure', 'wealth', 'money'], reference: 'Matthew 6:19-21', reason: 'On treasure in heaven' },
  { keywords: ['bird', 'eagle', 'dove', 'wings'], reference: 'Isaiah 40:31', reason: 'They will soar on wings like eagles' },
  { keywords: ['path', 'road', 'walk', 'journey', 'way'], reference: 'Proverbs 3:5-6', reason: 'On trusting God with your path' },
  { keywords: ['confirmation', 'confirm', 'sign'], reference: '2 Corinthians 13:1', reason: 'Every matter established by witnesses' },
  { keywords: ['name', 'called', 'calling', 'purpose'], reference: 'Jeremiah 29:11', reason: "On God's plans for His people" },
];

export function suggestScriptures(text: string, limit = 4): ScriptureSuggestion[] {
  const lower = text.toLowerCase();
  const matches = KEYWORD_SCRIPTURE_MAP.filter((entry) => entry.keywords.some((kw) => lower.includes(kw)));
  return matches.slice(0, limit).map(({ reference, reason }) => ({ reference, reason }));
}
