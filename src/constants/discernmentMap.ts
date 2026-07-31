import { DiscernmentNodeType } from '../types/models';

export const NODE_TYPE_LABELS: Record<DiscernmentNodeType, string> = {
  'journal-entry': 'Journal Entry',
  dream: 'Dream',
  scripture: 'Scripture',
  symbol: 'Symbol',
  person: 'Person',
  'prophetic-word': 'Prophetic Word',
  'prayer-confirmation': 'Prayer Confirmation',
  season: 'Season',
  theme: 'Theme',
  'biblical-principle': 'Biblical Principle',
  'fulfilled-outcome': 'Fulfilled Outcome',
};

export const NODE_TYPE_COLORS: Record<DiscernmentNodeType, string> = {
  'journal-entry': '#D4AF6A',
  dream: '#8F7FD1',
  scripture: '#E8C87E',
  symbol: '#C6602F',
  person: '#5FA98C',
  'prophetic-word': '#C9BEF0',
  'prayer-confirmation': '#5FA98C',
  season: '#8A84AA',
  theme: '#D98E4A',
  'biblical-principle': '#B5924B',
  'fulfilled-outcome': '#3F8A6D',
};

export const NODE_TYPE_ICONS: Record<DiscernmentNodeType, string> = {
  'journal-entry': 'book-outline',
  dream: 'moon-outline',
  scripture: 'bookmark-outline',
  symbol: 'sparkles-outline',
  person: 'person-outline',
  'prophetic-word': 'chatbubble-ellipses-outline',
  'prayer-confirmation': 'checkmark-done-outline',
  season: 'leaf-outline',
  theme: 'pricetag-outline',
  'biblical-principle': 'shield-checkmark-outline',
  'fulfilled-outcome': 'flag-outline',
};
