import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Badge, EmptyState, Button, IconCircle } from '../../components/ui';
import { useAppNavigation } from '../../navigation/hooks';
import { useDreamStore } from '../../store/useDreamStore';
import { STATUS_LABELS } from '../../constants/taxonomy';
import { formatFriendlyDate } from '../../lib/dates';
import { DREAM_DISCLAIMER } from '../../constants/disclaimers';

const STATUS_TONE = {
  fulfilled: 'success' as const,
  'partially-fulfilled': 'warning' as const,
  unconfirmed: 'neutral' as const,
  released: 'lavender' as const,
};

export const DreamsListScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const dreams = useDreamStore((s) => s.dreams);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <View>
          <Text variant="display" style={{ marginBottom: 4 }}>
            Dreams
          </Text>
          <Text variant="bodySmall" color="secondary">
            Biblical Dream Discernment journal
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('DreamEntry', {})}>
          <IconCircle size={44} tone="lavender">
            <Ionicons name="add" size={22} color={colors.accentLavender} />
          </IconCircle>
        </TouchableOpacity>
      </View>

      <Card style={{ marginBottom: spacing.lg, borderColor: colors.accentLavender }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Ionicons name="moon-outline" size={18} color={colors.accentLavender} />
          <Text variant="bodySmall" color="secondary" style={{ flex: 1, fontStyle: 'italic' }}>
            {DREAM_DISCLAIMER}
          </Text>
        </View>
      </Card>

      {dreams.length === 0 ? (
        <EmptyState title="No dreams recorded yet" message="When you wake with a dream, record it here — before the details fade.">
          <Button label="Record a dream" onPress={() => navigation.navigate('DreamEntry', {})} />
        </EmptyState>
      ) : (
        dreams.map((dream) => (
          <Card key={dream.id} style={{ marginBottom: spacing.md }} onPress={() => navigation.navigate('DreamEntry', { dreamId: dream.id })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <Badge label="Dream" tone="lavender" />
              <Text variant="caption" color="muted">
                {formatFriendlyDate(dream.dreamDate)}
              </Text>
            </View>
            <Text variant="subheading" style={{ marginBottom: spacing.xs }}>
              {dream.title || 'Untitled dream'}
            </Text>
            {dream.fullDream ? (
              <Text variant="bodySmall" color="secondary" numberOfLines={2} style={{ marginBottom: spacing.sm }}>
                {dream.fullDream}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              <Badge label={STATUS_LABELS[dream.status]} tone={STATUS_TONE[dream.status]} />
              {dream.possibleSymbols.slice(0, 3).map((s) => (
                <Badge key={s} label={s} tone="neutral" />
              ))}
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
};
