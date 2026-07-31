import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';

interface IconCircleProps {
  children: React.ReactNode;
  size?: number;
  tone?: 'gold' | 'lavender';
}

export const IconCircle: React.FC<IconCircleProps> = ({ children, size = 44, tone = 'gold' }) => {
  const { colors } = useTheme();
  const bg = tone === 'gold' ? colors.accentGoldSoft : colors.accentLavenderSoft;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
};
