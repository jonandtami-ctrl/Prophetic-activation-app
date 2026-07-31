import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { IconCircle } from '../ui/IconCircle';

interface TimerProps {
  suggestedMinutes: number;
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const Timer: React.FC<TimerProps> = ({ suggestedMinutes }) => {
  const { colors, spacing } = useTheme();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  return (
    <Card style={{ marginBottom: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text variant="caption" color="muted">
            OPTIONAL TIMER · SUGGESTED {suggestedMinutes} MIN
          </Text>
          <Text variant="display" style={{ marginTop: 4 }}>
            {formatSeconds(seconds)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TouchableOpacity onPress={reset}>
            <IconCircle size={40} tone="lavender">
              <Ionicons name="refresh" size={18} color={colors.accentLavender} />
            </IconCircle>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRunning((r) => !r)}>
            <IconCircle size={40}>
              <Ionicons name={running ? 'pause' : 'play'} size={18} color={colors.accentGold} />
            </IconCircle>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};
