/**
 * Prophetic Journal design tokens.
 * Visual direction: sky blue + cream ivory/white — an open, airy, "heaven
 * and light" palette. Light theme sits on cream/ivory with sky-blue accents;
 * dark theme inverts to a deep sky-blue night with cream accents.
 *
 * Note: the `accentGold`/`accentLavender` field names on ThemeColors are
 * historical (kept so every component that already reads them doesn't need
 * touching) — they now hold the primary/secondary sky-blue-family accents,
 * not literal gold/lavender.
 */

export const palette = {
  skyDeeper: '#081A28',
  skyDeep: '#0E2B40',
  skySurface: '#1B4A68',
  skySurfaceLight: '#245D82',

  sky: '#5FA8D3',
  skyBright: '#7FC4EA',
  skyMuted: '#3E7CA6',
  skyDark: '#2C6E93',

  cream: '#F6EFDD',
  creamDeep: '#EDE2C6',
  ivory: '#FFFDF6',

  ink: '#1C2B36',
  slate: '#4F6672',
  mist: '#8AA2AC',

  success: '#3F8A6D',
  warning: '#B9701F',
  caution: '#A84B22',
  danger: '#9C3A24',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(8, 26, 40, 0.6)',
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
  background: palette.skyDeeper,
  backgroundElevated: palette.skyDeep,
  backgroundDeep: '#040F18',
  surface: palette.skySurface,
  surfaceAlt: palette.skySurfaceLight,
  card: 'rgba(27, 74, 104, 0.55)',
  cardBorder: 'rgba(127, 196, 234, 0.20)',
  gradientStart: palette.skyDeeper,
  gradientEnd: palette.skyDeep,
  textPrimary: palette.ivory,
  textSecondary: '#CFE7F3',
  textMuted: '#7FA3B5',
  textInverse: palette.ink,
  accentGold: palette.skyBright,
  accentGoldSoft: 'rgba(127, 196, 234, 0.16)',
  accentLavender: palette.cream,
  accentLavenderSoft: 'rgba(246, 239, 221, 0.14)',
  divider: 'rgba(255, 255, 255, 0.08)',
  success: palette.success,
  warning: palette.warning,
  caution: palette.caution,
  danger: palette.danger,
  tabInactive: 'rgba(207, 231, 243, 0.45)',
  shadow: 'rgba(0,0,0,0.4)',
  overlay: palette.overlay,
};

export const lightTheme: ThemeColors = {
  mode: 'light',
  background: palette.cream,
  backgroundElevated: palette.ivory,
  backgroundDeep: palette.creamDeep,
  surface: palette.ivory,
  surfaceAlt: palette.creamDeep,
  card: '#FFFFFF',
  cardBorder: 'rgba(62, 124, 166, 0.15)',
  gradientStart: '#EAF4FB',
  gradientEnd: palette.cream,
  textPrimary: palette.ink,
  textSecondary: palette.slate,
  textMuted: palette.mist,
  textInverse: palette.ivory,
  accentGold: palette.skyMuted,
  accentGoldSoft: 'rgba(62, 124, 166, 0.12)',
  accentLavender: palette.skyDark,
  accentLavenderSoft: 'rgba(44, 110, 147, 0.12)',
  divider: 'rgba(28, 43, 54, 0.08)',
  success: '#3F8A6D',
  warning: '#B9701F',
  caution: '#A84B22',
  danger: '#9C3A24',
  tabInactive: 'rgba(79, 102, 114, 0.5)',
  shadow: 'rgba(28, 43, 54, 0.12)',
  overlay: 'rgba(28, 43, 54, 0.5)',
};
