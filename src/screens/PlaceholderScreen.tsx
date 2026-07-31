import React from 'react';
import { Screen } from '../components/ui/Screen';
import { Text } from '../components/ui/Text';
import { EmptyState } from '../components/ui/EmptyState';

export const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
  <Screen>
    <EmptyState title={title} message="This part of Prophetic Journal is still being built." />
  </Screen>
);
