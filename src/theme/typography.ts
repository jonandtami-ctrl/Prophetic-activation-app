import { Platform } from 'react-native';

/**
 * Elegant, spacious type system. Uses platform serif for display/scripture
 * moments and a clean system sans for everything functional, so the app
 * reads as calm and premium rather than clinical.
 */
export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  sansMedium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
};

export const type = {
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 40, letterSpacing: 0.2 },
  title: { fontFamily: fonts.sansMedium, fontSize: 24, lineHeight: 31, letterSpacing: 0.1, fontWeight: '600' as const },
  heading: { fontFamily: fonts.sansMedium, fontSize: 19, lineHeight: 25, fontWeight: '600' as const },
  subheading: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 17, letterSpacing: 0.3 },
  scripture: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 29, fontStyle: 'italic' as const },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  button: { fontFamily: fonts.sansMedium, fontSize: 16, lineHeight: 20, fontWeight: '600' as const },
};

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};
