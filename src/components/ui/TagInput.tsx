import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ label, values, onChange, placeholder }) => {
  const { colors, radius, spacing } = useTheme();
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft('');
  };

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm }}>
        {values.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => onChange(values.filter((v) => v !== tag))}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.accentLavenderSoft,
              borderRadius: radius.pill,
              paddingVertical: 6,
              paddingHorizontal: 12,
              gap: 6,
            }}
          >
            <Text variant="bodySmall" color="lavender">
              {tag}
            </Text>
            <Ionicons name="close" size={13} color={colors.accentLavender} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addTag}
          placeholder={placeholder ?? 'Add and press enter…'}
          placeholderTextColor={colors.textMuted}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
            padding: spacing.md,
            color: colors.textPrimary,
            backgroundColor: colors.mode === 'dark' ? 'rgba(255,255,255,0.04)' : colors.surfaceAlt,
          }}
        />
        <TouchableOpacity
          onPress={addTag}
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.md,
            backgroundColor: colors.accentGoldSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={20} color={colors.accentGold} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
