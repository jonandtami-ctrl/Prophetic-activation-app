import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Activations: undefined;
  Journal: undefined;
  Dreams: undefined;
  DiscernmentMap: undefined;
  Growth: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  ActivationDetail: { activationId: string };
  JournalEntry: { entryId?: string; presetType?: string };
  DreamEntry: { dreamId?: string };
  NodeDetail: { nodeId: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
