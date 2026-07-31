import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';

export const Divider: React.FC<{ spacingY?: number }> = ({ spacingY }) => {
  const { colors, spacing } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.divider, marginVertical: spacingY ?? spacing.lg }} />;
};
