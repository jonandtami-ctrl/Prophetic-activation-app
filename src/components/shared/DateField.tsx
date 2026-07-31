import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';
import { formatFriendlyDate } from '../../lib/dates';

interface DateFieldProps {
  label: string;
  value?: string;
  onChange: (iso: string | undefined) => void;
  allowClear?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, allowClear }) => {
  const { colors, radius, spacing } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
            padding: spacing.md,
            backgroundColor: colors.mode === 'dark' ? 'rgba(255,255,255,0.04)' : colors.surfaceAlt,
          }}
        >
          <Ionicons name="calendar-outline" size={16} color={colors.accentGold} />
          <Text variant="body">{value ? formatFriendlyDate(value) : 'Select a date'}</Text>
        </TouchableOpacity>
        {allowClear && value ? (
          <TouchableOpacity onPress={() => onChange(undefined)} style={{ justifyContent: 'center' }}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {showPicker ? (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowPicker(Platform.OS === 'ios');
            if (event.type !== 'dismissed' && date) onChange(date.toISOString());
          }}
        />
      ) : null}
    </View>
  );
};
