import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { TabParamList } from './types';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { ActivationsListScreen } from '../screens/Activations/ActivationsListScreen';
import { JournalListScreen } from '../screens/Journal/JournalListScreen';
import { DreamsListScreen } from '../screens/Dreams/DreamsListScreen';
import { DiscernmentMapScreen } from '../screens/DiscernmentMap/DiscernmentMapScreen';
import { GrowthScreen } from '../screens/Growth/GrowthScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Activations: 'flash',
  Journal: 'book',
  Dreams: 'moon',
  DiscernmentMap: 'git-network',
  Growth: 'trending-up',
  Profile: 'person-circle',
};

// Shortened for the tab bar only — screen headers still use the full name.
// "Activations" doesn't fit one line at this width across 7 tabs without
// truncating to "Activa…", so the tab bar uses "Activate" instead.
const LABELS: Record<keyof TabParamList, string> = {
  Home: 'Home',
  Activations: 'Activate',
  Journal: 'Journal',
  Dreams: 'Dreams',
  DiscernmentMap: 'Map',
  Growth: 'Growth',
  Profile: 'Profile',
};

export const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () =>
          colors.mode === 'dark' ? (
            <BlurView intensity={40} tint="dark" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(11,15,46,0.55)' }]} />
          ) : (
            <BlurView intensity={60} tint="light" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.75)' }]} />
          ),
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={ICONS[route.name as keyof TabParamList]} size={focused ? size + 1 : size} color={color} />
        ),
        tabBarLabel: LABELS[route.name as keyof TabParamList],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activations" component={ActivationsListScreen} />
      <Tab.Screen name="Journal" component={JournalListScreen} />
      <Tab.Screen name="Dreams" component={DreamsListScreen} />
      <Tab.Screen name="DiscernmentMap" component={DiscernmentMapScreen} />
      <Tab.Screen name="Growth" component={GrowthScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
