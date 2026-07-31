import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Badge, ProgressBar, SectionHeader, IconCircle } from '../../components/ui';
import { useJournalStore } from '../../store/useJournalStore';
import { useDreamStore } from '../../store/useDreamStore';
import { useActivationStore } from '../../store/useActivationStore';
import { ACTIVATIONS } from '../../data/activations';
import { computeStreak } from '../../lib/streaks';
import { findRecurringThemes } from '../../lib/reflectionAssistant';
import { mostCommonSensingMethods, computeMilestones, monthlySummary } from '../../lib/growth';

export const GrowthScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const entries = useJournalStore((s) => s.entries);
  const dreams = useDreamStore((s) => s.dreams);
  const progressMap = useActivationStore((s) => s.progressByActivationId);

  const completedActivations = useMemo(() => Object.values(progressMap).filter((p) => p.completionStatus === 'completed'), [progressMap]);

  const listeningStreak = useMemo(() => {
    const dates = [
      ...entries.filter((e) => e.entryType === 'listening-prayer').map((e) => e.createdAt),
      ...completedActivations.map((p) => p.completedAt).filter((d): d is string => Boolean(d)),
    ];
    return computeStreak(dates);
  }, [entries, completedActivations]);

  const journalStreak = useMemo(() => computeStreak([...entries.map((e) => e.createdAt), ...dreams.map((d) => d.createdAt)]), [entries, dreams]);

  const recurringThemes = useMemo(() => {
    const texts = [
      ...entries.map((e) => `${e.whatISensed ?? ''} ${e.possibleInterpretation ?? ''}`),
      ...dreams.map((d) => `${d.fullDream} ${d.possibleMeaning ?? ''}`),
    ].filter(Boolean);
    return findRecurringThemes(texts, 2, 8);
  }, [entries, dreams]);

  const sensingMethods = useMemo(() => mostCommonSensingMethods(entries), [entries]);

  const confirmationRate = useMemo(() => {
    const withStatus = entries.filter((e) => e.entryType !== 'general');
    if (withStatus.length === 0) return 0;
    const confirmed = withStatus.filter((e) => (e.confirmation && e.confirmation.trim().length > 0) || e.status === 'fulfilled' || e.status === 'partially-fulfilled');
    return confirmed.length / withStatus.length;
  }, [entries]);

  const fulfilledWords = useMemo(() => entries.filter((e) => e.status === 'fulfilled' || e.status === 'partially-fulfilled'), [entries]);
  const lessonsLearned = useMemo(() => entries.filter((e) => e.status === 'released' && (e.outcome || e.personalAssumptionsOrBias)), [entries]);

  const month = useMemo(() => monthlySummary(entries, dreams), [entries, dreams]);

  const milestones = useMemo(
    () =>
      computeMilestones({
        entryCount: entries.length,
        dreamCount: dreams.length,
        completedActivations: completedActivations.length,
        longestJournalStreak: journalStreak.longest,
        fulfilledWords: fulfilledWords.length,
      }),
    [entries.length, dreams.length, completedActivations.length, journalStreak.longest, fulfilledWords.length],
  );

  return (
    <Screen>
      <View style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        <Text variant="display" style={{ marginBottom: 4 }}>
          Growth
        </Text>
        <Text variant="bodySmall" color="secondary">
          A private record of your journey — never a scoreboard.
        </Text>
      </View>

      {/* Streaks */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text variant="display" color="gold">
            {listeningStreak.current}
          </Text>
          <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
            LISTENING{'\n'}STREAK
          </Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text variant="display" color="lavender">
            {journalStreak.current}
          </Text>
          <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
            JOURNAL{'\n'}STREAK
          </Text>
        </Card>
      </View>

      {/* Activation completion */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.sm }}>
          Activation Completion
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
          {completedActivations.length} of {ACTIVATIONS.length} activations completed
        </Text>
        <ProgressBar progress={ACTIVATIONS.length ? completedActivations.length / ACTIVATIONS.length : 0} />
      </Card>

      {/* Monthly reflection */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.sm }}>
          {month.monthLabel}
        </Text>
        <Text variant="bodySmall" color="secondary">
          {month.entryCount} journal entr{month.entryCount === 1 ? 'y' : 'ies'} and {month.dreamCount} dream{month.dreamCount === 1 ? '' : 's'} recorded this month.
        </Text>
      </Card>

      {/* Most common ways of sensing God */}
      {sensingMethods.length > 0 ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text variant="heading" style={{ marginBottom: spacing.md }}>
            How You Most Often Sense God
          </Text>
          {sensingMethods.map((m) => (
            <View key={m.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <Text variant="bodySmall" color="secondary">
                {m.label}
              </Text>
              <Text variant="bodySmall" color="gold">
                {m.count}×
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

      {/* Recurring themes */}
      {recurringThemes.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionHeader title="Recurring Themes" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {recurringThemes.map((t) => (
              <Badge key={t.theme} label={`${t.theme} · ${t.count}`} tone="lavender" />
            ))}
          </View>
        </View>
      ) : null}

      {/* Confirmation rate */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.sm }}>
          Confirmation Rate
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
          Share of prophetic entries with confirmation recorded or a fulfilled outcome.
        </Text>
        <ProgressBar progress={confirmationRate} />
        <Text variant="caption" color="muted" style={{ marginTop: spacing.sm }}>
          {Math.round(confirmationRate * 100)}%
        </Text>
      </Card>

      {/* Fulfilled word tracker */}
      <View style={{ marginBottom: spacing.lg }}>
        <SectionHeader title="Fulfilled Word Tracker" />
        {fulfilledWords.length === 0 ? (
          <Text variant="bodySmall" color="muted">
            Nothing marked fulfilled yet — that's completely normal. Confirmation often takes time.
          </Text>
        ) : (
          fulfilledWords.map((e) => (
            <Card key={e.id} style={{ marginBottom: spacing.sm }}>
              <Text variant="subheading">{e.title || 'Untitled entry'}</Text>
              {e.outcome ? (
                <Text variant="bodySmall" color="secondary" style={{ marginTop: 4 }}>
                  {e.outcome}
                </Text>
              ) : null}
            </Card>
          ))
        )}
      </View>

      {/* Lessons learned */}
      {lessonsLearned.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionHeader title="Lessons Learned" subtitle="From words you released — growth, not failure" />
          {lessonsLearned.map((e) => (
            <Card key={e.id} style={{ marginBottom: spacing.sm }}>
              <Text variant="subheading" style={{ marginBottom: 4 }}>
                {e.title || 'Untitled entry'}
              </Text>
              {e.personalAssumptionsOrBias ? (
                <Text variant="bodySmall" color="secondary">
                  {e.personalAssumptionsOrBias}
                </Text>
              ) : null}
            </Card>
          ))}
        </View>
      ) : null}

      {/* Milestones */}
      <View style={{ marginBottom: spacing.xxxl }}>
        <SectionHeader title="Private Milestones" subtitle="Just for you — never shared or ranked" />
        {milestones.map((m) => (
          <Card key={m.id} style={{ marginBottom: spacing.sm, opacity: m.achieved ? 1 : 0.5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <IconCircle size={36} tone={m.achieved ? 'gold' : 'lavender'}>
                <Ionicons name={m.achieved ? 'trophy' : 'trophy-outline'} size={16} color={m.achieved ? colors.accentGold : colors.textMuted} />
              </IconCircle>
              <View style={{ flex: 1 }}>
                <Text variant="subheading">{m.label}</Text>
                <Text variant="caption" color="muted">
                  {m.detail}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
};
