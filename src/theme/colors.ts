/**
 * Prophetic Journal design tokens.
 * Visual direction: deep navy & midnight purple, warm gold accents,
 * soft lavender highlights, starlight texture, elegant + calm.
 */

export const palette = {
  midnightNavy: '#0B0F2E',
  midnightNavyDeep: '#070A20',
  duskPurple: '#1D1440',
  duskPurpleLight: '#2A1F5C',
  velvetPlum: '#2B1A4A',

  gold: '#D4AF6A',
  goldBright: '#E8C87E',
  goldMuted: '#B5924B',

  lavender: '#C9BEF0',
  lavenderSoft: '#E4DEF8',
  lavenderDeep: '#8F7FD1',

  parchment: '#FBF8F1',
  ivory: '#FFFDF8',
  cloud: '#F3F1FA',

  ink: '#1B1730',
  slate: '#544E76',
  mist: '#8A84AA',

  success: '#5FA98C',
  warning: '#D98E4A',
  caution: '#C6602F',
  danger: '#B7482F',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(11, 15, 46, 0.6)',
} as const;

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  backgroundElevated: string;
  backgroundDeep: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  cardBorder: string;
  gradientStart: string;
  gradientEnd: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  accentGold: string;
  accentGoldSoft: string;
  accentLavender: string;
  accentLavenderSoft: string;
  divider: string;
  success: string;
  warning: string;
  caution: string;
  danger: string;
  tabInactive: string;
  shadow: string;
  overlay: string;
}

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: palette.midnightNavyDeep,
  backgroundElevated: palette.midnightNavy,
  backgroundDeep: '#05071A',
  surface: palette.duskPurple,
  surfaceAlt: palette.velvetPlum,
  card: 'rgba(42, 31, 92, 0.55)',
  cardBorder: 'rgba(212, 175, 106, 0.18)',
  gradientStart: palette.midnightNavyDeep,
  gradientEnd: palette.duskPurple,
  textPrimary: palette.ivory,
  textSecondary: palette.lavenderSoft,
  textMuted: palette.mist,
  textInverse: palette.ink,
  accentGold: palette.goldBright,
  accentGoldSoft: 'rgba(232, 200, 126, 0.16)',
  accentLavender: palette.lavender,
  accentLavenderSoft: 'rgba(201, 190, 240, 0.14)',
  divider: 'rgba(255, 255, 255, 0.08)',
  success: palette.success,
  warning: palette.warning,
  caution: palette.caution,
  danger: palette.danger,
  tabInactive: 'rgba(228, 222, 248, 0.45)',
  shadow: 'rgba(0,0,0,0.4)',
  overlay: palette.overlay,
};

export const lightTheme: ThemeColors = {
  mode: 'light',
  background: palette.parchment,
  backgroundElevated: palette.ivory,
  backgroundDeep: palette.cloud,
  surface: palette.ivory,
  surfaceAlt: palette.cloud,
  card: '#FFFFFF',
  cardBorder: 'rgba(27, 23, 48, 0.08)',
  gradientStart: '#EFE9FB',
  gradientEnd: palette.parchment,
  textPrimary: palette.ink,
  textSecondary: palette.slate,
  textMuted: palette.mist,
  textInverse: palette.ivory,
  accentGold: palette.goldMuted,
  accentGoldSoft: 'rgba(181, 146, 75, 0.12)',
  accentLavender: palette.lavenderDeep,
  accentLavenderSoft: 'rgba(143, 127, 209, 0.12)',
  divider: 'rgba(27, 23, 48, 0.08)',
  success: '#3F8A6D',
  warning: '#B9701F',
  caution: '#A84B22',
  danger: '#9C3A24',
  tabInactive: 'rgba(84, 78, 118, 0.5)',
  shadow: 'rgba(27, 23, 48, 0.12)',
  overlay: 'rgba(27, 23, 48, 0.5)',
};
