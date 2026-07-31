import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Badge, EmptyState, Button, IconCircle, OpenBookIcon } from '../../components/ui';
import { PillSelect } from '../../components/shared';
import { useAppNavigation } from '../../navigation/hooks';
import { useJournalStore } from '../../store/useJournalStore';
import { ENTRY_TYPE_LABELS, ENTRY_TYPE_ORDER, STATUS_LABELS } from '../../constants/taxonomy';
import { JournalEntryType } from '../../types/models';
import { formatFriendlyDate } from '../../lib/dates';

type TypeFilter = JournalEntryType | 'all';

const STATUS_TONE = {
  fulfilled: 'success' as const,
  'partially-fulfilled': 'warning' as const,
  unconfirmed: 'neutral' as const,
  released: 'lavender' as const,
};

export const JournalListScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const entries = useJournalStore((s) => s.entries);
  const [filter, setFilter] = useState<TypeFilter>('all');

  const filtered = useMemo(() => (filter === 'all' ? entries : entries.filter((e) => e.entryType === filter)), [entries, filter]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <View>
          <Text variant="display" style={{ marginBottom: 4 }}>
            Journal
          </Text>
          <Text variant="bodySmall" color="secondary">
            {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} recorded
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('JournalEntry', {})}>
          <IconCircle size={44}>
            <Ionicons name="add" size={22} color={colors.accentGold} />
          </IconCircle>
        </TouchableOpacity>
      </View>

      <PillSelect
        value={filter}
        onChange={setFilter}
        options={[{ value: 'all', label: 'All' }, ...ENTRY_TYPE_ORDER.map((t) => ({ value: t, label: ENTRY_TYPE_LABELS[t] }))]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          message="Whenever you sense something in prayer — a word, a picture, a feeling — it has a home here."
        >
          <Button label="Write your first entry" onPress={() => navigation.navigate('JournalEntry', {})} />
        </EmptyState>
      ) : (
        filtered.map((entry) => (
          <Card key={entry.id} style={{ marginBottom: spacing.md }} onPress={() => navigation.navigate('JournalEntry', { entryId: entry.id })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <Badge label={ENTRY_TYPE_LABELS[entry.entryType]} tone="neutral" />
              <Text variant="caption" color="muted">
                {formatFriendlyDate(entry.entryDate)}
              </Text>
            </View>
            <Text variant="subheading" style={{ marginBottom: spacing.xs }}>
              {entry.title || 'Untitled entry'}
            </Text>
            {entry.whatISensed ? (
              <Text variant="bodySmall" color="secondary" numberOfLines={2} style={{ marginBottom: spacing.sm }}>
                {entry.whatISensed}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Badge label={STATUS_LABELS[entry.status]} tone={STATUS_TONE[entry.status]} />
              {entry.isHighCaution ? <Badge label="High Caution" tone="danger" /> : null}
            </View>
          </Card>
        ))
      )}

      {filtered.length > 0 ? (
        <View style={{ alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xxxl, opacity: 0.5 }}>
          <OpenBookIcon size={22} color={colors.accentGold} />
        </View>
      ) : null}
    </Screen>
  );
};
