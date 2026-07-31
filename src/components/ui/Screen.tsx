import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Starfield } from './Starfield';

interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  showStars?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = true,
  padded = true,
  style,
  showStars = true,
  contentContainerStyle,
  ...rest
}) => {
  const { colors, spacing } = useTheme();

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[
        { paddingHorizontal: padded ? spacing.lg : 0, paddingBottom: spacing.xxxl * 2 },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, paddingHorizontal: padded ? spacing.lg : 0 }, style]}>{children}</View>
  );

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.fill}>
      {showStars && colors.mode === 'dark' && <Starfield />}
      <SafeAreaView style={styles.fill} edges={['top']}>
        {content}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
