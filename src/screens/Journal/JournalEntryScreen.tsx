import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Button, Badge, FormField, TagInput, Divider } from '../../components/ui';
import { PillSelect, DiscernmentChecklist, HighCautionWarning, ShareLanguageHelper, PhotoPicker, VoiceRecorder, DateField } from '../../components/shared';
import { RootStackParamList } from '../../navigation/types';
import { useAppNavigation } from '../../navigation/hooks';
import { useJournalStore } from '../../store/useJournalStore';
import { useDiscernmentStore } from '../../store/useDiscernmentStore';
import { ENTRY_TYPE_LABELS, ENTRY_TYPE_ORDER, STATUS_LABELS } from '../../constants/taxonomy';
import { JournalEntryType, FulfillmentStatus } from '../../types/models';
import { detectHighCautionTopics } from '../../lib/highCaution';
import { suggestScriptures } from '../../lib/reflectionAssistant';

type Props = NativeStackScreenProps<RootStackParamList, 'JournalEntry'>;

const SHARE_HELPER_TYPES: JournalEntryType[] = ['prophetic-word', 'word-of-knowledge', 'picture-vision'];

export const JournalEntryScreen: React.FC<Props> = ({ route }) => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const updateEntry = useJournalStore((s) => s.updateEntry);
  const removeEntry = useJournalStore((s) => s.removeEntry);
  const upsertNode = useDiscernmentStore((s) => s.upsertNode);
  const connect = useDiscernmentStore((s) => s.connect);

  const existing = route.params.entryId ? entries.find((e) => e.id === route.params.entryId) : undefined;

  const [entryType, setEntryType] = useState<JournalEntryType>(existing?.entryType ?? (route.params.presetType as JournalEntryType) ?? 'general');
  const [title, setTitle] = useState(existing?.title ?? '');
  const [entryDate, setEntryDate] = useState(existing?.entryDate);
  const [questionAsked, setQuestionAsked] = useState(existing?.questionAsked ?? '');
  const [whatISensed, setWhatISensed] = useState(existing?.whatISensed ?? '');
  const [howItCame, setHowItCame] = useState(existing?.howItCame ?? '');
  const [scripture, setScripture] = useState(existing?.scripture ?? '');
  const [possibleInterpretation, setPossibleInterpretation] = useState(existing?.possibleInterpretation ?? '');
  const [emotionalState, setEmotionalState] = useState(existing?.emotionalState ?? '');
  const [personalAssumptionsOrBias, setPersonalAssumptionsOrBias] = useState(existing?.personalAssumptionsOrBias ?? '');
  const [confirmation, setConfirmation] = useState(existing?.confirmation ?? '');
  const [actionOrResponse, setActionOrResponse] = useState(existing?.actionOrResponse ?? '');
  const [outcome, setOutcome] = useState(existing?.outcome ?? '');
  const [people, setPeople] = useState<string[]>(existing?.people ?? []);
  const [places, setPlaces] = useState<string[]>(existing?.places ?? []);
  const [themes, setThemes] = useState<string[]>(existing?.themes ?? []);
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [photoUris, setPhotoUris] = useState<string[]>(existing?.photoUris ?? []);
  const [voiceRecordingUri, setVoiceRecordingUri] = useState<string | undefined>(existing?.voiceRecordingUri);
  const [followUpDate, setFollowUpDate] = useState<string | undefined>(existing?.followUpDate);
  const [status, setStatus] = useState<FulfillmentStatus>(existing?.status ?? 'unconfirmed');
  const [discernment, setDiscernment] = useState(existing?.discernment ?? {});

  const [showWarning, setShowWarning] = useState(false);
  const [pendingTopics, setPendingTopics] = useState<string[]>([]);
  const [acknowledged, setAcknowledged] = useState(!!existing?.isHighCaution);
  const [saved, setSaved] = useState(false);

  const combinedText = `${title} ${questionAsked} ${whatISensed} ${possibleInterpretation} ${actionOrResponse}`;
  const suggestions = useMemo(() => suggestScriptures(combinedText), [combinedText]);

  const buildPayload = () => ({
    entryType,
    title,
    entryDate: entryDate ?? new Date().toISOString(),
    questionAsked: questionAsked || undefined,
    whatISensed: whatISensed || undefined,
    howItCame: howItCame || undefined,
    scripture: scripture || undefined,
    possibleInterpretation: possibleInterpretation || undefined,
    emotionalState: emotionalState || undefined,
    personalAssumptionsOrBias: personalAssumptionsOrBias || undefined,
    confirmation: confirmation || undefined,
    actionOrResponse: actionOrResponse || undefined,
    outcome: outcome || undefined,
    people,
    places,
    themes,
    tags,
    photoUris,
    voiceRecordingUri,
    followUpDate,
    status,
    discernment,
  });

  const persist = () => {
    const payload = buildPayload();
    const topics = detectHighCautionTopics(combinedText);
    const finalPayload = { ...payload, isHighCaution: topics.length > 0, highCautionTopics: topics };

    let savedId = existing?.id;
    if (existing) {
      updateEntry(existing.id, finalPayload);
    } else {
      const created = addEntry(finalPayload);
      savedId = created.id;
    }

    const entryNode = upsertNode('journal-entry', title || ENTRY_TYPE_LABELS[entryType], savedId);
    people.forEach((p) => connect(entryNode.id, upsertNode('person', p).id));
    themes.forEach((t) => connect(entryNode.id, upsertNode('theme', t).id));
    if (scripture) connect(entryNode.id, upsertNode('scripture', scripture).id);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigation.goBack();
    }, 500);
  };

  const handleSave = () => {
    const topics = detectHighCautionTopics(combinedText);
    if (topics.length > 0 && !acknowledged) {
      setPendingTopics(topics);
      setShowWarning(true);
      return;
    }
    persist();
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="heading">{existing ? 'Edit Entry' : 'New Entry'}</Text>
        {existing ? (
          <TouchableOpacity
            onPress={() => {
              removeEntry(existing.id);
              navigation.goBack();
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}
      </View>

      <PillSelect
        label="Entry Type"
        value={entryType}
        onChange={setEntryType}
        options={ENTRY_TYPE_ORDER.map((t) => ({ value: t, label: ENTRY_TYPE_LABELS[t] }))}
      />

      <FormField label="Title" value={title} onChangeText={setTitle} placeholder="Give this entry a name" />

      <DateField label="Date" value={entryDate} onChange={setEntryDate} />

      <FormField label="Question I Asked" value={questionAsked} onChangeText={setQuestionAsked} placeholder="What did you ask God?" multiline />
      <FormField label="What I Sensed" value={whatISensed} onChangeText={setWhatISensed} placeholder="Describe what you sensed, saw, or heard" multiline style={{ minHeight: 100 }} />
      <FormField label="How It Came" value={howItCame} onChangeText={setHowItCame} placeholder="A thought, picture, feeling, verse, dream…" />
      <FormField label="Scripture" value={scripture} onChangeText={setScripture} placeholder="Any related Scripture reference" />

      {suggestions.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <Text variant="caption" color="muted" style={{ marginBottom: spacing.sm }}>
            POSSIBLY RELATED SCRIPTURE (tap to add)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map((s) => (
              <TouchableOpacity key={s.reference} onPress={() => setScripture((prev) => (prev ? `${prev}; ${s.reference}` : s.reference))}>
                <Badge label={s.reference} tone="gold" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      <FormField label="Possible Interpretation" value={possibleInterpretation} onChangeText={setPossibleInterpretation} placeholder="Held loosely — what might this mean?" multiline />
      <FormField label="Emotional State" value={emotionalState} onChangeText={setEmotionalState} placeholder="How were you feeling at the time?" />
      <FormField label="Personal Assumptions or Bias" value={personalAssumptionsOrBias} onChangeText={setPersonalAssumptionsOrBias} placeholder="What might be shaping how you read this?" multiline />
      <FormField label="Confirmation" value={confirmation} onChangeText={setConfirmation} placeholder="Any confirmation received?" multiline />
      <FormField label="Action or Response" value={actionOrResponse} onChangeText={setActionOrResponse} placeholder="What did you do in response?" />
      <FormField label="Outcome" value={outcome} onChangeText={setOutcome} placeholder="What happened, if anything?" />

      <TagInput label="People" values={people} onChange={setPeople} placeholder="Add a name…" />
      <TagInput label="Places" values={places} onChange={setPlaces} placeholder="Add a place…" />
      <TagInput label="Themes" values={themes} onChange={setThemes} placeholder="Add a theme…" />
      <TagInput label="Tags" values={tags} onChange={setTags} placeholder="Add a tag…" />

      <PhotoPicker label="Photos" uris={photoUris} onChange={setPhotoUris} />
      <VoiceRecorder label="Voice Recording" uri={voiceRecordingUri} onChange={setVoiceRecordingUri} />
      <DateField label="Follow-up Date" value={followUpDate} onChange={setFollowUpDate} allowClear />

      <PillSelect
        label="Status"
        value={status}
        onChange={setStatus}
        options={(Object.keys(STATUS_LABELS) as FulfillmentStatus[]).map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
      />

      <View style={{ marginBottom: spacing.lg }}>
        <DiscernmentChecklist answers={discernment} onChange={(key, value) => setDiscernment((prev) => ({ ...prev, [key]: value }))} />
      </View>

      {SHARE_HELPER_TYPES.includes(entryType) ? (
        <View style={{ marginBottom: spacing.lg }}>
          <ShareLanguageHelper />
        </View>
      ) : null}

      <Divider />

      <Button label={saved ? 'Saved' : existing ? 'Update Entry' : 'Save Entry'} onPress={handleSave} fullWidth size="lg" />
      <View style={{ height: spacing.xxxl }} />

      <HighCautionWarning
        visible={showWarning}
        topics={pendingTopics}
        onAcknowledge={() => {
          setAcknowledged(true);
          setShowWarning(false);
          persist();
        }}
        onCancel={() => setShowWarning(false)}
      />
    </Screen>
  );
};
