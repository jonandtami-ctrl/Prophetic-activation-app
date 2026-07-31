import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';
import { IconCircle } from '../ui/IconCircle';

interface VoiceRecorderProps {
  label: string;
  uri?: string;
  onChange: (uri: string | undefined) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ label, uri, onChange }) => {
  const { colors, spacing } = useTheme();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(rec);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const savedUri = recording.getURI();
    setRecording(null);
    if (savedUri) onChange(savedUri);
  };

  const playRecording = async () => {
    if (!uri) return;
    const { sound: playbackSound } = await Audio.Sound.createAsync({ uri });
    setSound(playbackSound);
    setIsPlaying(true);
    playbackSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) setIsPlaying(false);
    });
    await playbackSound.playAsync();
  };

  React.useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
          <IconCircle size={48} tone={isRecording ? 'lavender' : 'gold'}>
            <Ionicons name={isRecording ? 'stop' : 'mic-outline'} size={22} color={isRecording ? colors.accentLavender : colors.accentGold} />
          </IconCircle>
        </TouchableOpacity>
        {uri ? (
          <>
            <TouchableOpacity onPress={playRecording} disabled={isPlaying}>
              <IconCircle size={48} tone="lavender">
                <Ionicons name={isPlaying ? 'volume-high' : 'play'} size={20} color={colors.accentLavender} />
              </IconCircle>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChange(undefined)}>
              <Text variant="bodySmall" color="danger">
                Remove
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text variant="bodySmall" color="muted">
            {isRecording ? 'Recording…' : 'Tap to record a voice note'}
          </Text>
        )}
      </View>
    </View>
  );
};
