import { HIGH_CAUTION_TOPICS } from '../types/models';

const TOPIC_KEYWORDS: Record<(typeof HIGH_CAUTION_TOPICS)[number], string[]> = {
  'Marriage or romantic relationships': ['marry', 'marriage', 'spouse', 'husband', 'wife', 'dating', 'engaged', 'engagement', 'romantic'],
  Pregnancy: ['pregnant', 'pregnancy', 'baby', 'conceive', 'miscarriage'],
  Death: ['die', 'death', 'dying', 'passed away', 'funeral'],
  'Serious illness': ['cancer', 'illness', 'disease', 'diagnosis', 'terminal', 'sick'],
  'Medication or medical treatment': ['medication', 'surgery', 'treatment', 'stop taking', 'prescription', 'doctor'],
  'Legal decisions': ['lawsuit', 'legal', 'court', 'divorce', 'custody', 'attorney'],
  'Financial investments': ['invest', 'investment', 'stock', 'crypto', 'loan', 'business venture'],
  Moving: ['move to', 'moving', 'relocate', 'relocation'],
  'Leaving a church': ['leave the church', 'leaving church', 'leave our church'],
  'Ending relationships': ['break up', 'end the relationship', 'divorce', 'cut off'],
  'Dates and guaranteed predictions': ['will happen on', 'exact date', 'guaranteed', 'definitely will', 'this year for certain'],
  'Accusations of sin, abuse, or criminal behaviour': ['abuse', 'abusing', 'affair', 'cheating', 'crime', 'criminal', 'molest'],
};

export function detectHighCautionTopics(text: string): string[] {
  const lower = text.toLowerCase();
  return HIGH_CAUTION_TOPICS.filter((topic) => TOPIC_KEYWORDS[topic].some((kw) => lower.includes(kw)));
}
