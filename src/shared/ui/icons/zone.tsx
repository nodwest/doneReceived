import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export const ZoneIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Circle
      cx={12}
      cy={12}
      r={8.5}
      stroke={color}
      strokeWidth={2}
      strokeDasharray="4 3"
      strokeLinecap="round"
    />
  </Svg>
);
