import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/** Golden quill motif — used as the app's small brand mark and in empty states. */
export const QuillIcon: React.FC<IconProps> = ({ size = 28, color = '#D4AF6A' }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      d="M40 8C28 10 16 18 10 32L6 42L16 38C30 32 38 20 40 8Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Line x1="10" y1="32" x2="24" y2="18" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M6 42L11 37" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

/** Open-book motif — used on Journal / Dreams headers. */
export const OpenBookIcon: React.FC<IconProps> = ({ size = 28, color = '#D4AF6A' }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      d="M24 12C20 9 12 8 6 9V36C12 35 20 36 24 39C28 36 36 35 42 36V9C36 8 28 9 24 12Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Line x1="24" y1="12" x2="24" y2="39" stroke={color} strokeWidth={1.2} />
  </Svg>
);
