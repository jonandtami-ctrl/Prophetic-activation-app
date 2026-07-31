import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionLabel, onAction }) => {
  const { spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.md }}>
      <View style={{ flex: 1 }}>
        <Text variant="heading">{title}</Text>
        {subtitle ? (
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction}>
          <Text variant="bodySmall" color="gold">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
