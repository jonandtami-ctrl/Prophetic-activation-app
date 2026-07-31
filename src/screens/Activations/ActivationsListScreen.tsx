import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Badge, ProgressBar, EmptyState } from '../../components/ui';
import { PillSelect } from '../../components/shared';
import { useAppNavigation } from '../../navigation/hooks';
import { useActivationStore } from '../../store/useActivationStore';
import { ACTIVATIONS } from '../../data/activations';
import { CATEGORY_LABELS, CATEGORY_ORDER, LEVEL_LABELS, LEVEL_ORDER } from '../../constants/taxonomy';
import { ActivationCategory, ActivationLevel } from '../../types/models';

type LevelFilter = ActivationLevel | 'all';
type CategoryFilter = ActivationCategory | 'all';

export const ActivationsListScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const progressMap = useActivationStore((s) => s.progressByActivationId);
  const [level, setLevel] = useState<LevelFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const completedCount = useMemo(
    () => Object.values(progressMap).filter((p) => p.completionStatus === 'completed').length,
    [progressMap],
  );

  const filtered = useMemo(() => {
    return ACTIVATIONS.filter((a) => (level === 'all' || a.level === level) && (category === 'all' || a.category === category));
  }, [level, category]);

  return (
    <Screen>
      <View style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        <Text variant="display" style={{ marginBottom: 4 }}>
          Activations
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
          A guided pathway for practising intimacy with God and hearing His voice — beginner to advanced.
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text variant="caption" color="muted">
            {completedCount} of {ACTIVATIONS.length} completed
          </Text>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <ProgressBar progress={ACTIVATIONS.length ? completedCount / ACTIVATIONS.length : 0} />
        </View>
      </View>

      <PillSelect
        label="Level"
        value={level}
        onChange={setLevel}
        options={[{ value: 'all', label: 'All Levels' }, ...LEVEL_ORDER.map((l) => ({ value: l, label: LEVEL_LABELS[l] }))]}
      />
      <PillSelect
        label="Category"
        value={category}
        onChange={setCategory}
        options={[{ value: 'all', label: 'All Categories' }, ...CATEGORY_ORDER.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))]}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No activations match" message="Try a different level or category." />
      ) : (
        filtered.map((activation) => {
          const progress = progressMap[activation.id];
          const status = progress?.completionStatus ?? 'not-started';

          return (
            <Card
              key={activation.id}
              style={{ marginBottom: spacing.md }}
              onPress={() => navigation.navigate('ActivationDetail', { activationId: activation.id })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
                <Badge label={LEVEL_LABELS[activation.level]} tone={activation.level === 'advanced' ? 'danger' : activation.level === 'developing' ? 'warning' : 'success'} />
                {status === 'completed' ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                ) : status === 'in-progress' ? (
                  <Ionicons name="time-outline" size={20} color={colors.accentGold} />
                ) : progress?.favourite ? (
                  <Ionicons name="star" size={18} color={colors.accentGold} />
                ) : null}
              </View>
              <Text variant="heading" style={{ marginBottom: spacing.xs }}>
                {activation.title}
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.sm }} numberOfLines={2}>
                {activation.summary}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text variant="caption" color="muted">
                  {CATEGORY_LABELS[activation.category]}
                </Text>
                <Text variant="caption" color="muted">
                  ·
                </Text>
                <Text variant="caption" color="muted">
                  {activation.estimatedMinutes} min
                </Text>
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
};
