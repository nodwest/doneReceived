import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export const PhoneIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Rect
      x={5}
      y={2}
      width={10}
      height={16}
      rx={2.5}
      stroke={color}
      strokeWidth={1.6}
    />
    <Path d="M9 15H11" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);
