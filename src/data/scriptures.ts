import { ScriptureRef } from '../types/models';
import { dayKey } from '../lib/dates';

export interface DailyScripture extends ScriptureRef {
  text: string;
  reflection: string;
}

export const DAILY_SCRIPTURES: DailyScripture[] = [
  {
    reference: 'John 10:27',
    text: 'My sheep hear my voice, and I know them, and they follow me.',
    reflection: 'Hearing God is not a rare gift for a few — it is the normal life of a sheep who knows the Shepherd.',
  },
  {
    reference: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
    reflection: 'Stillness is not empty space to fill — it is where knowing happens.',
  },
  {
    reference: '1 Thessalonians 5:19-21',
    text: 'Do not quench the Spirit. Do not despise prophecies, but test everything; hold fast what is good.',
    reflection: 'Openness and discernment were always meant to travel together.',
  },
  {
    reference: 'Jeremiah 33:3',
    text: 'Call to me and I will answer you, and will tell you great and hidden things that you have not known.',
    reflection: "God's willingness to speak is an invitation, not a transaction to earn.",
  },
  {
    reference: 'Habakkuk 2:1',
    text: 'I will take my stand at my watchpost… and look out to see what he will say to me.',
    reflection: 'Habakkuk positioned himself to listen before he had an answer. Posture matters more than performance.',
  },
  {
    reference: 'John 5:19',
    text: 'The Son can do nothing of his own accord, but only what he sees the Father doing.',
    reflection: "Even Jesus modeled a listening life. If He depended on the Father's voice, so can we.",
  },
  {
    reference: 'Romans 8:16',
    text: 'The Spirit himself bears witness with our spirit that we are children of God.',
    reflection: 'Before any word or picture, there is this: you belong to Him.',
  },
  {
    reference: '1 Corinthians 14:3',
    text: 'The one who prophesies speaks to people for their upbuilding and encouragement and consolation.',
    reflection: "Genuine prophetic words build up. If it tears down, it's worth testing carefully.",
  },
  {
    reference: 'Isaiah 30:21',
    text: 'Your ears shall hear a word behind you, saying, "This is the way, walk in it."',
    reflection: 'Guidance is often quiet and behind you — easy to miss if you are rushing ahead.',
  },
  {
    reference: 'John 15:15',
    text: 'I have called you friends, for all that I have heard from my Father I have made known to you.',
    reflection: 'Hearing God flows from friendship, not from a formula.',
  },
  {
    reference: 'Psalm 25:14',
    text: 'The friendship of the LORD is for those who fear him, and he makes known to them his covenant.',
    reflection: 'Reverent closeness, not performance, opens the door to hearing.',
  },
  {
    reference: '2 Corinthians 13:1',
    text: 'Every charge must be established by the evidence of two or three witnesses.',
    reflection: 'Confirmation is not distrust of God — it is wisdom about ourselves.',
  },
  {
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the LORD with all your heart, and do not lean on your own understanding.',
    reflection: 'Trust holds an impression with open hands rather than gripping it as certainty.',
  },
  {
    reference: 'Matthew 11:29',
    text: 'Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.',
    reflection: 'Whatever you sense today, let it come from rest, not striving.',
  },
  {
    reference: 'Joel 2:28',
    text: 'I will pour out my Spirit on all flesh; your sons and your daughters shall prophesy… your young men shall see visions.',
    reflection: "This isn't reserved for the specially gifted few. It's a promise for God's people.",
  },
];

export function scriptureForToday(): DailyScripture {
  const key = dayKey();
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return DAILY_SCRIPTURES[hash % DAILY_SCRIPTURES.length];
}

export const LISTENING_PROMPTS = [
  'Sit quietly for two minutes. Ask Jesus one question: "What do You want me to know about Your heart for me today?" Write whatever comes — a word, a picture, a feeling, or simply peace.',
  'Read Psalm 23 slowly. Which verse feels most alive to you right now? Sit with it.',
  "Ask God: \"Is there anything you'd like to highlight to me today?\" Wait. Write down anything you notice, even if it feels small.",
  'Picture yourself sitting with Jesus. What does the scene look like? What, if anything, does He say?',
  'Bring one person to mind. Ask God how He sees them. Write down any impressions, and hold them loosely.',
  'Ask the Holy Spirit to bring a memory, image, or Scripture to mind. Notice it without analyzing yet — just record it.',
  'Thank God for three things. Then simply rest in His presence for a minute before writing anything down.',
];

export function listeningPromptForToday(): string {
  const key = dayKey();
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 17 + key.charCodeAt(i)) >>> 0;
  return LISTENING_PROMPTS[hash % LISTENING_PROMPTS.length];
}
