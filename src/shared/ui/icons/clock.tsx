import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export const ClockIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <Circle cx={8} cy={8} r={5.6} stroke={color} strokeWidth={1.8} />
    <Path
      d="M8 4.8V8L10.4 9.6"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
