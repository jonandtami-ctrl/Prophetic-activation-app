import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { CONTROLLING_LANGUAGE_EXAMPLES, HUMBLE_LANGUAGE_EXAMPLES } from '../../constants/taxonomy';

export const ShareLanguageHelper: React.FC = () => {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <Text variant="heading" style={{ marginBottom: spacing.md }}>
        How to share it well
      </Text>
      <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
        A prophetic impression is an offering, not a verdict. Language that stays humble protects both you and the
        person you're speaking to.
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm }}>
        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
        <Text variant="subheading" color="success">
          Try language like
        </Text>
      </View>
      {HUMBLE_LANGUAGE_EXAMPLES.map((line) => (
        <Text key={line} variant="bodySmall" color="secondary" style={{ marginBottom: 6, fontStyle: 'italic' }}>
          "{line}"
        </Text>
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg, marginBottom: spacing.sm }}>
        <Ionicons name="close-circle" size={16} color={colors.danger} />
        <Text variant="subheading" color="danger">
          Avoid controlling language like
        </Text>
      </View>
      {CONTROLLING_LANGUAGE_EXAMPLES.map((line) => (
        <Text key={line} variant="bodySmall" color="secondary" style={{ marginBottom: 6, fontStyle: 'italic' }}>
          "{line}"
        </Text>
      ))}
    </Card>
  );
};
