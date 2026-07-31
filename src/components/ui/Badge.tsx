import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface BadgeProps {
  label: string;
  tone?: 'gold' | 'lavender' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ label, tone = 'gold' }) => {
  const { colors, radius, spacing } = useTheme();

  const toneMap = {
    gold: { bg: colors.accentGoldSoft, fg: colors.accentGold },
    lavender: { bg: colors.accentLavenderSoft, fg: colors.accentLavender },
    success: { bg: `${colors.success}22`, fg: colors.success },
    warning: { bg: `${colors.warning}22`, fg: colors.warning },
    danger: { bg: `${colors.danger}22`, fg: colors.danger },
    neutral: { bg: colors.divider, fg: colors.textSecondary },
  }[tone];

  return (
    <View
      style={{
        backgroundColor: toneMap.bg,
        borderRadius: radius.pill,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="label" style={{ color: toneMap.fg, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
};
