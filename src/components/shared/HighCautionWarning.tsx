import React from 'react';
import { Modal, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { HIGH_CAUTION_EXPLANATION, HIGH_CAUTION_INTRO } from '../../constants/disclaimers';

interface HighCautionWarningProps {
  visible: boolean;
  topics: string[];
  onAcknowledge: () => void;
  onCancel: () => void;
}

export const HighCautionWarning: React.FC<HighCautionWarningProps> = ({ visible, topics, onAcknowledge, onCancel }) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.xl }}>
        <View
          style={{
            backgroundColor: colors.backgroundElevated,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <Ionicons name="alert-circle" size={36} color={colors.caution} />
          </View>
          <Text variant="title" style={{ textAlign: 'center', marginBottom: spacing.md }}>
            A moment before you continue
          </Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
            {HIGH_CAUTION_INTRO}
          </Text>

          {topics.length > 0 ? (
            <View style={{ marginBottom: spacing.lg }}>
              {topics.map((topic) => (
                <View key={topic} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Ionicons name="ellipse" size={6} color={colors.caution} />
                  <Text variant="bodySmall" color="secondary">
                    {topic}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.xl }}>
            {HIGH_CAUTION_EXPLANATION}
          </Text>

          <Button label="I understand — continue with care" onPress={onAcknowledge} fullWidth />
          <View style={{ height: spacing.sm }} />
          <Button label="Go back" variant="ghost" onPress={onCancel} fullWidth />
        </View>
      </View>
    </Modal>
  );
};
