import React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip } from '../ui/Chip';
import { Text } from '../ui/Text';
import { useTheme } from '../../theme';

interface PillSelectProps<T extends string> {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
}

export function PillSelect<T extends string>({ label, options, value, onChange, scrollable = true }: PillSelectProps<T>) {
  const { spacing } = useTheme();

  const content = (
    <View style={{ flexDirection: 'row', flexWrap: scrollable ? 'nowrap' : 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <Chip key={opt.value} label={opt.label} selected={opt.value === value} onPress={() => onChange(opt.value)} />
      ))}
    </View>
  );

  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label ? (
        <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
          {label}
        </Text>
      ) : null}
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}
