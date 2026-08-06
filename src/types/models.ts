/**
 * Core data model for Prophetic Journal.
 * Kept relational and permission-based: AI never asserts divine speech.
 */

export type ActivationCategory =
  | 'intimacy'
  | 'quieting-listening'
  | 'hearing-scripture'
  | 'inner-impressions'
  | 'prophetic-pictures'
  | 'identity'
  | 'encouragement'
  | 'words-of-knowledge'
  | 'intercession'
  | 'prophetic-evangelism'
  | 'dreams'
  | 'symbolic-language'
  | 'discernment'
  | 'testing-confirmation'
  | 'sharing-words'
  | 'humility-maturity';

export type ActivationLevel = 'beginner' | 'developing' | 'advanced';

export type CompletionStatus = 'not-started' | 'in-progress' | 'completed';

export interface ActivationStep {
  id: string;
  instruction: string;
  durationSeconds?: number;
}

export interface Activation {
  id: string;
  title: string;
  slug: string;
  category: ActivationCategory;
  level: ActivationLevel;
  estimatedMinutes: number;
  summary: string;
  purpose: string;
  teaching: string;
  scriptures: ScriptureRef[];
  preparationSteps: string[];
  activationSteps: ActivationStep[];
  journalPrompts: string[];
  discernmentQuestions: string[];
  safetyNotes: string[];
  reflectionQuestions: string[];
  completionStatus: CompletionStatus;
  completedAt?: string;
  favourite: boolean;
  relatedActivationIds: string[];
}

export interface ScriptureRef {
  reference: string;
  text?: string;
}

export type JournalEntryType =
  | 'listening-prayer'
  | 'prophetic-word'
  | 'scripture'
  | 'picture-vision'
  | 'word-of-knowledge'
  | 'intercession'
  | 'prayer-confirmation'
  | 'testimony'
  | 'fulfilled-word'
  | 'general';

export type FulfillmentStatus = 'fulfilled' | 'partially-fulfilled' | 'unconfirmed' | 'released';

export interface DiscernmentChecklistAnswers {
  agreesWithScripture?: boolean | null;
  reflectsCharacterOfJesus?: boolean | null;
  producesFruit?: boolean | null;
  isStrengtheningEncouragingComforting?: boolean | null;
  possibleBiasConsidered?: boolean | null;
  hasReceivedConfirmation?: boolean | null;
  timingDecision?: 'now' | 'later' | 'not-at-all' | null;
  consentAndSafetyConsidered?: boolean | null;
  willingToBeWrong?: boolean | null;
  heldWithHumility?: boolean | null;
}

export interface JournalEntry {
  id: string;
  title: string;
  createdAt: string;
  entryDate: string;
  entryType: JournalEntryType;
  questionAsked?: string;
  whatISensed?: string;
  howItCame?: string;
  scripture?: string;
  possibleInterpretation?: string;
  emotionalState?: string;
  personalAssumptionsOrBias?: string;
  confirmation?: string;
  actionOrResponse?: string;
  outcome?: string;
  people: string[];
  places: string[];
  themes: string[];
  tags: string[];
  photoUris: string[];
  voiceRecordingUri?: string;
  followUpDate?: string;
  status: FulfillmentStatus;
  discernment: DiscernmentChecklistAnswers;
  isHighCaution: boolean;
  highCautionTopics: string[];
  updatedAt: string;
}

export interface DreamEntry {
  id: string;
  title: string;
  createdAt: string;
  dreamDate: string;
  fullDream: string;
  people: string[];
  places: string[];
  objects: string[];
  colours: string[];
  numbers: string[];
  actions: string[];
  emotions: string[];
  atmosphere?: string;
  repeatedDetails?: string;
  personalAssociations?: string;
  currentLifeCircumstances?: string;
  possibleSymbols: string[];
  scriptures: string[];
  prayerReflections?: string;
  possibleMeaning?: string;
  confirmation?: string;
  outcome?: string;
  status: FulfillmentStatus;
  discernment: DiscernmentChecklistAnswers;
  updatedAt: string;
}

export type DiscernmentNodeType =
  | 'journal-entry'
  | 'dream'
  | 'scripture'
  | 'symbol'
  | 'person'
  | 'prophetic-word'
  | 'prayer-confirmation'
  | 'season'
  | 'theme'
  | 'biblical-principle'
  | 'fulfilled-outcome';

export interface DiscernmentNode {
  id: string;
  type: DiscernmentNodeType;
  label: string;
  refId?: string;
  createdAt: string;
}

export interface DiscernmentConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  note?: string;
  createdBy: 'user' | 'ai-suggested';
  approved: boolean;
  createdAt: string;
}

export interface HighCautionAcknowledgement {
  topics: string[];
  acknowledgedAt: string;
}

export const HIGH_CAUTION_TOPICS = [
  'Marriage or romantic relationships',
  'Pregnancy',
  'Death',
  'Serious illness',
  'Medication or medical treatment',
  'Legal decisions',
  'Financial investments',
  'Moving',
  'Leaving a church',
  'Ending relationships',
  'Dates and guaranteed predictions',
  'Accusations of sin, abuse, or criminal behaviour',
] as const;

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  createdAt: string;
  biometricLockEnabled: boolean;
  aiProcessingConsent: boolean;
  themePreference: 'light' | 'dark' | 'system';
}

export interface StreakRecord {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}
