import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface FormFieldProps extends TextInputProps {
  label: string;
  helper?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, helper, required, style, ...rest }) => {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text variant="subheading" style={{ marginBottom: spacing.xs }}>
        {label}
        {required ? ' *' : ''}
      </Text>
      {helper ? (
        <Text variant="caption" color="muted" style={{ marginBottom: spacing.sm }}>
          {helper}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
            padding: spacing.md,
            color: colors.textPrimary,
            fontSize: 16,
            backgroundColor: colors.mode === 'dark' ? 'rgba(255,255,255,0.04)' : colors.surfaceAlt,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
};
