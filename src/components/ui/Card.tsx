import React from 'react';
import { StyleProp, View, ViewStyle, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, padded = true, elevated = true }) => {
  const { colors, radius, spacing } = useTheme();

  const content = (
    <View
      style={[
        {
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          overflow: 'hidden',
          backgroundColor: colors.mode === 'light' ? colors.card : 'transparent',
        },
        elevated && colors.mode === 'light'
          ? { shadowColor: colors.shadow, shadowOpacity: 1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }
          : null,
        style,
      ]}
    >
      {colors.mode === 'dark' ? (
        <BlurView intensity={28} tint="dark" style={{ padding: padded ? spacing.lg : 0, backgroundColor: colors.card }}>
          {children}
        </BlurView>
      ) : (
        <View style={{ padding: padded ? spacing.lg : 0 }}>{children}</View>
      )}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
};
