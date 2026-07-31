import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { DISCERNMENT_CHECKLIST_ITEMS } from '../../constants/taxonomy';
import { DiscernmentChecklistAnswers } from '../../types/models';
import { Ionicons } from '@expo/vector-icons';

interface DiscernmentChecklistProps {
  answers: DiscernmentChecklistAnswers;
  onChange: (key: keyof DiscernmentChecklistAnswers, value: unknown) => void;
}

export const DiscernmentChecklist: React.FC<DiscernmentChecklistProps> = ({ answers, onChange }) => {
  const { colors, spacing } = useTheme();

  return (
    <Card>
      <Text variant="heading" style={{ marginBottom: spacing.xs }}>
        Biblical Discernment Checklist
      </Text>
      <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
        There are no wrong answers here — this is for your own reflection, not a test to pass.
      </Text>
      {DISCERNMENT_CHECKLIST_ITEMS.map((item, index) => {
        const key = item.key as keyof DiscernmentChecklistAnswers;
        const isTiming = item.key === 'timingDecision';

        return (
          <View key={item.key} style={{ marginBottom: index === DISCERNMENT_CHECKLIST_ITEMS.length - 1 ? 0 : spacing.lg }}>
            <Text variant="body" style={{ marginBottom: spacing.sm }}>
              {item.question}
            </Text>
            {isTiming ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['now', 'later', 'not-at-all'] as const).map((option) => {
                  const selected = answers.timingDecision === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onChange('timingDecision', option)}
                      style={{
                        flex: 1,
                        paddingVertical: spacing.sm,
                        borderRadius: 10,
                        alignItems: 'center',
                        backgroundColor: selected ? colors.accentGold : colors.accentGoldSoft,
                        borderWidth: 1,
                        borderColor: selected ? colors.accentGold : colors.cardBorder,
                      }}
                    >
                      <Text variant="caption" style={{ color: selected ? colors.textInverse : colors.textSecondary, textTransform: 'capitalize' }}>
                        {option.replace('-', ' ')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { label: 'Yes', value: true, icon: 'checkmark' as const },
                  { label: 'Not sure', value: null, icon: 'help' as const },
                  { label: 'No', value: false, icon: 'close' as const },
                ].map((opt) => {
                  const selected = answers[key] === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      onPress={() => onChange(key, opt.value)}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 4,
                        paddingVertical: spacing.sm,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selected ? colors.accentLavender : colors.accentLavenderSoft,
                        borderWidth: 1,
                        borderColor: selected ? colors.accentLavender : colors.cardBorder,
                      }}
                    >
                      <Ionicons name={opt.icon} size={13} color={selected ? colors.textInverse : colors.textSecondary} />
                      <Text variant="caption" style={{ color: selected ? colors.textInverse : colors.textSecondary }}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </Card>
  );
};
