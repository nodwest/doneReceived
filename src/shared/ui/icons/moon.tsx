import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Полумесяц: тёмная тема. */
export const MoonIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M16.25 11.9A6.9 6.9 0 0 1 8.1 3.75 6.9 6.9 0 1 0 16.25 11.9Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
