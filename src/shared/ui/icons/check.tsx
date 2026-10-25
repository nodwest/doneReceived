import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CheckIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <Path
      d="M3.5 8.5L6.5 11.5L12.5 4.5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
