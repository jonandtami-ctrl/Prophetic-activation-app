import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Button, Badge, FormField, TagInput, Divider } from '../../components/ui';
import { PillSelect, DiscernmentChecklist, DateField } from '../../components/shared';
import { RootStackParamList } from '../../navigation/types';
import { useAppNavigation } from '../../navigation/hooks';
import { useDreamStore } from '../../store/useDreamStore';
import { useDiscernmentStore } from '../../store/useDiscernmentStore';
import { STATUS_LABELS } from '../../constants/taxonomy';
import { FulfillmentStatus } from '../../types/models';
import { DREAM_DISCLAIMER } from '../../constants/disclaimers';
import { DREAM_REFLECTION_QUESTIONS, suggestScriptures } from '../../lib/reflectionAssistant';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamEntry'>;

export const DreamEntryScreen: React.FC<Props> = ({ route }) => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const dreams = useDreamStore((s) => s.dreams);
  const addDream = useDreamStore((s) => s.addDream);
  const updateDream = useDreamStore((s) => s.updateDream);
  const removeDream = useDreamStore((s) => s.removeDream);
  const upsertNode = useDiscernmentStore((s) => s.upsertNode);
  const connect = useDiscernmentStore((s) => s.connect);

  const existing = route.params.dreamId ? dreams.find((d) => d.id === route.params.dreamId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [dreamDate, setDreamDate] = useState(existing?.dreamDate);
  const [fullDream, setFullDream] = useState(existing?.fullDream ?? '');
  const [people, setPeople] = useState<string[]>(existing?.people ?? []);
  const [places, setPlaces] = useState<string[]>(existing?.places ?? []);
  const [objects, setObjects] = useState<string[]>(existing?.objects ?? []);
  const [colours, setColours] = useState<string[]>(existing?.colours ?? []);
  const [numbers, setNumbers] = useState<string[]>(existing?.numbers ?? []);
  const [actions, setActions] = useState<string[]>(existing?.actions ?? []);
  const [emotions, setEmotions] = useState<string[]>(existing?.emotions ?? []);
  const [atmosphere, setAtmosphere] = useState(existing?.atmosphere ?? '');
  const [repeatedDetails, setRepeatedDetails] = useState(existing?.repeatedDetails ?? '');
  const [personalAssociations, setPersonalAssociations] = useState(existing?.personalAssociations ?? '');
  const [currentLifeCircumstances, setCurrentLifeCircumstances] = useState(existing?.currentLifeCircumstances ?? '');
  const [possibleSymbols, setPossibleSymbols] = useState<string[]>(existing?.possibleSymbols ?? []);
  const [scriptures, setScriptures] = useState<string[]>(existing?.scriptures ?? []);
  const [prayerReflections, setPrayerReflections] = useState(existing?.prayerReflections ?? '');
  const [possibleMeaning, setPossibleMeaning] = useState(existing?.possibleMeaning ?? '');
  const [confirmation, setConfirmation] = useState(existing?.confirmation ?? '');
  const [outcome, setOutcome] = useState(existing?.outcome ?? '');
  const [status, setStatus] = useState<FulfillmentStatus>(existing?.status ?? 'unconfirmed');
  const [discernment, setDiscernment] = useState(existing?.discernment ?? {});
  const [saved, setSaved] = useState(false);

  const scriptureSuggestions = useMemo(() => suggestScriptures(`${fullDream} ${possibleSymbols.join(' ')}`), [fullDream, possibleSymbols]);

  const handleSave = () => {
    const payload = {
      title,
      dreamDate: dreamDate ?? new Date().toISOString(),
      fullDream,
      people,
      places,
      objects,
      colours,
      numbers,
      actions,
      emotions,
      atmosphere: atmosphere || undefined,
      repeatedDetails: repeatedDetails || undefined,
      personalAssociations: personalAssociations || undefined,
      currentLifeCircumstances: currentLifeCircumstances || undefined,
      possibleSymbols,
      scriptures,
      prayerReflections: prayerReflections || undefined,
      possibleMeaning: possibleMeaning || undefined,
      confirmation: confirmation || undefined,
      outcome: outcome || undefined,
      status,
      discernment,
    };

    let savedId = existing?.id;
    if (existing) {
      updateDream(existing.id, payload);
    } else {
      const created = addDream(payload);
      savedId = created.id;
    }

    const dreamNode = upsertNode('dream', title || 'Untitled dream', savedId);
    people.forEach((p) => connect(dreamNode.id, upsertNode('person', p).id));
    possibleSymbols.forEach((sym) => connect(dreamNode.id, upsertNode('symbol', sym).id));
    scriptures.forEach((s) => connect(dreamNode.id, upsertNode('scripture', s).id));

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigation.goBack();
    }, 500);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="heading">{existing ? 'Edit Dream' : 'New Dream'}</Text>
        {existing ? (
          <TouchableOpacity
            onPress={() => {
              removeDream(existing.id);
              navigation.goBack();
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}
      </View>

      <Card style={{ marginBottom: spacing.lg, borderColor: colors.accentLavender }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Ionicons name="moon-outline" size={18} color={colors.accentLavender} />
          <Text variant="bodySmall" color="secondary" style={{ flex: 1, fontStyle: 'italic' }}>
            {DREAM_DISCLAIMER}
          </Text>
        </View>
      </Card>

      <FormField label="Dream Title" value={title} onChangeText={setTitle} placeholder="Give this dream a name" />
      <DateField label="Date" value={dreamDate} onChange={setDreamDate} />
      <FormField
        label="Full Dream"
        value={fullDream}
        onChangeText={setFullDream}
        placeholder="Describe the dream in as much detail as you remember"
        multiline
        style={{ minHeight: 140 }}
      />

      <TagInput label="People" values={people} onChange={setPeople} />
      <TagInput label="Places" values={places} onChange={setPlaces} />
      <TagInput label="Objects" values={objects} onChange={setObjects} />
      <TagInput label="Colours" values={colours} onChange={setColours} />
      <TagInput label="Numbers" values={numbers} onChange={setNumbers} />
      <TagInput label="Actions" values={actions} onChange={setActions} />
      <TagInput label="Emotions" values={emotions} onChange={setEmotions} />

      <FormField label="Atmosphere" value={atmosphere} onChangeText={setAtmosphere} placeholder="What did the dream feel like overall?" />
      <FormField label="Repeated Details" value={repeatedDetails} onChangeText={setRepeatedDetails} placeholder="Anything that repeated, or that echoes other dreams?" />
      <FormField label="Personal Associations" value={personalAssociations} onChangeText={setPersonalAssociations} placeholder="What do these symbols mean to you personally?" multiline />
      <FormField label="Current Life Circumstances" value={currentLifeCircumstances} onChangeText={setCurrentLifeCircumstances} placeholder="What's going on in your life right now?" multiline />

      <TagInput label="Possible Symbols" values={possibleSymbols} onChange={setPossibleSymbols} />

      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.sm }}>
          Reflective Questions
        </Text>
        <Text variant="caption" color="muted" style={{ marginBottom: spacing.md }}>
          These are questions to pray through — not answers. Only you and the Holy Spirit know what this dream means, if anything.
        </Text>
        {DREAM_REFLECTION_QUESTIONS.map((q, i) => (
          <Text key={i} variant="bodySmall" color="secondary" style={{ marginBottom: spacing.xs }}>
            • {q}
          </Text>
        ))}
      </Card>

      <TagInput label="Relevant Scriptures" values={scriptures} onChange={setScriptures} placeholder="Add a reference…" />

      {scriptureSuggestions.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <Text variant="caption" color="muted" style={{ marginBottom: spacing.sm }}>
            POSSIBLY RELATED SCRIPTURE (tap to add)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {scriptureSuggestions.map((s) => (
              <TouchableOpacity key={s.reference} onPress={() => setScriptures((prev) => Array.from(new Set([...prev, s.reference])))}>
                <Badge label={s.reference} tone="gold" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      <FormField label="Prayer Reflections" value={prayerReflections} onChangeText={setPrayerReflections} placeholder="What did you sense as you prayed through this?" multiline />
      <FormField label="Possible Meaning" value={possibleMeaning} onChangeText={setPossibleMeaning} placeholder="Held loosely, and open to being wrong" multiline />
      <FormField label="Confirmation" value={confirmation} onChangeText={setConfirmation} placeholder="Any confirmation received?" />
      <FormField label="Outcome" value={outcome} onChangeText={setOutcome} placeholder="What happened, if anything?" />

      <PillSelect
        label="Status"
        value={status}
        onChange={setStatus}
        options={(Object.keys(STATUS_LABELS) as FulfillmentStatus[]).map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
      />

      <View style={{ marginBottom: spacing.lg }}>
        <DiscernmentChecklist answers={discernment} onChange={(key, value) => setDiscernment((prev) => ({ ...prev, [key]: value }))} />
      </View>

      <Divider />

      <Button label={saved ? 'Saved' : existing ? 'Update Dream' : 'Save Dream'} onPress={handleSave} fullWidth size="lg" />
      <View style={{ height: spacing.xxxl }} />
    </Screen>
  );
};
