import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Button, Badge, Divider, SectionHeader, IconCircle } from '../../components/ui';
import { DiscernmentChecklist, Timer } from '../../components/shared';
import { RootStackParamList } from '../../navigation/types';
import { useAppNavigation } from '../../navigation/hooks';
import { getActivationById } from '../../data/activations';
import { useActivationStore } from '../../store/useActivationStore';
import { useJournalStore } from '../../store/useJournalStore';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../../constants/taxonomy';
import { RELATIONAL_FOUNDATION_NOTE } from '../../constants/disclaimers';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivationDetail'>;

export const ActivationDetailScreen: React.FC<Props> = ({ route }) => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const activation = getActivationById(route.params.activationId);

  const progress = useActivationStore((s) => (activation ? s.getProgress(activation.id) : undefined));
  const markInProgress = useActivationStore((s) => s.markInProgress);
  const markComplete = useActivationStore((s) => s.markComplete);
  const toggleFavourite = useActivationStore((s) => s.toggleFavourite);
  const saveJournalResponse = useActivationStore((s) => s.saveJournalResponse);
  const setDiscernmentAnswer = useActivationStore((s) => s.setDiscernmentAnswer);
  const setCurrentActivation = useActivationStore((s) => s.setCurrentActivation);
  const addJournalEntry = useJournalStore((s) => s.addEntry);

  const [showTimer, setShowTimer] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (activation) {
      setCurrentActivation(activation.id);
      markInProgress(activation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activation?.id]);

  const related = useMemo(
    () => activation?.relatedActivationIds.map((id) => getActivationById(id)).filter((a): a is NonNullable<typeof a> => Boolean(a)) ?? [],
    [activation],
  );

  if (!activation || !progress) {
    return (
      <Screen>
        <Text variant="heading">Activation not found</Text>
      </Screen>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleComplete = () => {
    const responseText = activation.journalPrompts
      .map((prompt) => `${prompt}\n${progress.journalResponses[prompt] ?? ''}`)
      .join('\n\n');
    addJournalEntry({
      entryType: 'general',
      title: `Activation: ${activation.title}`,
      whatISensed: responseText || undefined,
      tags: [activation.category, activation.level],
      themes: [activation.title],
    });
    markComplete(activation.id);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavourite(activation.id)}>
          <Ionicons name={progress.favourite ? 'star' : 'star-outline'} size={24} color={colors.accentGold} />
        </TouchableOpacity>
      </View>

      <Badge label={LEVEL_LABELS[activation.level]} tone={activation.level === 'advanced' ? 'danger' : activation.level === 'developing' ? 'warning' : 'success'} />
      <Text variant="display" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
        {activation.title}
      </Text>
      <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.sm }}>
        {CATEGORY_LABELS[activation.category]} · {activation.estimatedMinutes} min
      </Text>
      <Text variant="body" color="secondary" style={{ marginBottom: spacing.xl }}>
        {activation.summary}
      </Text>

      {/* Purpose */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.sm }}>
          Purpose
        </Text>
        <Text variant="body" color="secondary">
          {activation.purpose}
        </Text>
      </Card>

      {/* Biblical foundation */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.sm }}>
          Biblical Foundation
        </Text>
        <Text variant="body" color="secondary" style={{ marginBottom: spacing.md }}>
          {activation.teaching}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {activation.scriptures.map((s) => (
            <Badge key={s.reference} label={s.reference} tone="lavender" />
          ))}
        </View>
      </Card>

      {/* Preparation */}
      {activation.preparationSteps.length > 0 ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text variant="heading" style={{ marginBottom: spacing.sm }}>
            Preparation
          </Text>
          {activation.preparationSteps.map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
              <Ionicons name="ellipse" size={5} color={colors.accentGold} style={{ marginTop: 8 }} />
              <Text variant="bodySmall" color="secondary" style={{ flex: 1 }}>
                {step}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

      {/* Timer toggle */}
      <TouchableOpacity onPress={() => setShowTimer((v) => !v)} style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Ionicons name="timer-outline" size={18} color={colors.accentGold} />
          <Text variant="bodySmall" color="gold">
            {showTimer ? 'Hide timer' : 'Show optional timer'}
          </Text>
        </View>
      </TouchableOpacity>
      {showTimer ? <Timer suggestedMinutes={activation.estimatedMinutes} /> : null}

      {/* Steps */}
      <View style={{ marginBottom: spacing.lg }}>
        <SectionHeader title="Step by Step" />
        {activation.activationSteps.map((step, i) => (
          <Card key={step.id} style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <IconCircle size={32}>
                <Text variant="bodySmall" color="gold" style={{ fontWeight: '700' }}>
                  {i + 1}
                </Text>
              </IconCircle>
              <View style={{ flex: 1 }}>
                <Text variant="body">{step.instruction}</Text>
                {step.durationSeconds ? (
                  <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
                    ~{Math.round(step.durationSeconds / 60) || 1} min
                  </Text>
                ) : null}
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Journal response fields */}
      <View style={{ marginBottom: spacing.lg }}>
        <SectionHeader title="Your Response" subtitle="Record whatever you noticed, however small" />
        {activation.journalPrompts.map((prompt) => (
          <Card key={prompt} style={{ marginBottom: spacing.md }}>
            <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
              {prompt}
            </Text>
            <TextInput
              multiline
              value={progress.journalResponses[prompt] ?? ''}
              onChangeText={(text) => saveJournalResponse(activation.id, prompt, text)}
              placeholder="Write here…"
              placeholderTextColor={colors.textMuted}
              style={{
                minHeight: 80,
                textAlignVertical: 'top',
                color: colors.textPrimary,
                fontSize: 15,
                lineHeight: 22,
              }}
            />
          </Card>
        ))}
      </View>

      {/* Discernment checklist */}
      <View style={{ marginBottom: spacing.lg }}>
        <DiscernmentChecklist
          answers={progress.discernmentChecklist}
          onChange={(key, value) => setDiscernmentAnswer(activation.id, key, value)}
        />
      </View>

      {/* Reflection questions */}
      {activation.reflectionQuestions.length > 0 ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text variant="heading" style={{ marginBottom: spacing.sm }}>
            Reflection
          </Text>
          {activation.reflectionQuestions.map((q, i) => (
            <Text key={i} variant="bodySmall" color="secondary" style={{ marginBottom: spacing.xs }}>
              • {q}
            </Text>
          ))}
        </Card>
      ) : null}

      {activation.safetyNotes.length > 0 ? (
        <Card style={{ marginBottom: spacing.lg, borderColor: colors.caution }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Ionicons name="information-circle-outline" size={18} color={colors.caution} />
            <View style={{ flex: 1 }}>
              {activation.safetyNotes.map((note, i) => (
                <Text key={i} variant="bodySmall" color="secondary" style={{ marginBottom: 4 }}>
                  {note}
                </Text>
              ))}
            </View>
          </View>
        </Card>
      ) : null}

      <Card style={{ marginBottom: spacing.xl }}>
        <Text variant="bodySmall" color="muted" style={{ fontStyle: 'italic' }}>
          {RELATIONAL_FOUNDATION_NOTE}
        </Text>
      </Card>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl }}>
        <Button label={saved ? 'Saved' : 'Save Progress'} variant="secondary" onPress={handleSave} style={{ flex: 1 }} fullWidth />
        <Button
          label={progress.completionStatus === 'completed' ? 'Completed' : 'Mark Complete'}
          onPress={handleComplete}
          disabled={progress.completionStatus === 'completed'}
          style={{ flex: 1 }}
          fullWidth
        />
      </View>

      {/* Related */}
      {related.length > 0 ? (
        <View style={{ marginBottom: spacing.xxxl }}>
          <SectionHeader title="Related Activations" />
          {related.map((r) => (
            <Card key={r.id} style={{ marginBottom: spacing.md }} onPress={() => navigation.push('ActivationDetail', { activationId: r.id })}>
              <Text variant="subheading">{r.title}</Text>
              <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                {CATEGORY_LABELS[r.category]} · {LEVEL_LABELS[r.level]}
              </Text>
            </Card>
          ))}
        </View>
      ) : null}
    </Screen>
  );
};
