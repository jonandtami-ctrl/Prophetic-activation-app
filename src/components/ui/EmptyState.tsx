import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { QuillIcon } from './QuillIcon';

interface EmptyStateProps {
  title: string;
  message?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, children }) => {
  const { spacing, colors } = useTheme();

  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg }}>
      <QuillIcon size={40} color={colors.accentGold} />
      <Text variant="subheading" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
        {title}
      </Text>
      {message ? (
        <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
          {message}
        </Text>
      ) : null}
      {children ? <View style={{ marginTop: spacing.lg }}>{children}</View> : null}
    </View>
  );
};
