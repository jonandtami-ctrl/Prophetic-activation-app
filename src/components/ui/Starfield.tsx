import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface StarfieldProps {
  count?: number;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export const Starfield: React.FC<StarfieldProps> = ({ count = 48 }) => {
  const stars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      cx: rand() * 100,
      cy: rand() * 100,
      r: 0.3 + rand() * 0.9,
      opacity: 0.15 + rand() * 0.55,
    }));
  }, [count]);

  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none" pointerEvents="none">
      {stars.map((s) => (
        <Circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="#E8C87E" opacity={s.opacity} />
      ))}
    </Svg>
  );
};
