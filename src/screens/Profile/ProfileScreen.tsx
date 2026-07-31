import React, { useState } from 'react';
import { Alert, Switch, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Button, FormField, Divider, IconCircle } from '../../components/ui';
import { PillSelect } from '../../components/shared';
import { useUserStore } from '../../store/useUserStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useDreamStore } from '../../store/useDreamStore';
import { useActivationStore } from '../../store/useActivationStore';
import { useDiscernmentStore } from '../../store/useDiscernmentStore';
import { isCloudSyncConfigured, supabase } from '../../lib/supabase';
import { isBiometricAvailable, authenticateWithBiometrics } from '../../lib/biometrics';
import { shareDataExport, deleteAllLocalData } from '../../lib/dataExport';
import { AI_BOUNDARY_NOTE } from '../../constants/disclaimers';

export const ProfileScreen: React.FC = () => {
  const { colors, spacing, preference, setPreference } = useTheme();
  const displayName = useUserStore((s) => s.displayName);
  const email = useUserStore((s) => s.email);
  const isSignedIn = useUserStore((s) => s.isSignedIn);
  const biometricLockEnabled = useUserStore((s) => s.biometricLockEnabled);
  const aiProcessingConsent = useUserStore((s) => s.aiProcessingConsent);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const setEmail = useUserStore((s) => s.setEmail);
  const setSignedIn = useUserStore((s) => s.setSignedIn);
  const setBiometricLockEnabled = useUserStore((s) => s.setBiometricLockEnabled);
  const setAiProcessingConsent = useUserStore((s) => s.setAiProcessingConsent);
  const signOutUser = useUserStore((s) => s.signOut);

  const clearJournal = useJournalStore((s) => s.clearAll);
  const clearDreams = useDreamStore((s) => s.clearAll);
  const clearActivations = useActivationStore((s) => s.clearAll);
  const clearDiscernment = useDiscernmentStore((s) => s.clearAll);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [authLoading, setAuthLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleAuth = async () => {
    if (!supabase) return;
    setAuthLoading(true);
    try {
      const fn = authMode === 'sign-in' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
      const { error } = await fn({ email: authEmail, password: authPassword });
      if (error) {
        Alert.alert('Could not sign in', error.message);
      } else {
        setSignedIn(true);
        setEmail(authEmail);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    signOutUser();
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const available = await isBiometricAvailable();
      if (!available) {
        Alert.alert('Biometric lock unavailable', 'No Face ID / fingerprint is set up on this device.');
        return;
      }
      const success = await authenticateWithBiometrics();
      if (!success) return;
    }
    setBiometricLockEnabled(value);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await shareDataExport();
    } catch {
      Alert.alert('Export failed', 'Something went wrong while preparing your export.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete everything?',
      'This permanently deletes your journal, dreams, activation progress, and discernment map from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAllLocalData();
            clearJournal();
            clearDreams();
            clearActivations();
            clearDiscernment();
            await supabase?.auth.signOut();
            signOutUser();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        <Text variant="display" style={{ marginBottom: 4 }}>
          Profile
        </Text>
        <Text variant="bodySmall" color="secondary">
          Your account, privacy, and preferences
        </Text>
      </View>

      {/* Account */}
      <Card style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
          <IconCircle size={48}>
            <Ionicons name="person" size={22} color={colors.accentGold} />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <FormField label="Display Name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
          </View>
        </View>

        {!isCloudSyncConfigured ? (
          <Text variant="bodySmall" color="muted">
            Cloud sync is not configured for this build — your data stays private on this device. See .env.example to enable secure accounts and
            cross-device sync.
          </Text>
        ) : isSignedIn ? (
          <View>
            <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
              Signed in as {email}
            </Text>
            <Button label="Sign Out" variant="secondary" onPress={handleSignOut} />
          </View>
        ) : (
          <View>
            <PillSelect
              value={authMode}
              onChange={setAuthMode}
              options={[
                { value: 'sign-in', label: 'Sign In' },
                { value: 'sign-up', label: 'Create Account' },
              ]}
              scrollable={false}
            />
            <FormField label="Email" value={authEmail} onChangeText={setAuthEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
            <FormField label="Password" value={authPassword} onChangeText={setAuthPassword} secureTextEntry placeholder="••••••••" />
            <Button label={authMode === 'sign-in' ? 'Sign In' : 'Create Account'} onPress={handleAuth} loading={authLoading} fullWidth />
          </View>
        )}
      </Card>

      {/* Privacy & security */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.md }}>
          Privacy & Security
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{ flex: 1, marginRight: spacing.md }}>
            <Text variant="subheading">Biometric Lock</Text>
            <Text variant="caption" color="muted">
              Require Face ID / fingerprint to open the app
            </Text>
          </View>
          <Switch value={biometricLockEnabled} onValueChange={handleBiometricToggle} trackColor={{ true: colors.accentGold }} />
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text variant="subheading">AI Processing Consent</Text>
              <Text variant="caption" color="muted">
                Allow on-device organizing of themes and reflection prompts
              </Text>
            </View>
            <Switch value={aiProcessingConsent === true} onValueChange={setAiProcessingConsent} trackColor={{ true: colors.accentGold }} />
          </View>
          <Text variant="caption" color="muted">
            {AI_BOUNDARY_NOTE}
          </Text>
        </View>

        <Divider spacingY={spacing.md} />

        <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.xs }}>
          • Your journal and dreams are private by default and never shared without your explicit action.
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.xs }}>
          • Your personal data is never sold.
        </Text>
        <Text variant="bodySmall" color="secondary">
          • Cloud rows are protected by row-level security scoped to your account alone.
        </Text>
      </Card>

      {/* Appearance */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="heading" style={{ marginBottom: spacing.md }}>
          Appearance
        </Text>
        <PillSelect
          value={preference}
          onChange={setPreference}
          scrollable={false}
          options={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </Card>

      {/* Data */}
      <Card style={{ marginBottom: spacing.xxxl }}>
        <Text variant="heading" style={{ marginBottom: spacing.md }}>
          Your Data
        </Text>
        <Button label="Export My Data" variant="secondary" onPress={handleExport} loading={exporting} fullWidth style={{ marginBottom: spacing.md }} />
        <Button label="Delete Everything" variant="danger" onPress={handleDeleteAccount} fullWidth />
      </Card>
    </Screen>
  );
};
