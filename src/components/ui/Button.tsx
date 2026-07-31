import React from 'react';
import { ActivityIndicator, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg' | 'sm';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  style,
  fullWidth,
}) => {
  const { colors, radius } = useTheme();
  const paddingVertical = size === 'lg' ? 16 : size === 'sm' ? 8 : 13;
  const paddingHorizontal = size === 'lg' ? 28 : size === 'sm' ? 14 : 22;

  const baseStyle: ViewStyle = {
    borderRadius: radius.pill,
    paddingVertical,
    paddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: disabled ? 0.5 : 1,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  const textColor = variant === 'primary' ? colors.textInverse : variant === 'danger' ? colors.textInverse : colors.textPrimary;

  const inner = (
    <>
      {loading ? <ActivityIndicator color={textColor} /> : icon}
      <Text variant="button" style={{ color: textColor }}>
        {label}
      </Text>
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} style={[{ alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}>
        <LinearGradient colors={[colors.accentGold, '#C99A4A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={baseStyle}>
          {inner}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onPress}
        style={[baseStyle, { backgroundColor: colors.danger }, style]}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onPress}
        style={[baseStyle, { backgroundColor: colors.accentLavenderSoft, borderWidth: 1, borderColor: colors.cardBorder }, style]}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[baseStyle, { backgroundColor: 'transparent' }, style]}
    >
      {inner}
    </TouchableOpacity>
  );
};
