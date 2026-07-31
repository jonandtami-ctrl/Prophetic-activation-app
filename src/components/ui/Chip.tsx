import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, selected, onPress }) => {
  const { colors, radius, spacing } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        borderRadius: radius.pill,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: selected ? colors.accentGold : 'transparent',
        borderWidth: 1,
        borderColor: selected ? colors.accentGold : colors.cardBorder,
      }}
    >
      <Text variant="bodySmall" style={{ color: selected ? colors.textInverse : colors.textSecondary, fontWeight: selected ? '600' : '400' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
