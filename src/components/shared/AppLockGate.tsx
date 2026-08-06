import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen } from '../ui/Screen';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { IconCircle } from '../ui/IconCircle';
import { useUserStore } from '../../store/useUserStore';
import { authenticateWithBiometrics } from '../../lib/biometrics';

/**
 * Actually enforces the "Biometric Lock" preference set in Profile — without
 * this, the toggle only saved a value and never gated access. Locks on cold
 * launch and every time the app returns from the background, since that's
 * the moment someone else could pick up an unlocked phone.
 */
export const AppLockGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors, spacing } = useTheme();
  const biometricLockEnabled = useUserStore((s) => s.biometricLockEnabled);
  const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated());
  const [unlocked, setUnlocked] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useUserStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  const attemptUnlock = async () => {
    setAuthenticating(true);
    const success = await authenticateWithBiometrics();
    setAuthenticating(false);
    if (success) setUnlocked(true);
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!biometricLockEnabled) {
      setUnlocked(true);
      return;
    }
    setUnlocked(false);
    attemptUnlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, biometricLockEnabled]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active' && biometricLockEnabled) {
        setUnlocked(false);
        attemptUnlock();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricLockEnabled]);

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (biometricLockEnabled && !unlocked) {
    return (
      <Screen showStars={false} scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <IconCircle size={72}>
            <Ionicons name="lock-closed" size={30} color={colors.accentGold} />
          </IconCircle>
          <Text variant="title" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
            Prophetic Journal is locked
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: spacing.sm, textAlign: 'center', marginBottom: spacing.xl }}>
            Your journal and dreams are private. Unlock with Face ID or your device passcode to continue.
          </Text>
          <Button label={authenticating ? 'Unlocking…' : 'Unlock'} onPress={attemptUnlock} loading={authenticating} />
        </View>
      </Screen>
    );
  }

  return <>{children}</>;
};
