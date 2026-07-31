import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

type Variant = keyof ReturnType<typeof useTheme>['type'];
type ColorRole = 'primary' | 'secondary' | 'muted' | 'inverse' | 'gold' | 'lavender' | 'success' | 'warning' | 'danger';

interface TextComponentProps extends RNTextProps {
  variant?: Variant;
  color?: ColorRole;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export const Text: React.FC<TextComponentProps> = ({ variant = 'body', color = 'primary', style, children, ...rest }) => {
  const { colors, type } = useTheme();

  const colorMap: Record<ColorRole, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    inverse: colors.textInverse,
    gold: colors.accentGold,
    lavender: colors.accentLavender,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  return (
    <RNText style={[type[variant] as TextStyle, { color: colorMap[color] }, style]} {...rest}>
      {children}
    </RNText>
  );
};
