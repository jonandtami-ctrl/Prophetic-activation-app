import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  } catch {
    // Platform without a biometric module (e.g. web) — treat as unavailable
    // rather than throwing, so callers can fall back gracefully.
    return false;
  }
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Prophetic Journal',
      fallbackLabel: 'Use passcode',
    });
    return result.success;
  } catch {
    return false;
  }
}
