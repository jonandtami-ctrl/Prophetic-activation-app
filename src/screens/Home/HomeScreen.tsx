import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Button, Badge, SectionHeader, Divider, IconCircle, QuillIcon } from '../../components/ui';
import { useAppNavigation } from '../../navigation/hooks';
import { useUserStore } from '../../store/useUserStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useDreamStore } from '../../store/useDreamStore';
import { useActivationStore } from '../../store/useActivationStore';
import { ACTIVATIONS, getActivationById } from '../../data/activations';
import { scriptureForToday, listeningPromptForToday } from '../../data/scriptures';
import { computeStreak } from '../../lib/streaks';
import { findRecurringThemes } from '../../lib/reflectionAssistant';
import { greetingForNow } from '../../lib/greeting';
import { formatFriendlyDate } from '../../lib/dates';
import { ENTRY_TYPE_LABELS, CATEGORY_LABELS } from '../../constants/taxonomy';
import { SCRIPTURE_TESTING_REMINDER } from '../../constants/disclaimers';

export const HomeScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const displayName = useUserStore((s) => s.displayName);
  const entries = useJournalStore((s) => s.entries);
  const dreams = useDreamStore((s) => s.dreams);
  const progressMap = useActivationStore((s) => s.progressByActivationId);

  const scripture = useMemo(() => scriptureForToday(), []);
  const listeningPrompt = useMemo(() => listeningPromptForToday(), []);

  const inProgressActivation = useMemo(() => {
    const entriesArr = Object.values(progressMap).filter((p) => p.completionStatus === 'in-progress');
    entriesArr.sort((a, b) => (b.lastOpenedAt ?? '').localeCompare(a.lastOpenedAt ?? ''));
    const found = entriesArr[0];
    return found ? getActivationById(found.activationId) : undefined;
  }, [progressMap]);

  const recommendedActivation = useMemo(() => {
    if (inProgressActivation) return undefined;
    return ACTIVATIONS.find((a) => (progressMap[a.id]?.completionStatus ?? 'not-started') === 'not-started' && a.level === 'beginner');
  }, [inProgressActivation, progressMap]);

  const activationStreak = useMemo(() => {
    const dates = Object.values(progressMap).map((p) => p.completedAt).filter((d): d is string => Boolean(d));
    return computeStreak(dates);
  }, [progressMap]);

  const journalStreak = useMemo(() => {
    const dates = [...entries.map((e) => e.createdAt), ...dreams.map((d) => d.createdAt)];
    return computeStreak(dates);
  }, [entries, dreams]);

  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);

  const unreviewedWords = useMemo(
    () =>
      entries.filter(
        (e) =>
          (e.entryType === 'prophetic-word' || e.entryType === 'word-of-knowledge' || e.entryType === 'picture-vision') &&
          Object.keys(e.discernment).length === 0,
      ),
    [entries],
  );

  const awaitingConfirmation = useMemo(() => entries.filter((e) => e.status === 'unconfirmed'), [entries]);

  const recurringThemes = useMemo(() => {
    const texts = entries.map((e) => `${e.whatISensed ?? ''} ${e.possibleInterpretation ?? ''}`).filter(Boolean);
    return findRecurringThemes(texts, 2, 6);
  }, [entries]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <View style={{ flex: 1 }}>
          <Text variant="display" style={{ marginBottom: 2 }}>
            {greetingForNow(displayName)}
          </Text>
          <Text variant="bodySmall" color="gold">
            Hear. Record. Discern. Grow.
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} onPress={() => navigation.navigate('Profile')} />
      </View>

      {/* Daily Scripture */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Badge label="Daily Scripture" tone="gold" />
        <Text variant="scripture" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          "{scripture.text}"
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.sm }}>
          — {scripture.reference}
        </Text>
        <Text variant="bodySmall" color="muted">
          {scripture.reflection}
        </Text>
      </Card>

      {/* Continue / Start activation */}
      {inProgressActivation ? (
        <Card style={{ marginBottom: spacing.lg }} onPress={() => navigation.navigate('ActivationDetail', { activationId: inProgressActivation.id })}>
          <Badge label="Continue Activation" tone="lavender" />
          <Text variant="heading" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
            {inProgressActivation.title}
          </Text>
          <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
            {CATEGORY_LABELS[inProgressActivation.category]} · {inProgressActivation.estimatedMinutes} min
          </Text>
          <Button label="Continue" onPress={() => navigation.navigate('ActivationDetail', { activationId: inProgressActivation.id })} size="sm" />
        </Card>
      ) : recommendedActivation ? (
        <Card style={{ marginBottom: spacing.lg }} onPress={() => navigation.navigate('ActivationDetail', { activationId: recommendedActivation.id })}>
          <Badge label="Try an Activation" tone="lavender" />
          <Text variant="heading" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
            {recommendedActivation.title}
          </Text>
          <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
            {recommendedActivation.summary}
          </Text>
          <Button label="Begin" onPress={() => navigation.navigate('ActivationDetail', { activationId: recommendedActivation.id })} size="sm" />
        </Card>
      ) : null}

      {/* Quick actions */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
        <Button
          label="Quick Journal"
          variant="secondary"
          icon={<Ionicons name="create-outline" size={18} color={colors.textPrimary} />}
          onPress={() => navigation.navigate('JournalEntry', { presetType: 'general' })}
          style={{ flex: 1, justifyContent: 'center' }}
          fullWidth
        />
        <Button
          label="Record a Dream"
          variant="secondary"
          icon={<Ionicons name="moon-outline" size={18} color={colors.textPrimary} />}
          onPress={() => navigation.navigate('DreamEntry', {})}
          style={{ flex: 1, justifyContent: 'center' }}
          fullWidth
        />
      </View>

      {/* Daily listening prompt */}
      <Card style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
          <IconCircle tone="lavender">
            <Ionicons name="ear-outline" size={20} color={colors.accentLavender} />
          </IconCircle>
          <Text variant="subheading">Today's Listening Prompt</Text>
        </View>
        <Text variant="body" color="secondary">
          {listeningPrompt}
        </Text>
      </Card>

      {/* Streaks */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text variant="display" color="gold">
            {activationStreak.current}
          </Text>
          <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
            DAY ACTIVATION{'\n'}STREAK
          </Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text variant="display" color="lavender">
            {journalStreak.current}
          </Text>
          <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
            DAY LISTENING{'\n'}STREAK
          </Text>
        </Card>
      </View>

      {/* Unreviewed / awaiting confirmation */}
      {unreviewedWords.length > 0 || awaitingConfirmation.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionHeader title="Words to Revisit" subtitle="Nothing urgent — just gentle reminders" />
          {unreviewedWords.length > 0 ? (
            <Card
              style={{ marginBottom: spacing.md }}
              onPress={() => navigation.navigate('Journal')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <IconCircle>
                  <Ionicons name="eye-outline" size={18} color={colors.accentGold} />
                </IconCircle>
                <View style={{ flex: 1 }}>
                  <Text variant="subheading">{unreviewedWords.length} unreviewed word{unreviewedWords.length === 1 ? '' : 's'}</Text>
                  <Text variant="caption" color="muted">Run these through the Discernment Checklist</Text>
                </View>
              </View>
            </Card>
          ) : null}
          {awaitingConfirmation.length > 0 ? (
            <Card onPress={() => navigation.navigate('Journal')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <IconCircle tone="lavender">
                  <Ionicons name="hourglass-outline" size={18} color={colors.accentLavender} />
                </IconCircle>
                <View style={{ flex: 1 }}>
                  <Text variant="subheading">{awaitingConfirmation.length} awaiting confirmation</Text>
                  <Text variant="caption" color="muted">Held loosely, waiting on the Lord and community</Text>
                </View>
              </View>
            </Card>
          ) : null}
        </View>
      ) : null}

      {/* Recent entries */}
      <View style={{ marginBottom: spacing.lg }}>
        <SectionHeader title="Recent Entries" actionLabel={entries.length > 0 ? 'View all' : undefined} onAction={() => navigation.navigate('Journal')} />
        {recentEntries.length === 0 ? (
          <Card>
            <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
              <QuillIcon size={28} color={colors.accentGold} />
              <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
                Your journal is quiet for now. Whenever you sense something, however small, it has a home here.
              </Text>
            </View>
          </Card>
        ) : (
          recentEntries.map((entry, i) => (
            <Card
              key={entry.id}
              style={{ marginBottom: i === recentEntries.length - 1 ? 0 : spacing.md }}
              onPress={() => navigation.navigate('JournalEntry', { entryId: entry.id })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Badge label={ENTRY_TYPE_LABELS[entry.entryType]} tone="neutral" />
                <Text variant="caption" color="muted">
                  {formatFriendlyDate(entry.entryDate)}
                </Text>
              </View>
              <Text variant="subheading">{entry.title || 'Untitled entry'}</Text>
              {entry.whatISensed ? (
                <Text variant="bodySmall" color="secondary" numberOfLines={2} style={{ marginTop: spacing.xs }}>
                  {entry.whatISensed}
                </Text>
              ) : null}
            </Card>
          ))
        )}
      </View>

      {/* Recurring themes */}
      {recurringThemes.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionHeader title="Recurring Themes" subtitle="Words showing up again and again in your journal" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {recurringThemes.map((t) => (
              <Badge key={t.theme} label={`${t.theme} · ${t.count}`} tone="lavender" />
            ))}
          </View>
        </View>
      ) : null}

      <Divider />

      <Card style={{ marginBottom: spacing.xxxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.accentGold} />
          <Text variant="bodySmall" color="secondary" style={{ flex: 1 }}>
            {SCRIPTURE_TESTING_REMINDER}
          </Text>
        </View>
      </Card>
    </Screen>
  );
};
