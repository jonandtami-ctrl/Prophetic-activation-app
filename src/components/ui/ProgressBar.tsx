import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

export const ProgressBar: React.FC<{ progress: number; height?: number }> = ({ progress, height = 8 }) => {
  const { colors, radius } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={{ height, borderRadius: radius.pill, backgroundColor: colors.divider, overflow: 'hidden' }}>
      <LinearGradient
        colors={[colors.accentLavender, colors.accentGold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${clamped * 100}%`, height: '100%', borderRadius: radius.pill }}
      />
    </View>
  );
};
