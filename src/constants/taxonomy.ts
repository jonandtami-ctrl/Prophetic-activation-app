import { ActivationCategory, ActivationLevel, FulfillmentStatus, JournalEntryType } from '../types/models';

export const CATEGORY_LABELS: Record<ActivationCategory, string> = {
  intimacy: 'Intimacy with God',
  'quieting-listening': 'Quieting & Listening',
  'hearing-scripture': 'Hearing Through Scripture',
  'inner-impressions': 'Recognizing Inner Impressions',
  'prophetic-pictures': 'Prophetic Pictures',
  identity: 'Identity',
  encouragement: 'Encouragement',
  'words-of-knowledge': 'Words of Knowledge',
  intercession: 'Intercession',
  'prophetic-evangelism': 'Prophetic Evangelism',
  dreams: 'Dreams',
  'symbolic-language': 'Symbolic Language',
  discernment: 'Discernment',
  'testing-confirmation': 'Testing & Confirmation',
  'sharing-words': 'Sharing Prophetic Words',
  'humility-maturity': 'Growing in Humility & Maturity',
};

export const CATEGORY_ORDER: ActivationCategory[] = [
  'intimacy',
  'quieting-listening',
  'hearing-scripture',
  'inner-impressions',
  'prophetic-pictures',
  'identity',
  'encouragement',
  'words-of-knowledge',
  'intercession',
  'prophetic-evangelism',
  'dreams',
  'symbolic-language',
  'discernment',
  'testing-confirmation',
  'sharing-words',
  'humility-maturity',
];

export const LEVEL_LABELS: Record<ActivationLevel, string> = {
  beginner: 'Beginner',
  developing: 'Developing',
  advanced: 'Advanced',
};

export const LEVEL_ORDER: ActivationLevel[] = ['beginner', 'developing', 'advanced'];

export const ENTRY_TYPE_LABELS: Record<JournalEntryType, string> = {
  'listening-prayer': 'Listening Prayer',
  'prophetic-word': 'Prophetic Word',
  scripture: 'Scripture',
  'picture-vision': 'Picture or Vision',
  'word-of-knowledge': 'Word of Knowledge',
  intercession: 'Intercession',
  dream: 'Dream',
  'prayer-confirmation': 'Prayer Confirmation',
  testimony: 'Testimony',
  'fulfilled-word': 'Fulfilled Word',
  general: 'General Journal',
};

export const ENTRY_TYPE_ORDER: JournalEntryType[] = [
  'listening-prayer',
  'prophetic-word',
  'scripture',
  'picture-vision',
  'word-of-knowledge',
  'intercession',
  'dream',
  'prayer-confirmation',
  'testimony',
  'fulfilled-word',
  'general',
];

export const STATUS_LABELS: Record<FulfillmentStatus, string> = {
  fulfilled: 'Fulfilled',
  'partially-fulfilled': 'Partially Fulfilled',
  unconfirmed: 'Unconfirmed',
  released: 'Released',
};

export const DISCERNMENT_CHECKLIST_ITEMS: { key: string; question: string }[] = [
  { key: 'agreesWithScripture', question: 'Does this agree with Scripture?' },
  { key: 'reflectsCharacterOfJesus', question: 'Does it reflect the character of Jesus?' },
  {
    key: 'producesFruit',
    question:
      'Does it produce love, humility, peace, repentance, hope, encouragement, or healthy conviction?',
  },
  { key: 'isStrengtheningEncouragingComforting', question: 'Is it strengthening, encouraging, or comforting?' },
  {
    key: 'possibleBiasConsidered',
    question: 'Could fear, desire, offence, trauma, assumption, or personal bias be influencing me?',
  },
  { key: 'hasReceivedConfirmation', question: 'Have I received confirmation?' },
  { key: 'timingDecision', question: 'Should this be shared now, later, or not at all?' },
  { key: 'consentAndSafetyConsidered', question: "Have I considered the person's consent and emotional safety?" },
  { key: 'willingToBeWrong', question: 'Am I willing to be wrong?' },
  { key: 'heldWithHumility', question: 'Can I hold this impression with humility?' },
];

export const HUMBLE_LANGUAGE_EXAMPLES = [
  'I felt God may be highlighting…',
  'I had an impression that…',
  'This may or may not mean something, but…',
  'Please pray about this and only receive what resonates with Scripture and the Holy Spirit.',
];

export const CONTROLLING_LANGUAGE_EXAMPLES = [
  'God told me you must…',
  'God said you are supposed to marry…',
  'If you do not obey this word…',
];
