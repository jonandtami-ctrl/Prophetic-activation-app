import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { ActivationDetailScreen } from '../screens/Activations/ActivationDetailScreen';
import { JournalEntryScreen } from '../screens/Journal/JournalEntryScreen';
import { DreamEntryScreen } from '../screens/Dreams/DreamEntryScreen';
import { NodeDetailScreen } from '../screens/DiscernmentMap/NodeDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ActivationDetail" component={ActivationDetailScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="DreamEntry" component={DreamEntryScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="NodeDetail" component={NodeDetailScreen} options={{ presentation: 'card' }} />
    </Stack.Navigator>
  );
};
